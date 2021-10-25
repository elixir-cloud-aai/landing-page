import React from "react";
import Content from "./Content";

const Overview = ({ data }) => {
  return (
    <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700">
      <Content content={data}></Content>
    </div>
  );
};

export default Overview;
