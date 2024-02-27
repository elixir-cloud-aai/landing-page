const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getSolutions = async () => {
  try {
    let payload = {
      path: 'search',
      method: 'POST',
      body: {
        query: 'Solutions',
      },
    };
    const data = await notion.request(payload);

    if (!data || !data.results || data.results.length === 0) {
      console.error('No data found for solutions');
      return { solutions: [], error: null };
    }

    const solutionsDBId = data.results[0].id;
    payload = {
      path: `databases/${solutionsDBId}/query`,
      method: 'POST',
    };
    let { results } = await notion.request(payload);

    if (!results || results.length === 0) {
      console.error('No results found for solutions');
      return { solutions: [], error: null };
    }

    results = results.map((result) => ({
      id: result.id,
      title: result.properties.Name.title[0].text.content,
      icon: result.properties.Icon.files[0].name,
      description: result.properties.Description.rich_text[0]
        ? result.properties.Description.rich_text[0].text.content
        : '',
      createdAt: result.created_time,
      updatedAt: result.last_edited_time,
    }));
    return results;
  } catch (e) {
    console.log({ message: 'Server error', request: 'getSolutions', error: e });
    return { message: 'Server error', error: e };
  }
};

export default getSolutions;
