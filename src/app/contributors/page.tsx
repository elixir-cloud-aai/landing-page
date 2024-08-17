import ContributorsComponent from '@/components/contributors';
import getContributors from '@/utils/contributors';
import { FC } from 'react';
import { Metadata } from 'next';

export const revalidate = 60;

export const fetchContributors = async () => {
  const data = await getContributors();
  return data;
};

export const metadata: Metadata = {
  title: 'Contributors',
  description: 'Elixir Cloud & AAI contributor devloping the solutions.',
};

const Contributors: FC<any> = async () => {
  const contributors = await fetchContributors();
  return <ContributorsComponent contributors={contributors} />;
};
export default Contributors;
