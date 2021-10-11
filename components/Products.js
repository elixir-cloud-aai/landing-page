import Link from "next/link";

const Products = ({ products }) => {
  const renderProducts = () => {
    return products.map((product) => {
      return (
        <>
          <Link href={`product/${product.id}`} passHref>
            <div
              key={product.id}
              className="w-full rounded-lg p-5 border-2 hover:shadow-lg my-5 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex">
                <img
                  src={product.icon}
                  style={{ height: "100px", width: "100px" }}
                  className="rounded-md"
                  alt="Icon"
                ></img>
                <div className="ml-8 flex-grow">
                  <div className="text-xl font-semibold flex justify-between">
                    <div>{product.title}</div>
                    {/* {product.github != "" ? (
                      <a href={product.github}>
                        <img
                          src="/GitHub.png"
                          className="items-center"
                          style={{ height: "25px", width: "25px" }}
                          alt="GitHub"
                        ></img>
                      </a>
                    ) : (
                      <></>
                    )} */}
                  </div>
                  <div className="text-gray-500 text-justify mt-1.5">{product.description}</div>
                </div>
              </div>
            </div>
          </Link>
        </>
      );
    });
  };

  return (
    <div className="mt-28 md:mx-64 mx-10 font-pop text-gray-700">
      <input
        className="md:text-base text-sm px-3 py-2 border-2 rounded-lg outline-none w-full focus:shadow-lg hover:shadow-lg mb-5 placeholder-opacity-50"
        placeholder="Search.."
      ></input>
      {renderProducts()}
    </div>
  );
};

export default Products;
