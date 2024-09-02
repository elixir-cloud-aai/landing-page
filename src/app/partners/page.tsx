import PartnersComponent from '@/components/partners';
import { Partner } from '@/components/partners/types';
import getPartners from '@/api-calls/partners';
import { Metadata } from 'next';
import { FC } from 'react';

export const revalidate = 60;

const fetchPartners = async () => {
  return await getPartners();
};

export const metadata: Metadata = {
  title: 'Overview',
};

const PartnersPage: FC = async () => {
  const partners: Partner[] = await fetchPartners();
  return <PartnersComponent partners={partners} />;
};

export default PartnersPage;
