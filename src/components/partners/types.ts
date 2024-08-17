export interface PartnerComponentProps {
  partners: Partner[];
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  website: string;
  icon: string;
  iconDark: string;
  createdAt: string;
  updatedAt: string;
}
