
export type MyEvent = {
 userId?:string
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  time: string;
  frequency: string;
  reminder: string;
  checklist: { description: string; completed: boolean }[];
};

export type AddEvent = {
  patientId?: string,
 userId?:string
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  time: string;
  frequency: string;
  reminder: string;
  checklist: { description: string; completed: boolean }[];
};
export type GetEvent = {
  _id?:string,
 userId?:string
  title: string;
  description: string;
  start: Date;
  end: Date;
  time: string;
  frequency: string;
  reminder: string;
  checklist: { description: string; completed: boolean }[];
};
