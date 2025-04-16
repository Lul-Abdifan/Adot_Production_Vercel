export type User = {
    hospitalId?: string
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isActive: boolean,
    isVerified: boolean,
    role: string,
    bio?: string,
    createdAt: string,
    updatedAt: string,
    profileImage?: any,
  }

  export type UserFormData = Pick<User, 'firstName' | 'lastName' | 'email'> & {
    profileImage?: any,
    bio?: string,
    firstName: string,
    lastName: string,
    email: string,
  }

  export type MobileUser = {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    isActive: boolean,
    lastActive: string,
    profileImage?: string,
  }

  export type MobileUsersTableFilters = {
    page: number
    limit: number
    sortBy: string
    sortOrder: string
    status: string
  }

  export type DashboardUsersTableFilters = MobileUsersTableFilters & {role: string}