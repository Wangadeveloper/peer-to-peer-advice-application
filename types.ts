export enum Category {
  ALL = 'All',
  AGRICULTURE = 'Agriculture',
  RETAIL = 'Retail',
  TECHNOLOGY = 'Technology',
  SERVICES = 'Services',
  HOSPITALITY = 'Hospitality',
  MANUFACTURING = 'Manufacturing'
}

export type PostType = 'video' | 'text';

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string; // Text content or Base64/URL for video
  author: string;
  category: Category;
  timestamp: number;
  summary?: string; // AI Generated summary
}

export interface AnalysisResult {
  isBusinessRelated: boolean;
  category: Category;
  summary: string;
  confidenceScore: number;
  reasoning: string;
}
