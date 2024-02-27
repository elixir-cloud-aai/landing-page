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
  try {
    const data = await getSolutions();
    if (data.error) {
      console.error('Error fetching contributors:', data.error);
      return {
        props: {
          solutions: [],
          error: 'Error fetching solutions',
        },
        revalidate: 30,
      };
    }
    return {
      props: {
        solutions: data,
        error: null,
      },
      revalidate: 30,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        solutions: [],
        error: 'Server error',
      },
      revalidate: 30,
    };
  }
};

export default Solutions;
