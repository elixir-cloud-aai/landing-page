import Zoom from 'react-reveal/Zoom';

const Content = ({ content }) => {
  const renderBlock = (block) =>
    block.text.map((segment) => (
      <span
        className={`${segment.annotations.bold ? 'font-semibold' : ''} 
                  ${segment.annotations.italic ? 'italic' : ''}
                  ${segment.annotations.underline ? 'underline' : ''}
                  ${
                    segment.annotations.code
                      ? 'font-mono bg-gray-200 p-1 rounded-md tracking-wider dark:text-gray-800'
                      : ''
                  }`}
        key={segment.content}
      >
        {segment.link ? (
          <a
            className="text-elixirblue hover:underline "
            href={segment.link}
            key={segment.content}
          >
            {segment.content}
          </a>
        ) : (
          <span key={segment.content}>{segment.content}</span>
        )}
      </span>
    ));

  return content.map((block) => {
    if (block) {
      if (
        block.type === 'paragraph' ||
        block.type === 'heading_1' ||
        block.type === 'heading_2' ||
        block.type === 'heading_3' ||
        block.type === 'callout' ||
        block.type === 'quote' ||
        block.type === 'code'
      ) {
        let textStyle = '';
        if (block.type === 'heading_1') {
          textStyle = 'text-3xl font-bold';
        } else if (block.type === 'heading_2') {
          textStyle = 'text-2xl font-bold';
        } else if (block.type === 'heading_3') {
          textStyle = 'text-xl font-semibold';
        } else if (block.type === 'callout') {
          textStyle =
            'p-2 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 hover:shadow-md shadow-lg border rounded-md text-center';
        } else if (block.type === 'quote') {
          textStyle = 'font-cursive text-2xl';
        } else {
          textStyle = 'text-justify';
        }
        return (
          <Zoom key={block.id}>
            <div
              className={`leading-relaxed my-3 tracking-wide dark:text-gray-200 ${textStyle}`}
            >
              {renderBlock(block)}
            </div>
          </Zoom>
        );
      }
      if (block.type === 'bulleted_list_item') {
        return (
          <Zoom key={block.id}>
            <ul className="leading-relaxed my-3 tracking-wide dark:text-gray-200 list-disc">
              <li>{renderBlock(block)}</li>
            </ul>
          </Zoom>
        );
      }
      if (block.type === 'divider') {
        return (
          <Zoom key={block.id}>
            <hr className="my-3 border-t border-gray-300 dark:border-gray-600" />
          </Zoom>
        );
      }
      return (
        <Zoom key={block.id}>
          <img
            alt="Image"
            className="my-10"
            height="auto"
            src={block.image}
            width="auto"
          />
        </Zoom>
      );
    }
    return null;
  });
};

export default Content;
