const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getContributors = async () => {
  try {
    var payload = {
      path: `search`,
      method: `POST`,
      body: {
        query: "Contributors",
      },
    };
    var data = await notion.request(payload);
    const solutionsDBId = data.results[0].id;
    payload = {
      path: `databases/${solutionsDBId}/query`,
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
        github: result.properties.Github.rich_text[0]
          ? result.properties.Github.rich_text[0].text.content
          : "",
        orcid: result.properties.Orcid.rich_text[0]
          ? result.properties.Orcid.rich_text[0].text.content
          : "",
        scholar: result.properties.Scholar.rich_text[0]
          ? result.properties.Scholar.rich_text[0].text.content
          : "",
        researchgate: result.properties.Researchgate.rich_text[0]
          ? result.properties.Researchgate.rich_text[0].text.content
          : "",
        positions: result.properties.Position.multi_select.map((position) => {
          return position.name;
        }),
        image: result.properties.Image.url,
        createdAt: result.created_time,
        updatedAt: result.last_edited_time,
      };
    });
    results.sort((a, b) => a.name.localeCompare(b.name));
    return results;
  } catch (e) {
    console.log({ message: "Server error", request: "getContributors", error: e });
    return { message: "Server error", error: e };
  }
};

export default getContributors;
