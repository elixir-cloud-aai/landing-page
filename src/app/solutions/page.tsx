import SolutionsComponent from '@/components/solutions';
import getSolutions from '@/api-calls/solutions';
import { FC } from 'react';
import { Solutions } from '@/components/solutions/types';
import { Metadata } from 'next';

export const revalidate = 60;

export const fetchSolutions = async () => {
  let data = await getSolutions();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  return data;
};

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'ELIXIR Cloud & AAI-developed solutions.',
};
const SolutionsPage: FC<any> = async () => {
  const data: Solutions[] = await fetchSolutions();

  return <SolutionsComponent solutions={data} />;
};

export default SolutionsPage;
