import PartnersComponent from '@/components/partners';
import { Partner } from '@/components/partners/types';
import getPartners from '@/api-calls/partners';
import { Metadata } from 'next';
import { FC } from 'react';

export const revalidate = 60;

export const fetchPartners = async () => {
  let data = await getPartners();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  return data;
};

export const metadata: Metadata = {
  title: 'Overview',
};

const PartnersPage: FC<any> = async () => {
  const partners: Partner[] = await fetchPartners();
  return <PartnersComponent partners={partners} />;
};

export default PartnersPage;
