const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getTitle = (result: any) => {
  const title = result?.properties?.Name?.title;
  if (!Array.isArray(title) || title.length === 0) {
    return '';
  }
  return title[0]?.plain_text || title[0]?.text?.content || '';
};

const getIcon = (result: any) => {
  const files = result?.properties?.Icon?.files;
  if (!Array.isArray(files) || files.length === 0) {
    return '';
  }

  const file = files[0];
  if (file?.type === 'external') {
    return file?.external?.url || '';
  }

  if (file?.type === 'file') {
    return file?.file?.url || '';
  }

  return file?.name || '';
};

const getDescription = (result: any) => {
  const richText = result?.properties?.Description?.rich_text;
  if (!Array.isArray(richText) || richText.length === 0) {
    return '';
  }

  return richText[0]?.plain_text || richText[0]?.text?.content || '';
};

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

    if (!data || !Array.isArray(data.results) || data.results.length === 0) {
      return [];
    }

    const solutionsDBId = data.results[0].id;
    const solutionsPayload = {
      path: `databases/${solutionsDBId}/query`,
      method: 'POST',
    };
    let { results } = await notion.request(solutionsPayload);
    if (!Array.isArray(results) || results.length === 0) {
      return [];
    }

    results = results.map((result: any) => ({
      id: result.id,
      title: getTitle(result),
      icon: getIcon(result),
      description: getDescription(result),
      createdAt: result.created_time,
      updatedAt: result.last_edited_time,
    }));
    return results;
  } catch (e) {
    console.log({ message: 'Server error', request: 'getSolutions', error: e });
    return [];
  }
};

export default getSolutions;
