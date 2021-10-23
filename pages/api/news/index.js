import axios from "axios";

const handler = async (req, res) => {
  try {
    var query = "max_results=20&tweet.fields=created_at,lang&exclude=replies&";
    if (req.query.pagination_token) {
      query += `pagination_token=${req.query.pagination_token}&`;
    }
    const { data } = await axios.get(
      `https://api.twitter.com/2/users/1010077800441765888/tweets?${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_TOKEN}`,
        },
      }
    );
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
};

export default handler;
