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

#### Local Environment

Any contributor is welcome to contribute to the website.

To set up the development environment, follow the steps:

- Fork & clone this repository on your local machine.
- Install the required dependencies:

```bash
npm install
```

- Start the local development server by:

```bash
npm run dev
```

#### Production Enviroment

- Check the file `config.js` to see the backend API url. Change it according to the where the repo [Elixir Cloud & AAI Backend](https://github.com/elixir-cloud-aai/elixir-cloud-aai.github.io-backend) is deployed.

- Deploy by Docker.

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
