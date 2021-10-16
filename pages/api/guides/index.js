import axios from "axios";
import { server } from "../../../config";

const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const handler = async (req, res) => {
  try {
    var contributors = await axios.get(`${server}/api/contributors`);
    contributors = contributors.data;
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
      var author = contributors.find(
        (contributor) => contributor.id === result.properties.Author.relation[0].id
      );
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
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
};

export default handler;
