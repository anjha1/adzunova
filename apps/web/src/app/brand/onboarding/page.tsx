'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';

export default function BrandOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'D2C Consumer Goods',
    companySize: '11-50 employees',
    website: '',
    targetBudget: '₹1,00,000 - ₹5,00,000 / month',
    primaryGoal: 'High-Converting Influencer Integrations',
  });

  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/auth/brand/sign-in?redirect=/brand/onboarding');
          return;
        }
        const data = await res.json();
        if (!data.authenticated || data.user?.role !== 'BRAND') {
          router.replace('/auth/brand/sign-in?redirect=/brand/onboarding');
          return;
        }
        if (data.profile?.onboardingCompleted) {
          router.replace('/brand/dashboard');
          return;
        }
        if (data.profile?.companyName && !formData.companyName) {
          setFormData((prev) => ({
            ...prev,
            companyName: data.profile.companyName || '',
            industry: data.profile.industry || prev.industry,
          }));
        }
      } catch {
        router.replace('/auth/brand/sign-in?redirect=/brand/onboarding');
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAuth();
  }, [router, formData.companyName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (isFinal: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'onboarding',
          step,
          completed: isFinal,
          data: formData,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save company profile.');
      }

      if (isFinal) {
        router.push('/brand/dashboard');
      } else {
        setStep(step + 1);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save company profile.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm font-semibold text-muted-foreground animate-pulse">
          Verifying brand session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-xl mx-auto">
        {/* Brand Logo Header */}
        <div className="flex justify-center mb-6">
          <Logo variant="full" size="md" href="/" badgeText="BRAND ONBOARDING" />
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Step {step} of 2
            </span>
            <span className="text-xs text-muted-foreground">
              {step === 1 && 'Company Profile'}
              {step === 2 && 'Campaign Objectives'}
            </span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-6 p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Corporate Identity</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Establish your brand profile for creator collaborations.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Organization / Brand Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Innovations Inc."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Industry Vertical
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="D2C Consumer Goods">D2C & Consumer Products</option>
                  <option value="SaaS & Technology">SaaS & B2B Technology</option>
                  <option value="Fintech">Fintech & Banking</option>
                  <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                  <option value="Gaming & Entertainment">Gaming & Entertainment</option>
                  <option value="Agency & Media">Advertising Agency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Company Size
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="1-10 employees">1 - 10 (Early Stage)</option>
                  <option value="11-50 employees">11 - 50 (Growth)</option>
                  <option value="51-200 employees">51 - 200 (Scale-up)</option>
                  <option value="200+ employees">200+ employees</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleNext(false)}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition duration-200 mt-4"
              >
                Proceed to Campaign Goals →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Marketing Scope</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Specify budget targets to match with relevant creators.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Estimated Monthly Creator Budget
                </label>
                <select
                  name="targetBudget"
                  value={formData.targetBudget}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="< ₹1,00,000 / month">&lt; ₹1,00,000 / month</option>
                  <option value="₹1,00,000 - ₹5,00,000 / month">₹1,00,000 - ₹5,00,000 / month</option>
                  <option value="₹5,00,000 - ₹20,00,000 / month">₹5,00,000 - ₹20,00,000 / month</option>
                  <option value="₹20,00,000+ / month">₹20,00,000+ / month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Primary Objective
                </label>
                <select
                  name="primaryGoal"
                  value={formData.primaryGoal}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="High-Converting Influencer Integrations">High-Converting Influencer Integrations</option>
                  <option value="Scale UGC Production for Paid Ads">Scale UGC Production for Paid Ads</option>
                  <option value="Brand Awareness & Product Launches">Brand Awareness & Product Launches</option>
                  <option value="Long-term Brand Ambassador Contracts">Long-term Brand Ambassador Contracts</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-1/3 py-3 px-4 rounded-xl font-semibold border border-border text-foreground hover:bg-muted transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => handleNext(true)}
                  disabled={loading}
                  className="w-2/3 py-3 px-4 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 shadow-xs transition"
                >
                  {loading ? 'Completing Setup...' : 'Enter Brand Dashboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
