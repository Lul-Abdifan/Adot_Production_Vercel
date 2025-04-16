// types/material.ts

export interface Material {
  _id: string;
  title: string;
  description: string;
  document: string; 
  thumbnailImage: string; 
  status?: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export type MaterialContainer = {
  data: Material[];
};
