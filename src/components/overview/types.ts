export interface OverviewComponentProps {
  overviews: Overview[];
}

export interface ContentComponentProps {
  content: Overview[];
}

export interface Overview {
  id: string;
  type: string;
  image?: string;
  text?: OverviewText[];
  createdAt: string;
  updatedAt: string;
}

export interface OverviewText {
  content: string;
  link: string;
  annotations: Record<string, any>;
}
