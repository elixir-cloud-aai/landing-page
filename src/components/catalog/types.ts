export interface Owner {
  name: string;
  email: string | null;
  image: string | null;
}

export interface RelatedRepo {
  name: string;
  description: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  description: string;
  audience?: string[];
  features?: string[];
  howItWorks?: string[];
  requirements?: string[];
  deployment?: string[];
  quickStart?: string[];
  techStack?: string[];
  relatedRepos?: RelatedRepo[];
  extraLinks?: { label: string; url: string }[];
  usageExample?: { language: string; code: string };
  status?: string;
  standards: string[];
  tags: string[];
  license: string | null;
  logo: string | null;
  repoUrl: string | null;
  docsUrl: string | null;
  owner: Owner | null;
}

export type NodeStatus = 'live' | 'planned';

export interface ServiceNode {
  code: string;
  name: string;
  status: NodeStatus;
}

export type ServiceStatus = 'Live' | 'Planned';

export interface Service {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  description: string | null;
  audience: string[];
  features: string[];
  standards: string[];
  relatedProductId: string | null;
  nodes: ServiceNode[];
  status: ServiceStatus | null;
  tags: string[];
  logo: string | null;
  deploymentUrl: string | null;
  docsUrl: string | null;
  repoUrl: string | null;
  trackingUrl: string | null;
  owners: Owner[];
}

export interface NodeContact {
  email: string | null;
  url: string | null;
}

export interface ElixirNode {
  code: string;
  name: string;
  country: string;
  status: NodeStatus;
  institute: string | null;
  website: string | null;
  logo: string | null;
  liaison: Owner | null;
  contact: NodeContact | null;
}
