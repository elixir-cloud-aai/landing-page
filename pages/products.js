import Head from "next/head";
import { server } from "../config";
import axios from "axios";
import ProductsComponent from "../components/Products";

const Products = ({ products }) => {
  console.log(products);
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
  const { data } = await axios.get(`${server}/api/products`);

  return {
    props: {
      products: data,
    },
    revalidate: 10,
  };
};

export default Products;
