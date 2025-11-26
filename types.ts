
export type ScreenName = 'home' | 'triage' | 'ventilator' | 'emr' | 'pro' | 'report' | 'clinic' | 'more';

export interface PatientData {
  name: string;
  age: number;
  emrDiagnosis: string;
  spo2: number;
  rr: number;
  vtidal_measured: number;
  vtidal_target: number;
  p_peak_measured: number;
  p_peak_threshold: number;
  p_drive_measured: number;
  fio2_setting: number;
  rate_setting: number;
  patient_rate: number;
  compliance: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
}

export const DANGER_DATA: PatientData = {
  name: "김민준",
  age: 3,
  emrDiagnosis: "기관지 이형성증 (만성 폐쇄성 폐질환)",
  spo2: 89,
  rr: 42,
  vtidal_measured: 60,
  vtidal_target: 55,
  p_peak_measured: 35,
  p_peak_threshold: 30,
  p_drive_measured: 20,
  fio2_setting: 40,
  rate_setting: 20,
  patient_rate: 22,
  compliance: "저하"
};
