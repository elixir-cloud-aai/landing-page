import Link from 'next/link';
import Zoom from 'react-reveal/Zoom';

function Guides({ guides }) {
  const renderGuides = () =>
    guides.map((guide) => (
      <Zoom key={guide.id}>
        <Link href={`guide/${guide.id}`} passHref>
          <div className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100 cursor-pointer dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900">
            <div className="flex md:flex-row flex-col">
              <div className="flex-grow p-5">
                <div className="text-xl font-semibold flex justify-between dark:text-gray-200">
                  <div>{guide.title}</div>
                </div>
                <div className="text-gray-500 text-justify mt-1.5 dark:text-gray-400">
                  {guide.description}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Zoom>
    ));

  return (
    <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700">
      <Zoom>{renderGuides()}</Zoom>
    </div>
  );
}

export default Guides;
