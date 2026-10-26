# ELIXIR On-Cloud landing page

[![license][badge-license]][badge-url-license]
[![website][badge-health]][badge-url-health]
[![chat][badge-chat]][badge-url-chat]
[![ci][badge-ci]][badge-url-ci]
[![deploy][badge-cd]][badge-url-cd]

This is the repository for the [official website][badge-url-health] of **ELIXIR
On-Cloud**, a transnational effort towards establishing a federated [cloud
computing][res-cloud-computing] network enabling the analysis of
population-scale genomic and phenotypic data across participating nodes.

ELIXIR On-Cloud is led by the [ELIXIR Compute Platform][res-elixir-compute]
and is a Driver Project of the [Global Alliance for Genomics and
Health][res-ga4gh].

![banner][img-logo-banner]

## About this repository

This website is built with [Next.js][res-next] and [React][res-react]. Every
page is rendered statically at build time; there is no backend and no
build-time secret.

Content lives in JSON files under `src/data/`:

| File               | Page                                                              |
| ------------------ | ----------------------------------------------------------------- |
| `product.json`     | [Products](https://elixir-on.cloud/products)                      |
| `services.json`    | [Services](https://elixir-on.cloud/services)                      |
| `nodes.json`       | [Nodes](https://elixir-on.cloud/nodes) (flags in `public/flags/`) |
| `project.json`     | [Projects](https://elixir-on.cloud/projects)                      |
| `contributor.json` | [Contributors](https://elixir-on.cloud/contributors)              |
| `funding.json`     | [Funding](https://elixir-on.cloud/funding)                        |

To change content, edit the relevant file and open a pull request.

## Developing

Requirements: Node.js 22 and npm.

```bash
npm install
cp .env.example .env.local   # optional; all values have defaults
npm run dev
```

Useful commands:

- `npm run build`: production build (also generates the sitemap)
- `npx tsc --noEmit`: type-check
- `npm run check-links`: report dead outbound links in `src/`

## Deploying

Pushes to `main` trigger the [Deploy workflow](.github/workflows/deploy.yml),
which publishes the image to `ghcr.io/elixir-cloud-aai/landing-page` (tagged
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

## License

This project is available under the Apache 2.0 License also [shipped with this
repository](LICENSE).

## Contact

If you have suggestions for or find issue with this website, please use the
[issue tracker][contact-issue-tracker]. If you would like to reach out to us
for anything else, you can join our [Slack board][badge-url-chat], start a
thread in our [Q&A forum][contact-qa], or send us an [email][contact-email].

[badge-chat]: https://img.shields.io/static/v1?label=chat&message=Slack&color=ff6994
[badge-cd]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/deploy.yml/badge.svg
[badge-ci]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/ci.yml/badge.svg
[badge-health]: https://img.shields.io/website?url=https%3A%2F%2Felixir-on.cloud%2F
[badge-license]: https://img.shields.io/badge/license-Apache%202.0-blue.svg
[badge-url-cd]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/deploy.yml
[badge-url-chat]: https://join.slack.com/t/elixir-cloud/shared_invite/enQtNzA3NTQ5Mzg2NjQ3LTZjZGI1OGQ5ZTRiOTRkY2ExMGUxNmQyODAxMDdjM2EyZDQ1YWM0ZGFjOTJhNzg5NjE0YmJiZTZhZDVhOWE4MWM
[badge-url-ci]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/ci.yml
[badge-url-health]: https://elixir-on.cloud/
[badge-url-license]: http://www.apache.org/licenses/LICENSE-2.0
[contact-email]: mailto:cloud-service@elixir-europe.org
[contact-issue-tracker]: https://github.com/elixir-cloud-aai/landing-page/issues
[contact-qa]: https://github.com/elixir-cloud-aai/elixir-cloud-aai/discussions
[img-logo-banner]: public/logo-banner.svg
[res-cloud-computing]: https://en.wikipedia.org/wiki/Cloud_computing
[res-elixir-compute]: https://elixir-europe.org/platforms/compute
[res-ga4gh]: https://ga4gh.org/
[res-next]: https://nextjs.org/
[res-react]: https://reactjs.org/
