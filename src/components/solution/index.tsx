'use client';
import Content from '@/components/Content';
import dayjs from 'dayjs';
import Link from 'next/link';
import { FC } from 'react';
import { Zoom } from 'react-awesome-reveal';
import { SolutionComponentProps } from './types';

const Solution: FC<SolutionComponentProps> = ({ data }) => {
  return (
    <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700 tracking-wide">
      <Zoom>
        <div className="flex justify-around">
          <img
            alt="Icon"
            className="rounded-lg w-28 h-28 md:w-32 md:h-32"
            height="auto"
            src={data.icon}
            width="auto"
          />
        </div>
      </Zoom>
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
      <div className=" text-sm text-gray-400 my-5 text-right">
        Updated on {dayjs(data.updatedAt).format('DD MMM YYYY')}
      </div>
      <div className="flex justify-end my-5 items-center ">
        <Link href="/solutions" passHref>
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
  );
};

export default Solution;
