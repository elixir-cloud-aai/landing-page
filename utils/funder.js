const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getFunders = async () => {
  try {
    let payload = {
      path: 'search',
      method: 'POST',
      body: {
        query: 'Funders',
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
      instrument: result.properties.Instrument.title[0].plain_text,
      website: result.properties.Website.url
        ? result.properties.Website.url
        : '',
      icon: result.properties.Icon.url,
      iconDark: result.properties.IconDark.url,
      projectTitle: result.properties.ProjectTitle.rich_text[0].text.content,
      recipients: result.properties.Recipients.multi_select,
      timeline: result.properties.Duration.date,
    }));
    results = results.sort((a, b) => {
      const endDateA = new Date(a.timeline.end);
      const endDateB = new Date(b.timeline.end);
      if (endDateA - endDateB === 0) {
        const startDateA = new Date(a.timeline.start);
        const startDateB = new Date(b.timeline.start);
        if (startDateA - startDateB === 0) {
          const instrumentA = a.instrument;
          const instrumentB = b.instrument;
          if (instrumentA === instrumentB) {
            const projectTitleA = a.projectTitle;
            const projectTitleB = b.projectTitle;
            return projectTitleA - projectTitleB;
          }
          return instrumentA - instrumentB;
        }
        return startDateA - startDateB;
      }
      return endDateB - endDateA;
    });
    return results;
  } catch (e) {
    console.log({ message: 'Server error', request: 'getFunders', error: e });
    return { message: 'Server error', error: e };
  }
};

export default getFunders;
