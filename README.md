# ELIXR Cloud & AAI landing page

[![license][badge-license]][badge-url-license]
[![website][badge-health]][badge-url-health]
[![chat][badge-chat]][badge-url-chat]
[![ci][badge-ci]][badge-url-ci]
[![cd][badge-cd]][badge-url-cd]

This is the repository for the [official website][badge-url-health] of **ELIXIR
Cloud & AAI**, a transnational effort towards establishing a federated [cloud
computing][res-cloud-computing] network enabling the analysis of
population-scale genomic and phenotypic data across participating nodes.

ELIXIR Cloud & AAI is led by the [ELIXIR Compute Platform][res-elixir-compute]
and is a Driver Project of the [Global Alliance for Genomics and
Health][res-ga4gh].

![banner][img-logo-banner]

## About this repository

This website is built using the [Next.js][res-next] framework for
[React.js][res-react]. Most of the pages on the website are built by [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) server-side for fast client-side rendering and better SEO.

Dynamic content for the website is fetched from [Notion][res-notion], where it
can be conveniently edited by authorized users. If you are a member of ELIXIR
Cloud & AAI and would like to contribute dynamic content, please [contact
us](#contact).

## Developing

Anyone is welcome to contribute to website development. To set up a development
environment, follow the steps outlined in this section.

### Development requirements

Ensure you have the following software installed:

- Node (v14.8.0)
- Node.js (v10.19.0)
- NPM (6.14.7)

> These are the versions used for development/testing. Other versions may or
> may not work. Please let us know if you encounter any issues with _newer_
> versions than the ones listed.

### Setting up the development environment

Fork & clone this repository on your local machine, then install the required
dependencies with:

```bash
npm install
```

For the API/backend, first create a [Notion][res-notion]. Then, open the
[ELIXIR Cloud & AAI Notion page][res-notion-elixir-cloud-aai] and duplicate
it to your account. Then, create a [Notion Developers account][res-notion-devs]
with the same email. Finally, [create a new integration][res-notion-integration]
in your account, note down the "Internal Integration Token" and [link the
integration][res-notion-link-integration] to the to the duplicated page in your
account.

Create a file `.env.local` in the repository's root directory with the
following command (don't forget to replace `YOUR_TOKEN` with your internal
integration token):

```bash
cat << EOF > .env.local
NOTION_TOKEN=<YOUR_TOKEN>
EOF
```

Start the local development server with:

```bash
npm run dev
```

## Deploying

The website can be conveniently deployed via Docker Compose.

### Deployment requirements

Ensure you have the following software installed:

- Docker (19.03.8, build afacb8b7f0)
- Docker Compose (1.23.1, build b02f1306)
- Git (2.25.1)

> These are the versions used for development/testing. Other versions may or
> may not work. Please let us know if you encounter any issues with _newer_
> versions than the ones listed.

### Deploying the website

To deploy the app, first clone the repository with _either_ of the following:

```bash
git clone https://github.com/elixir-cloud-aai/landing-page.git
git clone git@github.com:elixir-cloud-aai/landing-page.git
gh repo clone elixir-cloud-aai/landing-page
```

Then set the Notion token:

```bash
export NOTION_TOKEN=<YOUR-NOTION-TOKEN>
```

Finally, build and deploy the app image with the following command:

```bash
docker-compose up --build -d
```

The website should now be available at `http://localhost`.

> By default, the website is served at port 80. You can change that in
> `docker-compose.yaml`.

Of course, these deployment instructions are only a starting point. You may
want to adapt them to your individual needs.

> **IMPORTANT NOTE:** **Never** publish the built container image! It will be
> easy to access your Notion token.

### Taking down the website

To stop the server, run:

```bash
docker-compose down
```

## License

This project is available under the Apache 2.0 License also [shipped with this
repository](LICENSE).

## Contact

If you have suggestions for or find issue with this website, please use the
[issue tracker][contact-issue-tracker]. If you would like to reach out to us
for anything else, you can join our [Slack board][badge-url-chat], start a
thread in our [Q&A forum][contact-qa], or send us an [email][contact-email].

[badge-chat]: https://img.shields.io/static/v1?label=chat&message=Slack&color=ff6994
[badge-cd]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/cd_status.yml/badge.svg
[badge-ci]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/build.yml/badge.svg
[badge-health]: https://img.shields.io/website?url=https%3A%2F%2Felixir-cloud.dcc.sib.swiss%2F
[badge-license]: https://img.shields.io/badge/license-Apache%202.0-blue.svg
[badge-url-cd]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/cd_status.yml
[badge-url-chat]: https://join.slack.com/t/elixir-cloud/shared_invite/enQtNzA3NTQ5Mzg2NjQ3LTZjZGI1OGQ5ZTRiOTRkY2ExMGUxNmQyODAxMDdjM2EyZDQ1YWM0ZGFjOTJhNzg5NjE0YmJiZTZhZDVhOWE4MWM
[badge-url-ci]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/build.yml
[badge-url-health]: https://elixir-cloud.dcc.sib.swiss/
[badge-url-license]: http://www.apache.org/licenses/LICENSE-2.0
[contact-email]: mailto:cloud-service@elixir-europe.org
[contact-issue-tracker]: https://github.com/elixir-cloud-aai/landing-page/issues
[contact-qa]: https://github.com/elixir-cloud-aai/elixir-cloud-aai/discussions
[img-logo-banner]: public/logo-banner.svg
[res-cloud-computing]: https://en.wikipedia.org/wiki/Cloud_computing
[res-elixir-compute]: https://elixir-europe.org/platforms/compute
[res-ga4gh]: https://ga4gh.org/
[res-next]: https://nextjs.org/
[res-notion]: https://www.notion.so/
[res-notion-devs]: https://developers.notion.com/
[res-notion-elixir-cloud-aai]: https://www.notion.so/ELIXIR-Cloud-AAI-8f45ae1799b946478ae2a7838ed97dd9
[res-notion-integration]: https://developers.notion.com/docs#step-1-create-an-integration
[res-notion-link-integration]: https://developers.notion.com/docs#step-2-share-a-database-with-your-integration
[res-react]: https://reactjs.org/
