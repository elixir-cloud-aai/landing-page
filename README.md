<!-- markdownlint-disable MD033 MD041 -- logo first; <picture> for dark mode -->
<a href="https://elixir-on.cloud/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/logo_elixir_on_cloud_night.png">
    <img src="docs/images/logo_elixir_on_cloud.png" alt="ELIXIR On-Cloud">
  </picture>
</a>
<!-- markdownlint-enable MD033 MD041 -->

# ELIXIR On-Cloud website

[![License][badge-license]][badge-url-license]
[![Website][badge-website]][website]
[![Coverage][badge-coverage]][badge-url-coverage]
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

| File               | Page                                                       |
| ------------------ | ---------------------------------------------------------- |
| `product.json`     | [Products](https://elixir-on.cloud/products)               |
| `services.json`    | [Services](https://elixir-on.cloud/services)               |
| `nodes.json`       | Nodes (flags in `public/flags/`, logos in `public/nodes/`) |
| `project.json`     | [Projects](https://elixir-on.cloud/projects)               |
| `contributor.json` | [Contributors][contributors]                               |
| `funding.json`     | [Funding](https://elixir-on.cloud/funding)                 |

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
- `npm test`: run the tests ([Vitest](https://vitest.dev/) with Testing
  Library); `npm run test:watch` reruns them on changes
- `npm run test:coverage`: run the tests and write coverage to
  `coverage/lcov.info` (for Codecov)
- `npm run check-links`: check the outbound links in `src/` (test files
  excluded). A link is dead on 404/410, a TLS error, or a DNS error that
  persists after one retry; server errors (5xx) and other network errors are
  retried once after a short delay and, if they persist, reported as
  unverified, like other 4xx responses. The command exits with 2 on dead
  links, with 0 otherwise. The [Link check](.github/workflows/links.yml)
  workflow runs it every Monday, shows the summary (with unverified links) in
  the run's job summary, and opens or updates an issue for dead links.

Tests live next to the code they test (`*.test.ts(x)`). The data tests in
`src/data/data.test.ts` check the JSON files: unique ids, references between
services, products and Nodes, and that every referenced image exists.

### Checks

[CI](.github/workflows/ci.yml) runs these jobs on every pull request and push:

- `PR title`: the title follows Conventional Commits and has at most 50
  characters (see [Contributing](#contributing)).
- `Test`: runs the tests with coverage and reports it to
  [Codecov][badge-url-coverage]. [`codecov.yml`](codecov.yml) states the target
  of this repo (70%, working up from about 38%); the status only reports for
  now, it doesn't fail. The upload uses the organization's secret
  `CODECOV_TOKEN`. Its errors fail the job only on pushes to this repository,
  as forks and Dependabot get no access to the token.
- `Build`: checks the formatting and types of `src/`, then builds the site.
- `Audit`: fails on high and critical advisories in the production dependencies.
  To run it locally: `npm audit --omit=dev --audit-level=high`. Development
  tools are not audited, as they don't reach the site. The job checks npm's
  advisory database as it is when the job runs, so a newly published advisory
  fails every new run, without a change to the code, and also holds back
  deployments of commits without a green run. Fix it by updating the package
  (`npm update <package>` within its version range, otherwise
  `npm install <package>@<fixed version>`, or the dependency that pulls it in).
  There is no list of accepted advisories: if no fix exists yet, a maintainer
  decides, in a pull request, whether to change the job for the time being.
- `Build image`: builds the production image from the `Dockerfile`.
- `Scan build`: scans that image with [Trivy](https://trivy.dev/), uploads the
  findings that have a fix to code scanning, and fails on critical and high ones
  that have a fix. Accepted findings go into
  [`.trivyignore.yaml`](.trivyignore.yaml), with a reason and an expiry date.
- `CI passed`: the only check that the rules for `dev` require. It passes if all
  other jobs passed; only `PR title` may be skipped.

ESLint isn't checked yet ([#179](../../issues/179)).

## Deployment

Pull requests go to `dev`, the default branch. `main` only moves forward to
versions that should go live: maintainers fast-forward it to a commit of `dev`
that passed CI, which deploys that commit:

```bash
git fetch origin
git push origin <commit of dev that passed CI>:main
```

Once CI has passed for a push to `main`, the [Deploy
workflow](.github/workflows/deploy.yml) publishes the image to the GitHub
Container Registry (`ghcr.io`, tagged `latest` and with the commit SHA). A
commit whose CI failed is not deployed.

- Skipped commits: if a newer commit of `main` exists when CI for an older
  one completes, the older one is skipped, so that `latest` never moves
  back; the newer one is deployed once its CI passed. If that CI fails, fix
  forward, or deploy the older commit by hand (below).
- Manual deploys (Actions, "Deploy", "Run workflow", on `main`): leave `sha`
  empty to deploy the latest commit of `main`, or give the full SHA of a
  commit of `main`, e.g., to roll back. They too require a successful CI run
  for a push of that commit to `main` and otherwise fail, saying so (re-run
  the workflow once CI has passed).

On the host,
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

Vercel builds preview deployments for pull requests and `dev`, which has a
stable preview URL: `vercel.json` turns off deployments of `main`, as the
production site is served from the host above.

The site used to be a PWA. `public/sw.js` is written by hand and only removes
the old service worker from the browsers of past visitors. Keep it until at
least November 2027.

To roll back, pin the `site` image to a previous `sha-<commit>` tag and run
`docker compose up -d`. To build locally instead of pulling, run
`docker compose up -d --build`.

## Contributing

Contributions are welcome! Report problems with the website or suggest
changes in the [issue tracker](../../issues), or open a pull request against
`dev`. For anything else, write to
[cloud-service@elixir-europe.org](mailto:cloud-service@elixir-europe.org).

Pull request titles become the commit messages on `dev`: they follow
[Conventional Commits](https://www.conventionalcommits.org/) and have at most
50 characters (see the [contributing guide of ELIXIR On-Cloud](https://github.com/elixir-cloud-aai/.github/blob/main/CONTRIBUTING.md)).
CI checks the title (job `PR title`) and rechecks it when you edit it.

[badge-build-status]: <https://github.com/elixir-cloud-aai/landing-page/actions/workflows/ci.yml/badge.svg?branch=dev>
[badge-coverage]: <https://codecov.io/gh/elixir-cloud-aai/landing-page/branch/dev/graph/badge.svg?branch=dev>
[badge-deploy]: <https://github.com/elixir-cloud-aai/landing-page/actions/workflows/deploy.yml/badge.svg?branch=main>
[badge-license]: <https://img.shields.io/badge/license-Apache%202.0-blue.svg>
[badge-url-build-status]: <https://github.com/elixir-cloud-aai/landing-page/actions/workflows/ci.yml?query=branch%3Adev>
[badge-url-coverage]: <https://codecov.io/gh/elixir-cloud-aai/landing-page?branch=dev>
[badge-url-deploy]: <https://github.com/elixir-cloud-aai/landing-page/actions/workflows/deploy.yml?query=branch%3Amain>
[badge-url-license]: <https://www.apache.org/licenses/LICENSE-2.0>
[badge-website]: <https://img.shields.io/website?url=https%3A%2F%2Felixir-on.cloud%2F>
[contributors]: <https://elixir-on.cloud/contributors>
[ga4gh-driver-projects]: <https://www.ga4gh.org/our-community/driver-projects/>
[website]: <https://elixir-on.cloud/>
