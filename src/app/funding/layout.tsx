import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The page is a client component, which can't export metadata, so the route's
// layout sets it
export const metadata: Metadata = {
  title: 'Funding',
  description:
    'The funders and programmes that support ELIXIR On-Cloud, such as ELIXIR and Google Summer of Code.',
};

export default function FundingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
