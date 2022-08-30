# Elixir Cloud & AII

## Introduction

Official webpage for the ELIXIR Cloud & AAI project.

ELIXIR Cloud & AAI develops services towards establishing a federated [cloud
computing](https://en.wikipedia.org/wiki/Cloud_computing) network that enables
the analysis of population-scale genomic and phenotypic data across
participating, international nodes.

## About

This website is built using the [Next.js](https://nextjs.org/) framework for
[React.js](https://reactjs.org/). Most of the pages on the website are built
statically during build time for fast client-side rendering and better SEO.

Content for the website is fetched from
[Notion](https://developers.notion.com/), where it can be conveniently edited
by authorized users. If you are a member of ELIXIR Cloud & AAI and would like
to contribute, please contact the [administrator](https://github.com/uniqueg).

## Setup

Any contributor is welcome to contribute to the website.

To set up the development environment, follow the steps:

- Fork & clone this repository on your local machine.
- Install the required dependencies:

```bash
npm install
```

- For API/backed part create the [Notion](https://www.notion.so/) account.
- Open the [Elixir Cloud & AAI](https://www.notion.so/Elixir-Cloud-AAI-cdb71fe2334c4e83b920219b2c3b9794) notion page & duplicate it to your account.
- Create the [Notion developers](https://developers.notion.com/) account with the same email. [Create a new integration](https://developers.notion.com/docs#step-1-create-an-integration) in your account & store the Internal Integration Token. [Link the integration](https://developers.notion.com/docs#step-2-share-a-database-with-your-integration) to the duplicated page in your account.
- Create a new file in the root directory with the name `.env.local` & add your Internal Integration Token as Notion Token:

```bash
NOTION_TOKEN=<YOUR-NOTION-TOKEN>
```

- Start the local development server by:

```bash
npm run dev
```

## Deployment

To deploy the app, first set the Notion token:

```bash
NOTION_TOKEN=<YOUR-NOTION-TOKEN>
```

Then build the app image with the following command:

```bash
docker build . --build-arg NOTION_SECRET=${NOTION_TOKEN} -t elixircloud/landing-page:current
```

> **IMPORTANT NOTE:** Do **not** publish the built container image. It will be
> easy to access your Notion token.

Then start the service with:

```bash
docker run exlicircloud/landing-page:current
```

### Via `docker-compose`

The above instructions are fine for quickly checking out how to deploy the app.
However, for more stable deployments we strongly recommend that you use
`docker-compose` to deploy the app.

Place the in file `docker-compose.yaml` inside the project root:

```bash
  landing-page:
    image: elixircloud/landing-page:current
    container_name: landing-page
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NOTION_SECRET: $NOTION_TOKEN
    restart: unless-stopped
    expose:
      - 3000
```

> Note that this is only a starting point. You may want to adapt it to your
> particular needs.

Then deploy the service with:

```bash
docker-compose up --build -d
```

> To take down the deployment, simply do `docker-compose down`

## Versioning

The project adopts the semantic versioning scheme for versioning. Currently the
site is in beta stage, so content will change frequently.

## License

This project is available under the MIT License also [shipped with this
repository](LICENSE).

## Contact

The project is a collaborative effort under the umbrella of [ELIXIR Cloud &
AAI](https://github.com/elixir-cloud-aai/). Follow the link to get in touch
with us via chat or email. Please mention the name of this service for any
inquiry, proposal, question etc. Alternatively, you can also make use of the
[issue
tracker](https://github.com/elixir-cloud-aai/elixir-cloud-aai.github.io/issues)
to request features or report bugs.
