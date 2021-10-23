import Zoom from "react-reveal/Zoom";

const Content = ({ content }) => {
  return content.map((block) => {
    if (block) {
      if (block.type == "paragraph") {
        return (
          <Zoom>
            <div
              className="leading-relaxed my-3 tracking-wide text-justify dark:text-gray-200"
              key={block.id}
            >
              {block.text.map((segment) => {
                return (
                  <span
                    className={`${segment.annotations.bold ? "font-semibold" : ""} 
                            ${segment.annotations.italic ? "italic" : ""}
                            ${segment.annotations.underline ? "underline" : ""}
                            ${
                              segment.annotations.code ? "font-mono bg-gray-200 p-1 rounded-md" : ""
                            }`}
                    key={segment.content}
                  >
                    {segment.link ? (
                      <a
                        key={segment.content}
                        href={segment.link}
                        className={`text-elixirblue hover:underline `}
                      >
                        {segment.content}
                      </a>
                    ) : (
                      <span key={segment.content}>{segment.content}</span>
                    )}
                  </span>
                );
              })}
            </div>
          </Zoom>
        );
      } else {
        return (
          <Zoom>
            <img src={block.image} alt="Image" className="my-10"></img>
          </Zoom>
        );
      }
    }
  });
};

export default Content;
