import { NextSeo } from 'next-seo';
import Funders from '../components/Funders';
import getFunders from '../utils/funder';

function Funding({ funders }) {
  return (
    <>
      <NextSeo
        description="ELIXIR Cloud & AAI collobrative funders."
        title="Funding"
      />
      <Funders funders={funders} />
    </>
  );
}

export const getStaticProps = async () => {
  const data = await getFunders();

  return {
    props: {
      funders: data,
    },
    revalidate: 30,
  };
};

export default Funding;
