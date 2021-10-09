import React from "react";

const Products = ({ products }) => {
  return (
    <div className="mt-28 md:mx-48 mx-10 font-pop text-gray-700">
      <input
        className="md:text-base text-sm px-3 py-2 border-2 rounded-lg outline-none w-full focus:shadow-lg"
        placeholder="Search.."
      ></input>
    </div>
  );
};

export default Products;
