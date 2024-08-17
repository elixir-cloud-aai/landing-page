import { FC } from 'react';
import Content from './content';
import { OverviewComponentProps } from './types';

const Overview: FC<OverviewComponentProps> = ({ overviews }) => {
  return (
    <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700">
      <Content content={overviews} />
    </div>
  );
};

export default Overview;
