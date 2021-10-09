import Head from "next/head";
import HomeComponent from "../components/Home";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Elixir Cloud & AAI</title>
      </Head>
      <HomeComponent></HomeComponent>
    </div>
  );
};

export default Home;
