const devEnv = process.env.NODE_ENV !== "production";
const server = devEnv ? "http://localhost:3000" : "https://elixir-cloud-aai-github-io.vercel.app";

export { devEnv, server };
