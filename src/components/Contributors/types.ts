export interface ContributorsComponentProps {
  contributors: Contributor[];
}

export interface Contributor {
  id: string;
  name: string;
  email: string;
  website?: string;
  linkedin?: string;
  github: 'https://github.com/vipulchhabra99';
  x?: string;
  mastodon?: string;
  orcid?: string;
  scholar?: string;
  researchgate?: string;
  affiliation: string;
  positions?: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Option {
  label: string;
  value: any;
}
export interface FormValues {
  pastContributorCheckBox: boolean;
  projectLeadCheckbox: boolean;
  rolesInput: string[];
  affiliationsInput: string[];
}
