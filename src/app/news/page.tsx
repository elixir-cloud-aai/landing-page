import NewsComponent from '@/components/news';
import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: `News & FAQ's`,
  description: 'ELIXIR Cloud & AAI latest news/twitter feed.',
};

const NewsPage: FC = () => {
  return <NewsComponent />;
};

export default NewsPage;
