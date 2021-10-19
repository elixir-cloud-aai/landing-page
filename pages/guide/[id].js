import Head from "next/head";
import { server } from "../../config";
import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import { renderText } from "../../utils";

const Product = ({ data }) => {
  return (
    <>
      <Head>
        <title>Guide</title>
      </Head>
      <div className="mt-28 md:mx-64 mx-10 font-pop text-gray-700 tracking-wide">
        <div className="text-3xl font-bold mb-1.5 mt-5 text-center">{data.title}</div>
        <div className="text-lg text-gray-400 mb-7 font-semibold text-center">
          {data.description}
        </div>
        <div className="">{renderText(data.content)}</div>
        <div className="my-5 text-sm text-gray-400 text-right">
          <div className="my-1">
            Guide by <span className="hover:underline cursor-pointer">{data.author.name}</span>
          </div>
          <div className="my-1">Updated on {dayjs(data.updatedAt).format("DD MMM YYYY")}</div>
        </div>
        <div className="flex justify-end my-5 items-center">
          <Link href="/guides" passHref>
            <div className="flex p-3 hover:shadow-md hover:bg-gray-200 border-2 w-36 rounded-lg cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              Go Back
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths = async () => {
  const { data } = await axios.get(`${server}/api/guides`);
  const paths = data.map(({ id }) => ({ params: { id: `${id}` } }));
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const { data } = await axios.get(`${server}/api/guide/${params.id}`);
  return {
    props: {
      data,
    },
    revalidate: 30,
  };
};

export default Product;
