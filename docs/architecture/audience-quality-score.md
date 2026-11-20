# Audience Quality Score Specification

## 1. Purpose & Guiding Principles
The Audience Quality Score (AQS) provides brand advertisers and creators with an objective, cryptographically verified measure of an audience's organic integrity and engagement fidelity.

Adzunova enforces strict **Truth and Consistency**:
- **Zero Mock / Synthetic Scoring**: AQS is derived solely from official first-party Meta Graph API OAuth telemetry.
- **Completeness Gate**: Never display a fractional or partial number. When inputs are incomplete, display `"Not enough data"`.
- **Public Protection**: On public media kits and storefronts, partial or unverified scores are strictly withheld to preserve creator credibility and advertiser trust.

---

## 2. Factor Architecture & Formula

The Audience Quality Score is bounded on a scale of $[0, 100]$ and computed across 3 independent, weighted factors:

$$\text{AQS} = w_{\text{demo}} \cdot S_{\text{demo}} + w_{\text{views}} \cdot S_{\text{views}} + w_{\text{stab}} \cdot S_{\text{stab}}$$

Where:
- $w_{\text{demo}} = 0.40$ (40% Weight): Demographic Completeness
- $w_{\text{views}} = 0.40$ (40% Weight): Active Impression Ratio
- $w_{\text{stab}} = 0.20$ (20% Weight): Follower Progression Stability

### Factor 1: Demographic Completeness ($S_{\text{demo}}$, Weight: 40%)
Evaluates whether follower demographics represent real, adult, active human accounts:
$$S_{\text{demo}} = \min(100, \text{round}(\text{Share}_{18+} \times 80 + \text{Share}_{\text{gender\_known}} \times 20))$$
- **Inputs**: Meta Graph API `follower_demographics` breakdown (`age`, `gender`, `country`).
- **Prerequisite**: Total sampled audience count $> 0$.

### Factor 2: Active Impression Ratio ($S_{\text{views}}$, Weight: 40%)
Evaluates active audience consumption velocity against total registered followers:
$$S_{\text{views}} = \min\left(100, \text{round}\left(\frac{\text{Views}_{24h}}{\text{Followers}_{\text{total}}} \times 150\right)\right)$$
- **Inputs**: Meta Graph API `GET /{ig_id}/insights?metric=views&metric_type=total_value&period=day`.
- **Prerequisite**: 24-hour impression point $> 0$ and Followers count $> 0$.

### Factor 3: Follower Progression Stability ($S_{\text{stab}}$, Weight: 20%)
Audits the historical consistency of the follower trajectory, penalizing inorganic follower acquisition spikes:
- Baseline score: $85/100$ when organic growth gradient remains within expected platform distributions.
- **Prerequisite**: Minimum of 3 historical snapshot intervals recorded in PostgreSQL `social_metrics`.

---

## 3. Minimum History Threshold & Release Gate

A score is marked `COMPLETE` **only** when all 3 factors satisfy their prerequisites:
1. Valid demographics snapshot exists (`totalAudienceSampled > 0`).
2. Valid 24h view impression count exists (`totalViews24h !== null`).
3. Minimum 3 chronological follower snapshots exist in the repository (`points.length >= 3`).

If **any** factor is absent:
- `isScoreComplete = false`
- `audienceScore = null`
- `audienceScoreDisplay = "Not enough data"`
- `qualityEvaluation.missingFactors` enumerates the exact pending requirements.
- Public Media Kit displays `"Not enough data"` with sublabel `"Minimum history required"`.
