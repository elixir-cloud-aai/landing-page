import ProductsComponent from "../components/Products";
import { NextSeo } from "next-seo";
import getProducts from "../utils/products";

const Products = ({ products }) => {
  return (
    <>
      <NextSeo title="Products" description="ELIXIR Cloud & AAI devloped products/solution." />
      <ProductsComponent products={products}></ProductsComponent>
    </>
  );
};

export const getStaticProps = async () => {
  const data = await getProducts();

  return {
    props: {
      products: data,
    },
    revalidate: 30,
  };
};

export default Products;
