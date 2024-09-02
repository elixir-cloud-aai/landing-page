export interface SolutionComponentProps {
  data: Solution;
}

export interface Solution {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: Content[];
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface Content {
  id: string;
  type: string;
  text?: Text[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Text {
  content: string;
  link: any;
  annotations: Record<string, any>;
}
