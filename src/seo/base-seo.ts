import { Metadata } from 'next';

const baseSeo: Metadata = {
  metadataBase: new URL('https://elixir-on.cloud'),
  // Pages set their own title, e.g. "Nodes", shown as "Nodes | ELIXIR
  // On-Cloud"; pages without one show the site name alone
  title: {
    default: 'ELIXIR On-Cloud',
    template: '%s | ELIXIR On-Cloud',
  },
  description:
    'ELIXIR On-Cloud develops services towards establishing a federated cloud computing network that enables the analysis of population-scale genomic and phenotypic data across participating, international nodes.',
  // Without a title, description or URL of their own, link previews (Open
  // Graph, and Twitter from it) take each page's title and description
  openGraph: {
    type: 'website',
    images: [
      {
        url: 'https://elixir-on.cloud/elixir-cloud-aai.png',
        width: 800,
        height: 600,
        alt: 'ELIXIR On-Cloud',
      },
    ],
  },
  twitter: {
    siteId: '@ELIXIRcloud_aai',
  },
  icons: [
    {
      rel: 'icon',
      url: 'ELIXIR On-Cloud Logo Pack/On-Cloud_logomark_MONO.png',
    },
    {
      rel: 'apple-touch-icon',
      url: 'ELIXIR On-Cloud Logo Pack/On-Cloud_logomark_MONO.png',
      sizes: '76x76',
    },
    {
      rel: 'mask-icon',
      url: 'ELIXIR On-Cloud Logo Pack/On-Cloud_logomark_MONO.png',
    },
  ],
};

export default baseSeo;
