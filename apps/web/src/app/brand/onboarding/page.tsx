'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import {
  validatePan,
  validateGstin,
  validateCin,
  checkStatutoryConsistency,
  INDIAN_GST_STATE_CODES,
} from '@/lib/statutory/statutory-rules';
import { computeBrandVerificationBadge } from '@/lib/statutory/business-verification';
import { FileUploader } from '@/components/storage/file-uploader';

export default function BrandOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    accountType: 'BRAND', // BRAND | AGENCY | ENTERPRISE
    companyLegalName: '',
    brandName: '',
    website: '',
    industry: 'D2C Consumer Goods',
    companySize: '11-50 employees',
    logoUrl: '',
    addressStreet: '',
    addressCity: '',
    addressState: '27', // Maharashtra default state code
    addressPincode: '',
    billingContactName: '',
    billingContactEmail: '',
    billingContactPhone: '',
    pan: '',
    gstin: '',
    cin: '',
    dpdpConsentGiven: false,
  });

  // State for server-verified statuses
  const [verificationStatus, setVerificationStatus] = useState<
    'PENDING' | 'VERIFIED' | 'RESTRICTED' | 'SUSPENDED'
  >('PENDING');
  const [verificationDetails, setVerificationDetails] = useState<string>(
    'Format valid — not verified against a government source'
  );
  const [domainVerified, setDomainVerified] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // 1. Fetch existing server-persisted draft on mount (Resumable Onboarding)
  useEffect(() => {
    async function loadSavedDraft() {
      try {
        const res = await fetch('/api/brand/onboarding');
        if (!res.ok) {
          router.replace('/auth/brand/sign-in?redirect=/brand/onboarding');
          return;
        }

        const data = await res.json();
        if (data.user) {
          setUserEmail(data.user.email || '');
          if (data.user.status === 'RESTRICTED_WORK_EMAIL_REQUIRED') {
            setError(
              'Company Work Email Required: You must verify an official corporate work email before completing onboarding.'
            );
          }
        }

        if (data.profile) {
          const p = data.profile;
          setFormData((prev) => ({
            ...prev,
            accountType: p.accountType || prev.accountType,
            companyLegalName: p.companyName || prev.companyLegalName,
            brandName: p.brandName || prev.brandName || p.companyName || '',
            website: p.website || prev.website,
            industry: p.industry || prev.industry,
            companySize: p.companySize || prev.companySize,
            logoUrl: p.logoUrl || prev.logoUrl,
            addressStreet: p.legalAddress?.street || prev.addressStreet,
            addressCity: p.legalAddress?.city || prev.addressCity,
            addressState: p.legalAddress?.state || prev.addressState,
            addressPincode: p.legalAddress?.pincode || prev.addressPincode,
            billingContactName: p.billingContact?.name || p.contactName || prev.billingContactName,
            billingContactEmail: p.billingContact?.email || prev.billingContactEmail || data.user?.email || '',
            billingContactPhone: p.billingContact?.phone || prev.billingContactPhone,
            pan: p.pan || prev.pan,
            gstin: p.gstin || prev.gstin,
            cin: p.cin || prev.cin,
            dpdpConsentGiven: Boolean(p.dpdpConsent?.version),
          }));

          if (p.onboardingStep && p.onboardingStep >= 1 && p.onboardingStep <= 5) {
            setStep(p.onboardingStep);
          }
          if (p.verificationStatus) {
            setVerificationStatus(p.verificationStatus);
          }
          if (p.verificationDetails) {
            setVerificationDetails(p.verificationDetails);
          }
          if (p.domainVerified !== undefined) {
            setDomainVerified(p.domainVerified);
          }
        }
      } catch {
        setError('Failed to retrieve server draft. Please verify your connection.');
      } finally {
        setInitialLoading(false);
      }
    }

    loadSavedDraft();
  }, [router]);

  // Real-time local statutory validation checks
  const panCheck = formData.pan ? validatePan(formData.pan) : null;
  const gstinCheck = formData.gstin ? validateGstin(formData.gstin) : null;
  const cinCheck = formData.cin ? validateCin(formData.cin) : null;
  const consistencyCheck =
    formData.pan && formData.gstin
      ? checkStatutoryConsistency({ pan: formData.pan, gstin: formData.gstin })
      : null;

  const badgeComputation = computeBrandVerificationBadge({
    domainVerified,
    businessVerificationStatus: verificationStatus,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Save Step to Server
  const handleSaveStep = async (nextStep: number, isFinal: boolean = false) => {
    setLoading(true);
    setError(null);
    setSuccessNotice(null);

    // Validation per step
    if (step === 1) {
      if (!formData.companyLegalName.trim()) {
        setError('Company Legal Name is required.');
        setLoading(false);
        return;
      }
      if (!formData.website.trim()) {
        setError('Official company website is required.');
        setLoading(false);
        return;
      }
    }

    if (step === 3) {
      if (panCheck && !panCheck.valid) {
        setError(panCheck.error || 'Invalid PAN format.');
        setLoading(false);
        return;
      }
      if (gstinCheck && !gstinCheck.valid) {
        setError(gstinCheck.error || 'Invalid GSTIN format or checksum.');
        setLoading(false);
        return;
      }
      if (consistencyCheck && !consistencyCheck.consistent) {
        setError(consistencyCheck.error || 'GSTIN does not match PAN.');
        setLoading(false);
        return;
      }
    }

    if (step === 4 && isFinal && !formData.dpdpConsentGiven) {
      setError('You must accept the DPDP Act 2023 data processing consent to complete setup.');
      setLoading(false);
      return;
    }

    try {
      const payloadData: Record<string, any> = {
        accountType: formData.accountType,
        companyName: formData.companyLegalName.trim(),
        brandName: formData.brandName.trim() || formData.companyLegalName.trim(),
        website: formData.website.trim(),
        industry: formData.industry,
        companySize: formData.companySize,
        logoUrl: formData.logoUrl.trim(),
        legalAddress: {
          street: formData.addressStreet.trim(),
          city: formData.addressCity.trim(),
          state: formData.addressState,
          pincode: formData.addressPincode.trim(),
        },
        billingContact: {
          name: formData.billingContactName.trim(),
          email: formData.billingContactEmail.trim(),
          phone: formData.billingContactPhone.trim(),
        },
        pan: formData.pan.trim().toUpperCase(),
        gstin: formData.gstin.trim().toUpperCase(),
        cin: formData.cin.trim().toUpperCase(),
      };

      if (formData.dpdpConsentGiven) {
        payloadData.dpdpConsent = {
          version: '2026.1',
          timestamp: new Date().toISOString(),
          purposes: [
            'CREATOR_DISCOVERY',
            'PAYMENT_ESCROW',
            'TAX_INVOICING',
            'COMMUNICATION',
          ],
        };
      }

      const res = await fetch('/api/brand/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: nextStep,
          completed: isFinal,
          data: payloadData,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save onboarding draft.');
      }

      if (result.profile?.verificationStatus) {
        setVerificationStatus(result.profile.verificationStatus);
      }
      if (result.profile?.verificationDetails) {
        setVerificationDetails(result.profile.verificationDetails);
      }

      if (isFinal) {
        setSuccessNotice('Onboarding successfully completed! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/brand/dashboard');
        }, 1200);
      } else {
        setStep(nextStep);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating onboarding profile.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-muted-foreground animate-pulse">
            Restoring server-persisted onboarding draft...
          </p>
        </div>
      </div>
    );
  }

  // Setup Checklist Calculation
  const isProfileComplete = Boolean(
    formData.companyLegalName && formData.website && formData.industry
  );
  const isStatutoryFormatValid = Boolean(
    (formData.pan && (!panCheck || panCheck.valid)) ||
    (formData.gstin && (!gstinCheck || gstinCheck.valid))
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-border">
        <Logo variant="full" size="md" href="/brand/dashboard" />
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">
            {userEmail || 'Brand Setup'}
          </span>
          <Link
            href="/brand/dashboard"
            className="text-xs px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
          >
            Save & Exit
          </Link>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="max-w-4xl w-full mx-auto py-8">
        {/* Progress Tracker (5 Steps) */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Step {step} of 5</span>
            <span>
              {step === 1 && 'Brand Identity'}
              {step === 2 && 'Address & Contact'}
              {step === 3 && 'Statutory KYC & Tax'}
              {step === 4 && 'Domain & DPDP Consent'}
              {step === 5 && 'Setup Checklist & Blockers'}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Global Error Notice */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Global Success Notice */}
        {successNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            {successNotice}
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 1: ACCOUNT TYPE & BRAND IDENTITY                                */}
        {/* =================================================================== */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Company & Workspace Profile
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Select your workspace type and provide registered legal details.
              </p>
            </div>

            {/* Account Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Workspace Account Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'BRAND',
                    title: 'Brand / D2C',
                    desc: 'Direct advertiser managing creator campaigns for own products.',
                  },
                  {
                    id: 'AGENCY',
                    title: 'Marketing Agency',
                    desc: 'Agency managing multi-brand client rosters with isolated budgets.',
                  },
                  {
                    id: 'ENTERPRISE',
                    title: 'Enterprise',
                    desc: 'Corporate enterprise requiring dedicated RBAC & custom billing.',
                  },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, accountType: type.id }))
                    }
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                      formData.accountType === type.id
                        ? 'border-primary bg-primary/10 shadow-2xs'
                        : 'border-border bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-sm font-bold text-foreground">{type.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Company Legal Name & Brand Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Company Legal Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="companyLegalName"
                  value={formData.companyLegalName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Consumer Products Pvt Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Brand / Trade Display Name
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Lifestyle"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>

            {/* Website & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Official Website <span className="text-destructive">*</span>
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Industry / Sector
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                >
                  <option value="D2C Consumer Goods">D2C Consumer Goods</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Consumer Tech & Electronics">Consumer Tech & Electronics</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Fintech & Banking">Fintech & Banking</option>
                  <option value="EdTech & Education">EdTech & Education</option>
                  <option value="Travel & Hospitality">Travel & Hospitality</option>
                </select>
              </div>
            </div>

            {/* Company Size & Logo URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Company Team Size
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                >
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="51-200 employees">51-200 employees</option>
                  <option value="201-500 employees">201-500 employees</option>
                  <option value="500+ employees">500+ employees</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Company Logo
                </label>
                <FileUploader
                  purpose="brand_logo"
                  label="Upload Company Logo"
                  accept="image/jpeg,image/png,image/webp"
                  maxSizeLabel="JPEG, PNG, WebP up to 10 MB"
                  currentUrl={formData.logoUrl}
                  onUploaded={(res) => {
                    if (res.publicUrl) {
                      setFormData((prev) => ({ ...prev, logoUrl: res.publicUrl || '' }));
                    }
                  }}
                />
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://company.com/logo.png"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSaveStep(2)}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving draft...' : 'Continue to Address & Contact →'}
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: BUSINESS ADDRESS & BILLING CONTACT                           */}
        {/* =================================================================== */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Registered Address & Billing
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Required for GST compliance tax invoices and legal contracts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Registered Office Address
                </label>
                <input
                  type="text"
                  name="addressStreet"
                  value={formData.addressStreet}
                  onChange={handleChange}
                  placeholder="Building, Suite, Street name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">City</label>
                  <input
                    type="text"
                    name="addressCity"
                    value={formData.addressCity}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    State / UT (GSTIN Code)
                  </label>
                  <select
                    name="addressState"
                    value={formData.addressState}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                  >
                    {Object.entries(INDIAN_GST_STATE_CODES).map(([code, name]) => (
                      <option key={code} value={code}>
                        {code} - {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">PIN Code</label>
                  <input
                    type="text"
                    name="addressPincode"
                    value={formData.addressPincode}
                    onChange={handleChange}
                    placeholder="e.g. 400001"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Billing & Accounts Payable Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="billingContactName"
                    value={formData.billingContactName}
                    onChange={handleChange}
                    placeholder="Finance Manager"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Billing Email
                  </label>
                  <input
                    type="email"
                    name="billingContactEmail"
                    value={formData.billingContactEmail}
                    onChange={handleChange}
                    placeholder="invoicing@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="billingContactPhone"
                    value={formData.billingContactPhone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSaveStep(3)}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving draft...' : 'Continue to Statutory KYC →'}
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: STATUTORY TAX & KYC VERIFICATION (GSTIN, PAN, CIN)           */}
        {/* =================================================================== */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Statutory KYC & Tax Verification
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Input your Indian tax identifiers. All entries are validated locally via Luhn Mod-36 checksums and verified through our compliance port.
              </p>
            </div>

            {/* PAN Input */}
            <div className="space-y-2 p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Permanent Account Number (PAN)
                </label>
                {panCheck && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      panCheck.valid
                        ? 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {panCheck.valid ? `Valid · ${panCheck.entityType}` : panCheck.error}
                  </span>
                )}
              </div>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground font-mono text-base uppercase focus:outline-hidden focus:border-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                10-character alphanumeric PAN issued by the Income Tax Department of India.
              </p>
            </div>

            {/* GSTIN Input */}
            <div className="space-y-2 p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  GST Identification Number (GSTIN)
                </label>
                {gstinCheck && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      gstinCheck.valid
                        ? 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {gstinCheck.valid
                      ? `Luhn Checksum Valid · ${gstinCheck.stateName}`
                      : gstinCheck.error}
                  </span>
                )}
              </div>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="27ABCDE1234F1Z5"
                maxLength={15}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground font-mono text-base uppercase focus:outline-hidden focus:border-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                15-character GSTIN with 2-digit state code, embedded PAN, and Luhn Mod-36 check digit.
              </p>
            </div>

            {/* Cross-Check Notice */}
            {consistencyCheck && !consistencyCheck.consistent && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                ⚠ {consistencyCheck.error}
              </div>
            )}

            {/* CIN Input (Optional for Companies) */}
            <div className="space-y-2 p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Corporate Identification Number (CIN) — Optional
                </label>
                {cinCheck && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      cinCheck.valid
                        ? 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {cinCheck.valid
                      ? `Valid CIN · ${cinCheck.listingStatus} · ${cinCheck.incorporationYear}`
                      : cinCheck.error}
                  </span>
                )}
              </div>
              <input
                type="text"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                placeholder="U74999MH2018PTC123456"
                maxLength={21}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground font-mono text-sm uppercase focus:outline-hidden focus:border-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                21-digit CIN for registered Private and Public Limited companies in India.
              </p>
            </div>

            {/* Honest Adapter Status Notice */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
              <div className="text-xs font-bold text-foreground">
                Verification Gateway Status
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {verificationDetails}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSaveStep(4)}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving draft...' : 'Continue to Domain & DPDP Consent →'}
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: DOMAIN PROOF & DPDP ACT 2023 CONSENT                        */}
        {/* =================================================================== */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Domain Proof & Compliance Consent
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Domain verification protects your brand from impersonation. The DPDP Act 2023 governs secure corporate data processing.
              </p>
            </div>

            {/* Domain Verification Proof Card */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Corporate Domain Proof
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    domainVerified
                      ? 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
                      : 'bg-amber-500/10 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300'
                  }`}
                >
                  {domainVerified ? 'DNS TXT Verified' : 'Domain Proof Pending'}
                </span>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed">
                {domainVerified
                  ? 'Your company domain ownership has been successfully confirmed via DNS TXT record challenge.'
                  : 'Add the challenge record _adzunova-challenge.<your-domain> with your HMAC token to your DNS manager to activate the official Verified Business badge.'}
              </div>

              {!domainVerified && (
                <div className="pt-2">
                  <Link
                    href="/brand/safety"
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    View DNS TXT Challenge Details in Brand Safety →
                  </Link>
                </div>
              )}
            </div>

            {/* DPDP Act 2023 Consent Declaration */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                DPDP Act 2023 Statutory Consent (Version 2026.1)
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  In accordance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, Adzunova processes enterprise account details, authorized representative contacts, and tax identification records solely for specified purposes:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Creator discovery, vetting, and performance metric tracking.</li>
                  <li>Milestone escrow allocation and authorized booking contracts.</li>
                  <li>Issuing GST compliant tax invoices and TDS withholding reporting.</li>
                  <li>Operational platform security, anti-impersonation, and audit logging.</li>
                </ul>
                <p className="text-[11px] text-muted-foreground">
                  Consent is timestamped, cryptographically logged, and bound to your registered corporate IP and session signature.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  name="dpdpConsentGiven"
                  checked={formData.dpdpConsentGiven}
                  onChange={handleChange}
                  className="mt-0.5 rounded-sm border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-medium text-foreground leading-relaxed">
                  I am an authorized representative of <strong>{formData.companyLegalName || 'this business'}</strong> and consent to data processing under DPDP Act 2023 terms and platform Terms of Service.
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={loading || !formData.dpdpConsentGiven}
                onClick={() => handleSaveStep(5)}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving draft...' : 'Review Setup Checklist →'}
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: SETUP CHECKLIST & BLOCKERS REVIEW                           */}
        {/* =================================================================== */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Workspace Setup Checklist & Readiness
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Review your workspace onboarding readiness and active milestone launch blockers.
              </p>
            </div>

            {/* Combined Verification Badge Preview */}
            <div className="p-6 rounded-3xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Verification Badge
                </div>
                <div className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span>{badgeComputation.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {badgeComputation.subtext}
                </p>
              </div>

              <div className="shrink-0">
                <span
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold border ${
                    badgeComputation.badgeTone === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      : badgeComputation.badgeTone === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  {badgeComputation.badge}
                </span>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {/* Item 1: Profile */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Company & Brand Profile
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formData.companyLegalName} · {formData.website}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Item 2: Domain Proof */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      domainVerified
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {domainVerified ? '✓' : '!'}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Corporate Domain DNS TXT Proof
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {domainVerified
                        ? 'DNS challenge verified'
                        : 'Pending DNS TXT record configuration'}
                    </div>
                  </div>
                </div>
                {!domainVerified && (
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    Recommended
                  </span>
                )}
              </div>

              {/* Item 3: Business Verification */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isStatutoryFormatValid
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isStatutoryFormatValid ? '✓' : '•'}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Statutory Tax & KYC Verification
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {verificationDetails}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Item 4: Payment Method */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs">
                    •
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Wallet & Escrow Funding
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Configure corporate banking & escrow payment methods in Phase H
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Scheduled
                </span>
              </div>

              {/* Item 5: First Campaign */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs">
                    •
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      First Creator Campaign Brief
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Launch after completing onboarding
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Ready
                </span>
              </div>
            </div>

            {/* Launch Blockers Banner */}
            {!isProfileComplete && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                ⚠ Launch Blocker: Please complete company legal name and website before completing onboarding.
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={loading || !isProfileComplete}
                onClick={() => handleSaveStep(5, true)}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Finalizing Setup...' : 'Complete Onboarding & Enter Workspace →'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Adzunova Enterprise Security & DPDP Compliance</span>
        <span>Version 2026.1</span>
      </footer>
    </div>
  );
}
