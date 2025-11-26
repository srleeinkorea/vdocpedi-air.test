import { GoogleGenAI } from "@google/genai";
import { PatientData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are V.Doc AI, a specialized medical assistant for pediatric home care, specifically for patients with Bronchopulmonary Dysplasia (BPD).
You are speaking to a guardian/parent.
Tone: Professional, calm, urgent when necessary, and supportive.
Your answers should be based on the provided patient data.
If vital signs are dangerous (SpO2 < 90%, High RR, High P-Peak), emphasize the need for immediate medical attention.
Keep responses concise (under 3 sentences unless asked for detail) and easy to understand for a parent.
Always output in Korean.
`;

export const generateMedicalAdvice = async (
  query: string,
  patientData: PatientData
): Promise<string> => {
  try {
    const context = `
    Patient Context:
    Diagnosis: ${patientData.emrDiagnosis}
    Current SpO2: ${patientData.spo2}% (Threshold: 90%)
    Current RR: ${patientData.rr} bpm
    Ventilator P-Peak: ${patientData.p_peak_measured} cmH2O (Threshold: ${patientData.p_peak_threshold})
    P-Drive: ${patientData.p_drive_measured}
    FiO2: ${patientData.fio2_setting}%
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Context: ${context}\n\nUser Query: ${query}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, 
      },
    });

    return response.text || "죄송합니다. 현재 AI 응답을 불러올 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};