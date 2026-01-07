# AI-Enhanced Medicine Verification System

## Overview
This system extends a standard regulatory database lookup (CDSCO, FDA, WHO) with an AI Fallback mechanism using Google's Gemini API. This ensures that even if a specific brand or local generic medicine is not in the open-source datasets, the user receives helpful identification data while maintaining strict safety protocols.

## Architecture

### 1. Primary Layer (Deterministic)
- **Source**: PostgreSQL Database (Indian Medicines, CDSCO Approved, FDA).
- **Function**: Exact string matching and regulatory checks.
- **Verdict**: "VERIFIED" or "UNSAFE" (if alert found).

### 2. Secondary Layer (Probabilistic AI)
- **Source**: Google Gemini 1.5 Flash API.
- **Trigger**: Only when medicine is NOT found in Primary Layer.
- **Function**:
  - Identifies medicine metadata (Brand -> Generic, Uses, Manufacturer).
  - Does NOT validate safety or authenticity.
- **Verdict**: "AI_INFO_ONLY".

## Safety & Compliance Features
1. **No Hallucinated Approvals**: AI is explicitly instructed via prompt engineering to identifying *types* of medicine, not specific batch approvals.
2. **Standardized Disclaimer**: Every AI response is tagged with `source: "GEMINI_AI"` and accompanied by a mandatory disclaimer: *"This information is generated using AI and is not a regulatory verification."*
3. **UI Warning**: Frontend displays an "AI Generated" badge with a tooltip explaining legal limitations.
4. **Expiry Logic Disabled**: As per requirements, expiry date checks are removed/disabled to prevent false sense of security or conflicting data.

## API Response Structure
```json
{
  "source": "OPEN_DATABASE | GEMINI_AI",
  "verification_status": "VERIFIED | NO_ALERT_FOUND | UNSAFE | AI_INFO_ONLY",
  "medicine_details": {
    "brand_name": "...",
    "generic_name": "...",
    "composition": [...],
    "dosage_form": "...",
    "uses": [...],
    "manufacturer": "..."
  },
  "disclaimer": "..."
}
```

---

# Viva Justification

### Q1: Why use AI for medicine verification?
**A:** Open-source databases like openFDA or CDSCO are often incomplete regarding local Indian brands or regional generics. A purely database-driven system hits a "Not Found" dead-end for valid medicines. AI provides a "Soft Fallback"—identifying the molecule and uses so the user at least knows what the medicine is, even if we can't cryptographically verify the supply chain.

### Q2: Is it safe to rely on AI?
**A:** We do NOT rely on AI for *safety* judgments. We strictly use AI for *identification* (Information Extraction).
- If a batch is recalled, our Database Layer catches it (Deterministic).
- If a medicine is unknown, AI helps identify it (Probabilistic).
- We never allow AI to say "This medicine is Safe". It only says "This is likely Paracetamol".

### Q3: How do you prevent hallucinations?
**A:**
1. **Prompt Engineering**: We use strict constraints ("Return null if unsure", "Do not invent regulatory IDs").
2. **UI UX**: We clearly label AI data with a distinct color (Purple) and warning badges.
3. **Fallback Logic**: AI is the *last* resort, always prioritized after official regulatory content.

### Q4: Why Gemini API?
**A:** Gemini 1.5 Flash offers low latency and high cost-efficiency for text-based extraction tasks, making it ideal for a real-time user-facing application.
