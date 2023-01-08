const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getPartners = async () => {
  try {
    let payload = {
      path: 'search',
      method: 'POST',
      body: {
        query: 'Partners',
      },
    };
    const data = await notion.request(payload);
    const partnersDBId = data.results[0].id;
    payload = {
      path: `databases/${partnersDBId}/query`,
      method: 'POST',
    };
    let { results } = await notion.request(payload);
    results = results.map((result) => ({
      id: result.id,
      name: result.properties.Name.title[0].text.content,
      description: result.properties.Description.rich_text[0]
        ? result.properties.Description.rich_text[0].text.content
        : '',
      website: result.properties.Website.rich_text[0]
        ? result.properties.Website.rich_text[0].text.content
        : '',
      icon: result.properties.Icon.url,
      iconDark: result.properties.IconDark.url,
      createdAt: result.created_time,
      updatedAt: result.last_edited_time,
    }));
    return results;
  } catch (e) {
    console.log({ message: 'Server error', request: 'getPartners', error: e });
    return { message: 'Server error', error: e };
  }
};

export default getPartners;
