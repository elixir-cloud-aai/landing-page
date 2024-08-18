const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getSolution = async (id: string) => {
  try {
    let payload = {
      path: `blocks/${id}/children`,
      method: 'GET',
    };
    let { results } = await notion.request(payload);

    results = results.map((result: any) => {
      if (result.image && result.image.type === 'external') {
        return {
          id: result.id,
          type: result.type,
          image: result.image.external.url,
          createdAt: result.created_time,
          updatedAt: result.last_edited_time,
        };
      }
      if (result.paragraph && result.paragraph.rich_text[0]) {
        return {
          id: result.id,
          type: result.type,
          text: result.paragraph.rich_text.map((block: any) => ({
            content: block.plain_text,
            link: block.href,
            annotations: { ...block.annotations },
          })),
          createdAt: result.created_time,
          updatedAt: result.last_edited_time,
        };
      }
      return null;
    });
    const content = [...results];
    payload = {
      path: `pages/${id}`,
      method: 'GET',
    };
    results = await notion.request(payload);

    results = {
      id: results.id,
      title: results.properties.Name.title[0].text.content,
      icon: results.properties.Icon.files[0].name,
      description: results.properties.Description.rich_text[0]
        ? results.properties.Description.rich_text[0].text.content
        : '',
      content,
      url: results.url,
      createdAt: results.created_time,
      updatedAt: results.last_edited_time,
    };
    return results;
  } catch (e) {
    console.log({ message: 'Server error', request: 'getSolution', error: e });
    return { message: 'Server error', error: e };
  }
};

export default getSolution;
