import HomeComponent from '@/components/home';
import type { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  // The home page leads with the site name, without the title template
  title: {
    absolute: 'ELIXIR On-Cloud: federated cloud for the life sciences',
  },
  description:
    'Federated, GA4GH standards-based cloud infrastructure for the life sciences, built by the ELIXIR community: services, software and Nodes.',
};

const HomePage: FC = () => {
  return <HomeComponent />;
};

export default HomePage;
