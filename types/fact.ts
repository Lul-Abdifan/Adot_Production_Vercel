export interface createFactResponse {
  statusCode: string
  message: string
  data: Data
}

export interface Data {
  category: Category
  trimester: number
  day: number
  text: Text
  _id: string
  createdAt: string
  updatedAt: string
}


export interface createFactRequest {
  category: Category
  trimester: number
  day: string
  text: Text
}

export interface Category {
  en: string
  am?: string
}

export interface Text {
  en: string
  am?: string
}