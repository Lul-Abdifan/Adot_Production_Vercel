import { Version } from "./category";
import { Insight } from "./insight";

export type GetTopicsResponse = {
  statusCode: string
  message: string
  data: Topic[]
}

export type Topic = {
    _id: string;
    category: string;
    rank: string;
    insights: Insight[];
    createdAt: string;
    updatedAt: string;
    thumbnailImage: string,
    versions: Version[],
    archived: boolean
  }
  

  export type TopicFormData = Pick<Topic, 'category' | 'rank' > & {
    thumbnailImageFile?: File,
    title: string,
    description: string,
    titleAmh: string,
    descriptionAmh: string
  }
  
  export type TopicContainer = {
    data: Topic[];
  };
  
export type PopularTopic = {
  completionCount: number,
  documentId: string
  documentName: string
  popularityLevel: number
  viewCount: number
  topic: Topic;
}
export interface ApproveTopicResponse {
  statusCode: string
  message: string
  data: ApproveTopic
}

export interface ApproveTopic {
  _id: string
  versions: Version[]
  category: string
  rank: number
  archived: boolean
  status: boolean
  createdAt: string
  updatedAt: string
}

