export type Insight = {
  _id: string;
  title: string;
  topic: string;
  category: string;
  stage: number;
  status: boolean;
  rank: number;
  trimesters: number[];
  pregnancyWeeks: number[];

  versions: Version[];
  archived: boolean;
  thumbnailImage: string;
  updatedAt: string;
  createdAt: string;
};

export type Version = {
  language: string;
  title: string;
  content: string;
  _id?: string;
};

export type InsightFormData = Pick<Insight, "topic" | "rank"> & {
  thumbnailImageFile?: File;
  title: string;
  description: string;
  titleAmh: string;
  descriptionAmh: string;
  category: string;
  reference: string[];
  reviewer: string;
  trimesters: number[];
  pregnancyWeeks: number[];
};

export type InsightContainer = {
  data: Insight[];
};

export type PopularInsight = {
  completionCount: number;
  documentId: string;
  documentName: string;
  popularityLevel: number;
  viewCount: number;
  insight: Insight;
};
export interface ApproveInsightResponse {
  statusCode: string;
  message: string;
  data: ApproveInsight;
}

export interface ApproveInsight {
  _id: string;
  versions: Version[];
  topic: string;
  category: string;
  thumbnailImage: string;
  archived: boolean;
  stage: number;
  reference: string[];
  reviewer: string;
  rank: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
