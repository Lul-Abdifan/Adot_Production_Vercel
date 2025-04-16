export type PatientData = {
isActive: boolean | undefined
_id:string,
firstName: string,
lastName: string,
profileImage?: string,
trimester:number,
weekOfPregnancy:number,
email?: string,
phoneNumber?: string,
requestStatus:boolean

}



export type Patient = {
    doctor:string,
    patient:PatientData
    requestStatus:boolean
}

export type AddPatientData =  {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    lastManstrialCycle?: string;
    gestationalAge?: number;
    firstUltrasoundDate?: string;
  }
  
