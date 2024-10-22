import SolutionComponent from '@/components/solution';
import { Solution } from '@/components/solution/types';
import getSolution from '@/api-calls/solution';
import { Metadata, ResolvingMetadata } from 'next';
import { FC } from 'react';

type Props = {
  params: { id: string };
};

const fetchSolutionData = async (id: string) => {
  return await getSolution(id);
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = params;
  const data: Solution = await fetchSolutionData(id);
  return {
    title: data.title,
    description: data.description,
  };
}

const SolutionPage: FC<{ params: { id: string } }> = async ({ params }) => {
  const id = params.id;
  const data: Solution = await fetchSolutionData(id);
  return <SolutionComponent data={data} />;
};

export default SolutionPage;
