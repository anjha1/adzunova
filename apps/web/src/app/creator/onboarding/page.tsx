'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    displayName: '',
    category: 'Influencer',
    bio: '',
    country: 'India',
    portfolioUrl: '',
    youtube: '',
    instagram: '',
    tiktok: '',
  });

  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/auth/creator/sign-in?redirect=/creator/onboarding');
          return;
        }
        const data = await res.json();
        if (!data.authenticated || data.user?.role !== 'CREATOR') {
          router.replace('/auth/creator/sign-in?redirect=/creator/onboarding');
          return;
        }
        if (data.profile?.onboardingCompleted) {
          router.replace('/creator/dashboard');
          return;
        }
        if (data.profile?.displayName && !formData.displayName) {
          setFormData((prev) => ({
            ...prev,
            displayName: data.profile.displayName || '',
            category: data.profile.category || prev.category,
          }));
        }
      } catch {
        router.replace('/auth/creator/sign-in?redirect=/creator/onboarding');
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        throw new Error(result.error || 'Failed to save onboarding data.');
      }

      if (isFinal) {
        router.push('/creator/dashboard');
      } else {
        setStep(step + 1);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save onboarding data.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm font-semibold text-muted-foreground animate-pulse">
          Verifying creator session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-xl mx-auto">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Step {step} of 3
            </span>
            <span className="text-xs text-muted-foreground">
              {step === 1 && 'Profile Basics'}
              {step === 2 && 'Social Channels'}
              {step === 3 && 'Portfolio & Review'}
            </span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
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
                <h2 className="text-2xl font-bold text-foreground">Creator Identity</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  How should brands and sponsors recognize your creative brand?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Public Creator Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Rivera or @alextech"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Primary Content Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-600 outline-none"
                >
                  <option value="Influencer">Social Media Influencer</option>
                  <option value="Tech">Tech Reviewer / Software</option>
                  <option value="Gaming">Gaming & Streaming</option>
                  <option value="UGC">UGC Specialist</option>
                  <option value="Fashion">Fashion & Lifestyle</option>
                  <option value="Musician">Musician / Audio Artist</option>
                  <option value="Education">Education & Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Short Bio (Elevator Pitch)
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell brands what sets your storytelling apart..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleNext(false)}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 mt-4"
              >
                Continue to Socials →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Connect Channels</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Link your primary channels for analytics and discovery.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="text"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@handle"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@yourhandle"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  TikTok Profile
                </label>
                <input
                  type="text"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  placeholder="@yourtiktok"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-600 outline-none"
                />
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
                  onClick={() => handleNext(false)}
                  disabled={loading}
                  className="w-2/3 py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Media Kit & Portfolio</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Provide a showcase link to your past creative work or press kit.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Portfolio / Website Link
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://mycreativework.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  Setup Complete
                </h4>
                <p className="text-xs text-muted-foreground">
                  Your profile details will be saved to your creator account and indexed for brand searches.
                </p>
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
                  className="w-2/3 py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
                >
                  {loading ? 'Completing Setup...' : 'Launch Creator Dashboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
