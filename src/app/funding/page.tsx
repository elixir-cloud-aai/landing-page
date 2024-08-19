import Funders from '@/components/funders';
import getFunders from '@/api-calls/funder';
import { Metadata } from 'next';
import { FC } from 'react';
import { Funder } from '@/components/funders/types';

export const revalidate = 60;

const fetchFunders = async () => {
  let data = await getFunders();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  return data;
};

export const metadata: Metadata = {
  title: 'Funding',
  description: 'ELIXIR Cloud & AAI collaborative funders.',
};

const FundingPage: FC<any> = async () => {
  const funders: Funder[] = await fetchFunders();
  return <Funders funders={funders} />;
};

export default FundingPage;
