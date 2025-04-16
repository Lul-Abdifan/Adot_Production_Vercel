export interface getAllFactsResponse {
  statusCode: string
  message: string
  data: Fact[]
}
export interface Fact {
  _id: string
  category: Category
  trimester: number
  day: number
  text: Text
  createdAt: string
  updatedAt: string
}

export interface Category {
  en: string
  am: string
}

export interface Text {
  en: string
  am: string
}
