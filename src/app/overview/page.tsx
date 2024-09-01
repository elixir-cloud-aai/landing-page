import OverviewComponent from '../../components/overview';
import { Overview } from '../../components/overview/types';
import getOverview from '../../api-calls/overview';
import { Metadata } from 'next';
import { FC } from 'react';

export const revalidate = 60;

const fetchOverview = async () => {
  return await getOverview();
};

export const metadata: Metadata = {
  title: 'Overview',
};

const OverviewPage: FC = async () => {
  const overviews: Overview[] = await fetchOverview();
  return <OverviewComponent overviews={overviews} />;
};

export default OverviewPage;
