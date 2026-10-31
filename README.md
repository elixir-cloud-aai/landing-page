<a href="https://elixir-on.cloud/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/logo_elixir_on_cloud_night.png">
    <img src="docs/images/logo_elixir_on_cloud.png" alt="ELIXIR On-Cloud">
  </picture>
</a>

# ELIXIR On-Cloud website

[![License][badge-license]][badge-url-license]
[![Website][badge-website]][website]
[![Build_status][badge-build-status]][badge-url-build-status]
[![Deploy][badge-deploy]][badge-url-deploy]

The source of the website of [ELIXIR On-Cloud][website]: standards-based
products and architecture patterns for federated analytics in biomedical
research, healthcare and beyond. ELIXIR On-Cloud is a [Driver
Project][ga4gh-driver-projects] of the Global Alliance for Genomics and Health
(GA4GH), governed by the ELIXIR Compute Platform; the website presents its
products, services, nodes, projects, contributors and funders.

The website is built with [Next.js](https://nextjs.org/) and
[React](https://react.dev/). Every page is rendered statically at build time;
there is no backend and no build-time secret.

## Content

Content lives in JSON files under [`src/data/`](src/data/):

| File               | Page                                         |
| ------------------ | -------------------------------------------- |
| `product.json`     | [Products](https://elixir-on.cloud/products) |
| `services.json`    | [Services](https://elixir-on.cloud/services) |
| `nodes.json`       | Nodes (flags in `public/flags/`)             |
| `project.json`     | [Projects](https://elixir-on.cloud/projects) |
| `contributor.json` | [Contributors][contributors]                 |
| `funding.json`     | [Funding](https://elixir-on.cloud/funding)   |

To change content, edit the relevant file and open a pull request.

## Development

With [Node.js](https://nodejs.org/) 22 and npm installed, install the
dependencies and start the development server:

```bash
npm install
cp .env.example .env.local   # optional; all values have defaults
npm run dev
```

Useful commands:

- `npm run build`: production build (also generates the sitemap)
- `npx tsc --noEmit`: type-check
- `npm run check-links`: report dead outbound links in `src/`

## Deployment

Pushes to `main` trigger the [Deploy workflow](.github/workflows/deploy.yml),
which publishes the image to the GitHub Container Registry (`ghcr.io`, tagged
`latest` and with the commit SHA). On the host,
[`docker-compose.yaml`](docker-compose.yaml) runs the site together with
[Watchtower](https://containrrr.dev/watchtower/), which pulls new images every
5 minutes and restarts the site:

```bash
git clone https://github.com/elixir-cloud-aai/landing-page.git
cd landing-page
docker compose up -d
```

The site listens on port 80 (change it in `docker-compose.yaml`). TLS is
expected to be terminated by a reverse proxy in front of it.

To roll back, pin the `site` image to a previous `sha-<commit>` tag and run
`docker compose up -d`. To build locally instead of pulling, run
`docker compose up -d --build`.

## Contributing

Contributions are welcome! Report problems with the website or suggest
changes in the [issue tracker](../../issues), or open a pull request. For
anything else, write to
[cloud-service@elixir-europe.org](mailto:cloud-service@elixir-europe.org).

## License

The website is licensed under the [Apache License 2.0](LICENSE).

[badge-build-status]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/ci.yml/badge.svg
[badge-deploy]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/deploy.yml/badge.svg
[badge-license]: https://img.shields.io/badge/license-Apache%202.0-blue.svg
[badge-url-build-status]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/ci.yml
[badge-url-deploy]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/deploy.yml
[badge-url-license]: https://www.apache.org/licenses/LICENSE-2.0
[badge-website]: https://img.shields.io/website?url=https%3A%2F%2Felixir-on.cloud%2F
[contributors]: https://elixir-on.cloud/contributors
[ga4gh-driver-projects]: https://www.ga4gh.org/our-community/driver-projects/
[website]: https://elixir-on.cloud/
