import { server } from "../config";
import axios from "axios";
import ProductsComponent from "../components/Products";
import { NextSeo } from "next-seo";

const Products = ({ products }) => {
  return (
    <>
      <NextSeo title="Products" description="ELIXIR Cloud & AAI devloped products/solution." />
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
    revalidate: 30,
  };
};

export default Products;
