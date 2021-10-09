import Head from "next/head";
import { server } from "../config";
import axios from "axios";
import ProductsComponent from "../components/Products";

const Products = ({ products }) => {
  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <ProductsComponent products={products}></ProductsComponent>
    </>
  );
};

export const getStaticProps = async () => {
  try {
    const { data } = await axios.get(`${server}/api/products`);
    console.log("data", data);

    return {
      props: {
        products: data,
      },
    };
  } catch (e) {
    console.log("error", e);
  }
};

export default Products;
