import NewsComponent from '@/components/news/index';
import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: `News & FAQ's`,
  description: 'ELIXIR Cloud & AAI latest news/twitter feed.',
};

const NewsPage: FC<any> = () => {
  return <NewsComponent />;
};

export default NewsPage;
