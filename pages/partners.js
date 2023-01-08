import { NextSeo } from 'next-seo';
import PartnersComponent from '../components/Partners';
import getPartners from '../utils/partners';

function Partners({ partners }) {
  return (
    <>
      <NextSeo
        description="ELIXIR Cloud & AAI collobrative partners."
        title="Partners"
      />
      <PartnersComponent partners={partners} />
    </>
  );
}

export const getStaticProps = async () => {
  const data = await getPartners();

  return {
    props: {
      partners: data,
    },
    revalidate: 30,
  };
};

export default Partners;
