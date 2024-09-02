import SolutionsComponent from '@/components/solutions/index';
import getSolutions from '@/api-calls/solutions';
import { FC } from 'react';
import { Solutions } from '@/components/solutions/types';
import { Metadata } from 'next';

export const revalidate = 60;

const fetchSolutions = async () => {
  return await getSolutions();
};

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'ELIXIR Cloud & AAI-developed solutions.',
};
const SolutionsPage: FC = async () => {
  const data: Solutions[] = await fetchSolutions();

  return <SolutionsComponent solutions={data} />;
};

export default SolutionsPage;
