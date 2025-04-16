import { Topic } from "./topic";
export type Version = {
    language: string;
    title: string;
    description: string;
    _id?: string;
  };
  
export type Category = {
    _id: string;
    versions: Version;
    rank: number;
    topics: Topic[];
    createdAt: string
    updatedAt: string
    archived: boolean
  };
    export type CategoriesContainer = {
      data: Category[];
    };
    
  export type CategoryFormData = {
      title: string,
      titleAmh: string,
      rank: number
    }
    
  
  export type PopularCategory = {
    viewCount: number;
    completionCount: number;
    category: Category;
    documentId: string;
    documentName: string;
    popularityLevel: number;
  };
  export interface ApproveCategoryResponse {
    statusCode: string
    message: string
    data: ApproveCategory
  }
  
  export interface ApproveCategory {
    _id: string
    versions: Version
    thumbnailImage: string
    rank: number
    archived: boolean
    status: boolean
    createdAt: string
    updatedAt: string
  }