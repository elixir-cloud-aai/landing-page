import ContributorsComponent from '@/components/contributors';
import getContributors from '@/api-calls/contributors';
import { FC } from 'react';
import { Metadata } from 'next';
import { Contributor } from '@/components/contributors/types';

export const revalidate = 60;

const fetchContributors = async (): Promise<any> => {
  return await getContributors();
};

export const metadata: Metadata = {
  title: 'Contributors',
  description: 'Elixir Cloud & AAI contributor developing the solutions.',
};

const Contributors: FC = async () => {
  const contributors: Contributor[] = await fetchContributors();
  return <ContributorsComponent contributors={contributors} />;
};
export default Contributors;
