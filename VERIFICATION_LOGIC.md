# Medicine Verification Alert System - Logic & Design

## 1. Verification Decision Engine (Backend)

The system adheres to a strict hierarchy of authority for verifying medicines. This logic ensures compliance with legal safety standards.

### Priority 1: Unsafe / Banned (Critical)
**Trigger:** The medicine or batch is found in:
1.  **CDSCO Banned Drug List** (India)
2.  **CDSCO Safety Alerts** (NSQ - Not of Standard Quality)
3.  **WHO Medical Product Alerts** (Falsified/Substandard)
4.  **FDA Recall Database** (Class I/II Recalls)

**Result:** `UNSAFE`
**Action:** Immediate full-screen red alert. User is instructed NOT to consume.

### Priority 2: Verified (Safe)
**Trigger:**
1.  The immediate "Unsafe" check passes (not unsafe).
2.  The medicine IS found in the **Approved Drugs Database** (CDSCO Approved / Indian National Formulary).

**Result:** `VERIFIED`
**Action:** Green full-screen confirmation. Visual proof of regulatory match is shown.

### Priority 3: Not Verified / High Risk (Caution)
**Trigger:**
1.  The immediate "Unsafe" check passes.
2.  The medicine is NOT found in the local Approved Database.
3.  *Even if AI identifies it*, the lack of an official database record prevents a "Verified" status.

**Result:** `NOT_VERIFIED` (Amber Alert)
**Action:** Warning screen detailing that the drug could not be cross-referenced with official records.

---

## 2. Frontend Alert Architecture

The frontend uses a unified `FullScreenResultModal` component to enforce a "System interruption" UX pattern.

### Core Features:
*   **Viewport Lock:** `fixed inset-0 z-[100]` ensures the alert is the only interactive element.
*   **Backdrop Blur:** High-opacity backdrop with blur (`backdrop-blur-xl`) hides the underlying app interface to focus attention.
*   **Sound Architecture:**
    *   Uses HTML5 `Audio` API.
    *   Triggers only after the "Verify" user interaction (compliance with browser autoplay policies).
    *   Preloaded base64 audio strings ensure zero network latency for alerts.
    *   **Mute Toggle:** Persistent toggle allowing users to silence the alarm.

### UI Themes:

| Status | Color Theme | Icon | Sound | Animation |
| :--- | :--- | :--- | :--- | :--- |
| **VERIFIED** | Emerald (Green) | Shield Check | Soft Chime | Zoom In + Soft Glow |
| **NOT VERIFIED** | Amber (Orange) | Alert Triangle | Warning Beep | Gentle Pulse |
| **UNSAFE** | Red / Black | Danger Triangle | Critical Siren | Aggressive Pulse + Red Border |

---

## 3. Educational Information Panel (Unsafe Only)

To serve the academic/demo requirement, a special panel appears only for `UNSAFE` results.

**Data Points:**
1.  **Official Reason:** The exact text from the regulatory order (e.g., "Found to contain carcinogenic impurities").
2.  **Issuing Authority:** Explicit citation (e.g., CDSCO, WHO).
3.  **Historical Uses:** A "Strikethrough" list showing what the drug was *previously* used for, emphasizing that these uses are no longer valid valid safely.

---

## 4. Viva / Demo Explanation

**Q: How do you prevent false positives?**
A: "We rely on a whitelist (Approved DB) and a blacklist (Banned DB). If a drug is in neither (e.g., a new obscure brand), we default to 'Not Verified' rather than guessing 'Safe' or 'Unsafe'. This 'Fail-Safe' approach protects the user."

**Q: Why separate 'Not Verified' from 'Unsafe'?**
A: "'Unsafe' means we have proof of danger. 'Not Verified' means we lack proof of safety. Legally and medically, these are distinct states requiring different user behaviors (Stop vs. Consult)."

**Q: How is sound handled?**
A: "Sounds are triggered via a `useEffect` hook listening to the verification result state. We use a muted-by-default logic if the user prefers, but otherwise play a single alert tone to reinforce the visual feedback."
