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
      if (result.paragraph.text[0]) {
        return {
          id: result.id,
          text: result.paragraph.text[0].text.content,
          createdAt: result.created_time,
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
      github: results.properties.Github.url,
      web: results.properties.Web.url,
      description: results.properties.Description.rich_text[0]
        ? results.properties.Description.rich_text[0].text.content
        : "",
      content,
      url: results.url,
      createdAt: results.created_time,
    };
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
};

export default handler;
