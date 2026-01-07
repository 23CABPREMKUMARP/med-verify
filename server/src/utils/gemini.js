const { GoogleGenerativeAI } = require("@google/generative-ai");

const getMedicineDetailsFromAI = async (medicineName, manufacturer) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set in environment variables.");
            return null;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-flash-latest as an alias for the most current flash model
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        You are a senior pharmaceutical regulatory consultant.
        The user is verifying a medicine named: "${medicineName}" ${manufacturer ? `, Manufacturer: "${manufacturer}"` : ""}.

        Your task is to:
        1. Identify the medicine (Brand/Generic).
        2. Assess the LEGITIMACY and RISK based entirely on pharmaceutical knowledge.
        3. Provide structured details or risk flags.

        STRICT RULES FOR RISK ASSESSMENT (FOLLOW EXACTLY):
        - RISK LEVEL = "LOW" for ANY real, valid medicine (e.g., Amoxicillin, Paracetamol, Antibiotics, Schedule H).
        - PRESCRIPTION DRUGS ARE "LOW" RISK in this context because they are real medicines.
        - ONLY Use "HIGH" RISK if the name is FAKE, IMAGINARY, or UNKNOWN to science.
        - Examples:
          - "Amoxicillin" -> found: true, risk_level: "LOW" (It is a real drug).
          - "Dolo 650" -> found: true, risk_level: "LOW" (It is a real drug).
          - "FakeCureZero" -> found: false, risk_level: "HIGH" (Not a real drug).
          - "RandomText123" -> found: false, risk_level: "HIGH".

        Output JSON Structure:
        {
            "found": boolean,
            "risk_level": "LOW" | "HIGH",
            "reason": "Explanation of risk or identification",
            "brand_name": "Standardized Brand Name",
            "generic_name": "Generic Name / Salt",
            "composition": ["Active Ingredient 1", "Active Ingredient 2"],
            "dosage_form": "Tablet | Syrup | Injection | etc",
            "uses": ["Use Case 1", "Use Case 2"],
            "manufacturer": "Likely Manufacturer",
            "drug_class": "Therapeutic Class",
            "approximate_price": "ESTIMATE INR X-Y per strip (Indicative only)"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Raw Response:", text);

        // More robust JSON extraction
        let jsonStr = text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }

        try {
            const data = JSON.parse(jsonStr);
            if (data.found === false) {
                console.log(`Gemini could not identify medicine: ${medicineName}`);
                return null;
            }
            return data;
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON. Raw text:", text);
            return null;
        }

    } catch (error) {
        console.error("Gemini API Error Detail:", error);
        return null;
    }
};

module.exports = { getMedicineDetailsFromAI };
