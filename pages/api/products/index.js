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
        query: "Products",
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
        title: result.properties.Name.title[0].text.content,
        icon: result.icon
          ? result.icon.file
            ? result.icon.file.url
            : result.icon.external.url
          : "",
        description: result.properties.Description.rich_text[0]
          ? result.properties.Description.rich_text[0].text.content
          : "",
        github: result.properties.Github.url,
        url: result.url,
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
