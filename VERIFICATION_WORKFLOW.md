# Enhanced Medicine Verification Workflow

## 1. Strict Verification Priority Order
This system is architected to prioritize patient safety by consulting the most relevant regulatory bodies in a strict hierarchy.

### Priority 1: CDSCO (India) – **HIGHEST PRIORITY**
As the primary regulator for the region, all queries first check Indian safety alerts.
*   **Checks**:
    *   **Banned Drugs**: Is the molecule banned? (Result: UNSAFE)
    *   **Safety Alerts (NSQ/Spurious)**: Is the specific batch flagged as Not of Standard Quality or Spurious? (Result: UNSAFE)
    *   **Approved List**: Is the drug legally approved in India? (Result: VERIFIED)

### Priority 2: FDA (United States)
If no localized alert is found, we consult global standards.
*   **Checks**:
    *   **Recalls**: Is there a Class I/II recall or enforcement report? (Result: UNSAFE)
    *   **Reference**: Does it appear in the FDA Drug Label Database? (Result: VERIFIED)

### Priority 3: WHO (Global)
Final safety net for international falsified medical product alerts.
*   **Checks**:
    *   **GSMS Alerts**: Global Surveillance and Monitoring System warnings. (Result: UNSAFE)

---

## 2. Decision Logic & Status Types

### A. UNSAFE (Critical)
*   **Trigger**: Found in CDSCO Alerts, FDA Recalls, or WHO Blacklists.
*   **UI Indication**: Red Warning.
*   **User Action**: "Do NOT Consume."

### B. VERIFIED (Trusted)
*   **Trigger**: Explicitly found in CDSCO Approved Drugs or FDA Official Databases.
*   **UI Indication**: Green Check.
*   **User Action**: Safe to proceed (subject to physical package integrity).

### C. NO ALERT FOUND (Neutral)
*   **Trigger**:
    *   Not found in any "Bad List" (Alerts).
    *   Not explicitly in "Approved List" (due to DB limitations).
    *   **AI Identification confirmed it is a valid medicine.**
*   **UI Indication**: Blue Shield.
*   **Meaning**: "No regulatory alert found. Medicine name is valid."

### D. UNVERIFIED / HIGH RISK (Warning)
*   **Trigger**:
    *   Not found in any official DB.
    *   **AI Identification FAILED** or flagged it as **Suspicious/Gibberish**.
*   **UI Indication**: Orange/Red Warning.
*   **Meaning**: "We cannot verify this exists. High risk of counterfeit or typo."

---

## 3. AI Fallback & Transparency Rule

### Role of AI (Gemini)
*   The AI is **only** accessed if the medicine is not found in local or global regulatory databases.
*   **Purpose**: To populate informational details (Uses, Side Effects) and perform a "Common Sense" check on the name/manufacturer.
*   **Risk Assessment**: The AI explicitly checks for suspicious patterns (e.g., specific known fake names, nonsensical inputs).

### Transparency Policy
*   **UI**: The user interface generally **hides** the AI source to avoid confusion. usage.
    *   AI-verified data is presented as "No Regulatory Alert Found" (Neutral).
    *   AI-rejected data is presented as "High Risk".
*   **Internal Logs**: All AI interactions are logged with `GEMINI_AI` source for system auditing.

---
## 4. Legal Disclaimer
This system aggregates public regulatory data. It does **not** perform chemical analysis. "Verified" status refers to the *data record*, not the physical pill in hand. Users should always check physical packaging security features.
