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
        query: "Contributors",
      },
    };
    var data = await notion.request(payload);
    const productsDBId = data.results[0].id;
    payload = {
      path: `databases/${productsDBId}/query`,
      method: `POST`,
    };
    var { results } = await notion.request(payload);
    results = results.map((result) => {
      return {
        id: result.id,
        name: result.properties.Name.title[0].text.content,
        email: result.properties.Email.rich_text[0]
          ? result.properties.Email.rich_text[0].text.content
          : "",
        website: result.properties.Website.rich_text[0]
          ? result.properties.Website.rich_text[0].text.content
          : "",
        linkedin: result.properties.Linkedin.rich_text[0]
          ? result.properties.Linkedin.rich_text[0].text.content
          : "",
        positions: result.properties.Position.multi_select.map((position) => {
          return position.name;
        }),
        createdAt: result.created_time,
      };
    });
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
};

export default handler;
