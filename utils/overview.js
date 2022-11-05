const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getOverview = async () => {
  try {
    var payload = {
      path: `search`,
      method: `POST`,
      body: {
        query: "Overview",
      },
    };
    var data = await notion.request(payload);
    const solutionsDBId = data.results[0].id;
    payload = {
      path: `blocks/${solutionsDBId}/children`,
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
    return results;
  } catch (e) {
    console.log({ message: "Server error", request: "getOverview", error: e });
    return { message: "Server error", error: e };
  }
};

export default getOverview;
