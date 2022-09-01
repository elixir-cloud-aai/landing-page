import getContributors from "./contributors";

const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getGuides = async () => {
  try {
    var contributors = await getContributors();
    var payload = {
      path: `search`,
      method: `POST`,
      body: {
        query: "Guides",
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
      var author = null;
      if (result.properties.Author.relation.length !== 0) {
        author = contributors.find(
          (contributor) => contributor.id === result.properties.Author.relation[0].id
        );
      }
      return {
        id: result.id,
        title: result.properties.Name.title[0].text.content,
        description: result.properties.Description.rich_text[0]
          ? result.properties.Description.rich_text[0].text.content
          : "",
        author,
        createdAt: result.created_time,
        updatedAt: result.last_edited_time,
      };
    });
    return results;
  } catch (e) {
    console.log({ message: "Server error", request: "getGuides", error: e });
    return { message: "Server error", error: e };
  }
};

export default getGuides;
