import { useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import Zoom from 'react-reveal/Zoom';
import { Popover } from 'react-tiny-popover';
import { NextSeo } from 'next-seo';
import Content from '../../components/Content';
import getGuide from '../../utils/guide';
import getGuides from '../../utils/guides';

function Solution({ data }) {
  const [show, setShow] = useState(false);

  const renderPopoverContent = () => (
    <div className="border p-3 rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:border-gray-900">
      <div className="flex">
        <img
          className="w-20 rounded-full"
          height="auto"
          src={data.author.image}
          width="auto"
        />
        <div className="ml-3 mt-1">
          <div className="teext-sm dark:text-gray-100">{data.author.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {data.author.positions.map((position, index) => (
              <div key={index}>{position}</div>
            ))}
          </div>
        </div>
      </div>
      <hr className="my-3" />
      <div className="text-gray-500 dark:text-gray-400">
        {data.author.email && (
          <div className="flex text-sm">
            <div>Email</div>
            <div className="ml-3 text-elixirblue hover:underline">
              <a href={`mailto:${data.author.email}`}>{data.author.email}</a>
            </div>
          </div>
        )}
        {data.author.website && (
          <div className="flex text-sm">
            <div>Website</div>
            <div className="ml-3 text-elixirblue hover:underline">
              <a href={data.author.website}>{data.author.website}</a>
            </div>
          </div>
        )}
        {data.author.linkedin && (
          <div className="flex text-sm">
            <div>LinkedIn</div>
            <div className="ml-3 text-elixirblue hover:underline">
              <a href={data.author.linkedin}>{data.author.linkedin}</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <NextSeo description={data.description} title={data.title} />
      <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700 tracking-wide">
        <Zoom>
          <div className="text-3xl font-bold mb-1.5 mt-5 text-center dark:text-gray-200">
            {data.title}
          </div>
        </Zoom>
        <Zoom>
          <div className="text-lg text-gray-400 mb-7 font-semibold text-center">
            {data.description}
          </div>
        </Zoom>
        <Content content={data.content} />
        {data.author ? (
          <div className="my-5 text-sm text-gray-400 text-right">
            <div className="my-1">
              Guide by{' '}
              <Popover
                content={renderPopoverContent()}
                isOpen={show}
                onClickOutside={() => setShow(false)}
                positions={['top', 'bottom', 'left', 'right']}
              >
                <span
                  className="hover:underline cursor-pointer font-bold"
                  onClick={() => setShow(!show)}
                >
                  {data.author.name}
                </span>
              </Popover>
            </div>
            <div className="my-1">
              Updated on
              {dayjs(data.updatedAt).format('DD MMM YYYY')}
            </div>
          </div>
        ) : (
          <div className="my-5 text-sm text-gray-400 text-right">
            Contact us at{' '}
            <a
              className="text-elixirblue"
              href="mailto:cloud-service@elixir-europe.org"
            >
              cloud-service@elixir-europe.org
            </a>
          </div>
        )}
        <div className="flex justify-end my-5 items-center">
          <Link href="/guides" passHref>
            <div className="flex p-3 hover:shadow-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 border-2 w-36 rounded-lg cursor-pointer">
              <svg
                className="h-6 w-6 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Go Back
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const data = await getGuides();
  const paths = data.map(({ id }) => ({ params: { id: `${id}` } }));
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  let data = await getGuide(params.id);
  data = await JSON.stringify(data);
  data = await JSON.parse(data);
  return {
    props: {
      data,
    },
    revalidate: 30,
  };
};

export default Solution;
