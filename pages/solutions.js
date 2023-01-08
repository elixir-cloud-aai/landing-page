import { NextSeo } from 'next-seo';
import SolutionsComponent from '../components/Solutions';
import getSolutions from '../utils/solutions';

function Solutions({ solutions }) {
  return (
    <>
      <NextSeo
        description="ELIXIR Cloud & AAI-developed solutions."
        title="Solutions"
      />
      <SolutionsComponent solutions={solutions} />
    </>
  );
}

export const getStaticProps = async () => {
  const data = await getSolutions();
  return {
    props: {
      solutions: data,
    },
    revalidate: 30,
  };
};

export default Solutions;
