import OverviewComponent from '../../components/overview/index';
import { Overview } from '../../components/overview/types';
import getOverview from '../../api-calls/overview';
import { Metadata } from 'next';
import { FC } from 'react';

export const revalidate = 60;

const fetchOverview = async () => {
  let data = await getOverview();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  return data;
};

export const metadata: Metadata = {
  title: 'Overview',
};

const OverviewPage: FC<any> = async () => {
  const overviews: Overview[] = await fetchOverview();
  return <OverviewComponent overviews={overviews} />;
};

export default OverviewPage;
