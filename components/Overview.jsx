import Content from './Content';

function Overview({ data }) {
  return (
    <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700">
      <Content content={data} />
    </div>
  );
}

export default Overview;
