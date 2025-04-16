export type Doctor = {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber?: string,
    password: string,
    isActive: boolean,
    isVerified: boolean,
    createdAt: string,
    updatedAt: string,
    profileImage?: string
    timeAvailablity?: string,
    hospitalName?: string
    yearOfExperince: number,
    fieldOfSpecialization?: string,
}