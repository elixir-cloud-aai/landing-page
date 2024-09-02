export interface SolutionsComponentProps {
  solutions: Solutions[];
}

export interface Solutions {
  id: string;
  title: string;
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
