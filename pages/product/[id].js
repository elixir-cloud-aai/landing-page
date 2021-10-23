import Head from "next/head";
import { server } from "../../config";
import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import Content from "../../components/Content";
import Zoom from "react-reveal/Zoom";

const Product = ({ data }) => {
  return (
    <>
      <Head>
        <title>Product</title>
      </Head>
      <div className="mt-28 md:mx-64 mx-10 font-pop text-gray-700 tracking-wide">
        <Zoom>
          <div className="flex justify-around">
            <img src={data.icon} className="rounded-lg w-28 h-28 md:w-32 md:h-32" alt="Icon"></img>
          </div>
        </Zoom>
        <Zoom>
          <div className="text-3xl font-bold mb-1.5 mt-5 text-center">{data.title}</div>
        </Zoom>
        <Zoom>
          <div className="text-lg text-gray-400 mb-7 font-semibold text-center">
            {data.description}
          </div>
        </Zoom>
        <Content content={data.content}></Content>
        <Zoom>
          <div className="leading-relaxed my-3 tracking-wide">
            <div className="font-bold text-lg">Useful Links</div>
            <ul className="list-inside list-disc">
              {data.github ? (
                <li className="my-2">
                  <a href={data.github} className="text-elixirblue hover:underline">
                    GitHub
                  </a>
                </li>
              ) : (
                <></>
              )}
              {data.web ? (
                <li className="my-2">
                  <a href={data.web} className="text-elixirblue hover:underline">
                    Web
                  </a>
                </li>
              ) : (
                <></>
              )}
            </ul>
          </div>
        </Zoom>
        <div className=" text-sm text-gray-400 my-5 text-right">
          Updated on {dayjs(data.updatedAt).format("DD MMM YYYY")}
        </div>
        <div className="flex justify-end my-5 items-center">
          <Link href="/products" passHref>
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
  const { data } = await axios.get(`${server}/api/products`);
  const paths = data.map(({ id }) => ({ params: { id: `${id}` } }));
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const { data } = await axios.get(`${server}/api/product/${params.id}`);
  return {
    props: {
      data,
    },
    revalidate: 30,
  };
};

export default Product;
