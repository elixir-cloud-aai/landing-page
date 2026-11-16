import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The page is a client component, which can't export metadata, so the route's
// layout sets it
export const metadata: Metadata = {
  title: 'Contributors',
  description:
    'The developers, researchers and open-source contributors around the world who build, maintain and advance ELIXIR On-Cloud.',
};

export default function ContributorsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
