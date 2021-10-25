const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const handler = async (req, res) => {
  try {
    var payload = {
      path: `search`,
      method: `POST`,
      body: {
        query: "Overview",
      },
    };
    var data = await notion.request(payload);
    const productsDBId = data.results[0].id;
    console.log(productsDBId);
    payload = {
      path: `blocks/${productsDBId}/children`,
      method: `GET`,
    };
    var { results } = await notion.request(payload);
    results = results.map((result) => {
      if (result.image && result.image.type == "external") {
        return {
          id: result.id,
          type: result.type,
          image: result.image.external.url,
          createdAt: result.created_time,
          updatedAt: result.last_edited_time,
        };
      }
      if (result.type == "divider") {
        return {
          id: result.id,
          type: result.type,
          createdAt: result.created_time,
          updatedAt: result.last_edited_time,
        };
      }
      return {
        id: result.id,
        type: result.type,
        text: result[result.type].text.map((block) => {
          return {
            content: block.plain_text,
            link: block.href,
            annotations: { ...block.annotations },
          };
        }),
        createdAt: result.created_time,
        updatedAt: result.last_edited_time,
      };
    });
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
};

export default handler;
