# CDSCO Integration: Real-Time Fake Medicine Detection System

## 1. System Architecture (Industry-Standard)

Since CDSCO does not provide a public REST API, the system uses a **Semi-Automated Data Ingestion Pipeline**:

1.  **Ingestion Layer**: A Python/Node.js worker periodically checks the [CDSCO Official Portal](https://cdsco.gov.in/) for new public notices (Approved Drugs, NSQs, Banned Lists).
2.  **Processing Layer**: Extracted PDF/Excel documents are processed using OCR/Parsing (e.g., Tika, Pandas) into structured JSON.
3.  **Storage Layer**: Structured data is indexed in our PostgreSQL database for millisecond-latency lookups during user verification.
4.  **Verification Engine**: A multi-authority decision engine that cross-references:
    *   **CDSCO (Local)**: Primary legal authority for India.
    *   **openFDA (Remote)**: Secondary clinical and global recall data.
    *   **WHO GSMS**: Global counterfeit alerts.

## 2. Decision Logic Flow

1.  **Expiry Check**: Logical validation only. If `Current Date > Packaged Expiry` -> `UNSAFE`.
2.  **Regulatory Check (Banned)**: If Medicine is in the CDSCO Banned List -> `UNSAFE`.
3.  **Safety Alert Check (Batch)**: Cross-reference Batch No with periodic CDSCO NSQ (Not of Standard Quality) or Spurious drug reports.
4.  **Approval Check**:
    *   **Drug approved?** Check `cdsco_approved_drugs`.
    *   **Manufacturer licensed?** Check `cdsco_manufacturers`.
5.  **Final Status**:
    *   **VERIFIED**: Approved drug + Licensed Manufacturer + No active alerts.
    *   **SUSPICIOUS**: Approved drug but Manufacturer missing from license sync or Batch has minor quality alert.
    *   **UNSAFE**: Banned drug, Spurious batch, or Expired.

## 3. Database Schema Highlights

*   `cdsco_approved_drugs`: Stores generic and brand name registrations.
*   `cdsco_manufacturers`: Validates license numbers (e.g., DL-12345) and status.
*   `cdsco_safety_alerts`: Maps specific batch numbers to "Spurious" or "NSQ" alerts.

## 4. Compliance & Security

*   **Legally Accurate**: We do not claim batch-level expiry verification (which requires private company APIs). We rely on public regulatory notices.
*   **Industry Standards**: Follows GAMP 5 principles for computerized system validation in healthcare.
*   **Data Integrity**: Ingested data is versioned and timestamped to ensure we are using the latest public drug notices.

## 5. Viva-Ready Key Points

1.  **Why CDSCO?** It's the National Regulatory Authority (NRA) of India. No drug can be legally sold without its approval.
2.  **How do you handle no API?** We use a structured ingestion pipeline that converts public regulatory documents into a queryable database, ensuring real-time performance without unauthorized scraping.
3.  **Is Batch Expiry verification possible?** Not through public CDSCO data. We perform logical expiry checks and use batch numbers specifically for safety blacklists (NSQ/Spurious) issued by regulators.
4.  **Explain NSQ vs Spurious**:
    *   **NSQ (Not of Standard Quality)**: Real medicine that failed a quality test (e.g., dissolution). Status: *SUSPICIOUS/RECALL*.
    *   **Spurious**: A counterfeit or fake medicine with no active ingredients. Status: *UNSAFE*.
