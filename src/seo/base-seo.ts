import { Metadata } from 'next';

const baseSeo: Metadata = {
  metadataBase: new URL('https://elixir-cloud.dcc.sib.swiss'),
  title: 'ELIXIR Cloud & AAI',
  description:
    'ELIXIR Cloud & AAI develops services towards establishing a federated cloud computing network that enables the analysis of population-scale genomic and phenotypic data across participating, international nodes.',
  openGraph: {
    type: 'website',
    url: 'https://elixir-cloud.dcc.sib.swiss/',
    title: 'ELIXIR Cloud & AAI',
    description:
      'ELIXIR Cloud & AAI develops services towards establishing a federated cloud computing network that enables the analysis of population-scale genomic and phenotypic data across participating, international nodes.',
    images: [
      {
        url: 'https://elixir-cloud.dcc.sib.swiss/elixir-cloud-aai.png',
        width: 800,
        height: 600,
        alt: 'ELIXIR Cloud & AAI',
      },
    ],
  },
  twitter: {
    siteId: '@ELIXIRcloud_aai',
  },
  icons: [
    { rel: 'icon', url: '/elixir-cloud-aai.png' },
    { rel: 'apple-touch-icon', url: '/elixir-cloud-aai.png', sizes: '76x76' },
    { rel: 'mask-icon', url: '/elixir-cloud-aai.png' },
  ],
  manifest: '/manifest.json',
};

export default baseSeo;
