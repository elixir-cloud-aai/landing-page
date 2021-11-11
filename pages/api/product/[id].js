const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const handler = async (req, res) => {
  try {
    var payload = {
      path: `blocks/${req.query.id}/children`,
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
      if (result.paragraph && result.paragraph.text[0]) {
        return {
          id: result.id,
          type: result.type,
          text: result.paragraph.text.map((block) => {
            return {
              content: block.plain_text,
              link: block.href,
              annotations: { ...block.annotations },
            };
          }),
          createdAt: result.created_time,
          updatedAt: result.last_edited_time,
        };
      }
    });
    var content = results;
    var payload = {
      path: `pages/${req.query.id}`,
      method: `GET`,
    };
    var results = await notion.request(payload);
    results = {
      id: results.id,
      title: results.properties.Name.title[0].text.content,
      icon: results.properties.Icon.files[0].name,
      description: results.properties.Description.rich_text[0]
        ? results.properties.Description.rich_text[0].text.content
        : "",
      content,
      url: results.url,
      createdAt: results.created_time,
      updatedAt: results.last_edited_time,
    };
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
};

export default handler;
