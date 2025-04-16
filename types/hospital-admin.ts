export interface AppointmentsResponse {
  statusCode: string
  message: string
  data: Appointment
}

export interface Appointment {
  formattedAppointments: FormattedAppointment[]
}

export interface FormattedAppointment {
  _id?:string, 
  userId?: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  time: string;
  reminder: string;
  frequency: string;
  checklist: Checklist[];
  notificationScheduled?: boolean; // Marked optional
  headEvent?: string; // Marked optional
  createdAt?: string; // Marked optional
  updatedAt?: string; // Marked optional
  formattedTime?: string; // Marked optional
}


export interface Checklist {
  _id?: string
  description: string
  completed: boolean
}

export interface GetAllPatientResponse {
  statusCode: string
  message: string
  data: Data
}

export interface Data {
  patient: Patient[]
}

export interface Patient {
  doctor: string
  patient: PatientDetails
  HIV?: boolean
  VDRL: any
  HBSAG?: boolean
  Pelvimetry: any
  abortion?: boolean
  numberOfAbortion?: number
  SVD?: number
  CS: any
  sharedData: SharedData
  requestStatus: boolean
  updatedAt: string
  createdAt: string
}

export interface PatientDetails {
  _id: string
  firstName: string
  lastName: string
  profileImage: string
  phoneNumber?: string
  email?: string
  trimester: number
  weekOfPregnancy: number
}

export interface SharedData {
  kickCount: boolean
  contractionTimer: boolean
  bloodPressure: boolean
  weight: boolean
  sugarLevel: boolean
  medication: boolean
}
export interface GetFormattedAppointment {
  userId?: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  time: string;
  reminder: string;
  frequency: string;
  checklist: Checklist[];
  notificationScheduled?: boolean; // Marked optional
  headEvent?: string; // Marked optional
  createdAt?: string; // Marked optional
  updatedAt?: string; // Marked optional
  formattedTime?: string; // Marked optional
}