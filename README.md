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
[![Build_status][badge-build-status]][badge-url-build-status]
[![GitHub_tag][badge-github-tag]][badge-url-github-tag]
[![Docker_image][badge-docker]][badge-url-docker]

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
- `npm run check-links`: report dead outbound links in `src/`

Tests live next to the code they test (`*.test.ts(x)`). The data tests in
`src/data/data.test.ts` check the JSON files: unique ids, references between
services, products and Nodes, and that every referenced image exists.

## Deployment

Pull requests go to `dev`, the default branch. `main` only moves forward to
commits of `dev` that are released, and release tags are on `main` (see
[Releasing](#releasing)). A release publishes the image
[`elixircloud/landing-page`][badge-url-docker] on Docker Hub, tagged with its
version (e.g. `2026.11.0`) and, if it is the highest release, `latest`. Moving
`main` or merging into `dev` publishes nothing.

On the host, [`docker-compose.yaml`](docker-compose.yaml) runs the site together
with [Watchtower](https://containrrr.dev/watchtower/), which pulls new images
every 5 minutes and restarts the site, so a new release goes live within minutes
of its image being tagged `latest` (once the host has moved to Docker Hub, see
[below](#moving-the-host-to-docker-hub)):

```bash
git clone --branch main https://github.com/elixir-cloud-aai/landing-page.git
cd landing-page
docker compose up -d
```

Watchtower updates the image only: when `docker-compose.yaml` changes, run
`git pull` and `docker compose up -d` on the host. The site listens on port 80
(change it in `docker-compose.yaml`). TLS is expected to be terminated by a
reverse proxy in front of it. To build locally instead of pulling, run
`docker compose up -d --build`.

Vercel builds preview deployments for pull requests and `dev`, which has a
stable preview URL: `vercel.json` turns off deployments of `main`, as the
production site is served from the host above.

### Moving the host to Docker Hub

Images used to be published to the GitHub Container Registry (`ghcr.io`), and a
host set up then keeps following `ghcr.io/elixir-cloud-aai/landing-page:latest`,
to which nothing is published any more. It has to move by hand, once, and only
after the first release has finished: until then, `latest` on Docker Hub is an
old image from 2024, and a host that pulls it would serve that old site.

1. Check that the first release has been published, and that `latest` on
   [Docker Hub][badge-url-docker] was pushed with it.
2. On the host, undo local changes to the file with
   `git checkout docker-compose.yaml`, and note them first if you need to apply
   them again (e.g., another port). Check out `main`, pull it, and run
   `docker pull elixircloud/landing-page:latest` and `docker compose up -d`.
   Check the site.
3. Keep the images on `ghcr.io` until a release from Docker Hub has proven good.

Until the host has moved, roll back with the steps below, using the image
`ghcr.io/elixir-cloud-aai/landing-page:sha-<full SHA of the commit>`. Those
images are also the only fallback if the first release from Docker Hub turns
out bad.

### Rolling back

Releases can't be changed or moved, and `latest` never moves back by itself, so
a rollback pins the host to an earlier version, and the fix is a new release:

1. Find the last good version under [Releases][badge-url-github-tag], e.g.
   `v2026.11.0`. The image tag has no `v`.
2. On the host, pull that version, so that a wrong version fails here:
   `docker pull elixircloud/landing-page:2026.11.0`. (`docker compose up` would
   ignore the failure and build the image from the checkout instead.)
3. In `docker-compose.yaml`, replace the `latest` of the `site` image with that
   version, e.g. `elixircloud/landing-page:2026.11.0`, and run
   `docker compose up -d`. Check the site. While pinned, the host doesn't pick
   up new releases.
4. Fix the problem and release a new version.
5. Once that version is out, set the image back to
   `elixircloud/landing-page:latest`, and run
   `docker pull elixircloud/landing-page:latest` and `docker compose up -d`, so
   that the host doesn't restart from its old local `latest`.

## Releasing

Versions are calendar versions, `vYYYY.M.MICRO`, as nothing depends on the
website's API: the year and month of the release, with the month not
zero-padded, and `MICRO` counting the releases of that month, from 0. For
example, the first release of November 2026 is `v2026.11.0` and the next one
`v2026.11.1`; the first one of December is `v2026.12.0`. For the next `MICRO`,
check the tags, not the releases (`git fetch --tags origin`, then
`git tag -l 'v2026.11.*'`): a version that was tagged is used up, also if its
release failed. Months in the future (UTC) are rejected. There are no
pre-releases, as the Vercel previews cover that.

Releases are cut by the maintainers:

1. Open a release-prep pull request into `dev` that sets the version in
   `package.json` and `package-lock.json`, without the `v`, and merge it. The
   version in `package.json` must match the tag, so each release needs this
   change:

   ```bash
   npm version 2026.11.0 --no-git-tag-version
   ```

2. Wait until CI has passed for the push to `dev` of the commit that the merge
   created on `dev` (`<sha>`, not the head of the pull request): the release
   workflow requires a successful CI run for a push of the tagged commit (runs
   for pull requests test merge commits, not the commit itself).
3. CI doesn't scan the image yet
   ([#166](https://github.com/elixir-cloud-aai/landing-page/issues/166)), but
   the release workflow does, and a fixable critical or high vulnerability fails
   the release after the tag. So check out the commit, build its image and scan
   it with the same flags first:

   ```bash
   docker build -t landing-page:release-check .
   trivy image --ignorefile .trivyignore.yaml --severity CRITICAL,HIGH \
       --ignore-unfixed --exit-code 1 landing-page:release-check
   ```

   Fix what it finds (e.g., by bumping the Node.js image of the `Dockerfile` or
   a dependency) or, with a reason and an expiry date, accept it in
   `.trivyignore.yaml`. Either takes another pull request: release the commit
   that its merge created, once CI has passed for it.
4. Run the release workflow's checks that need no tag, as it runs them (keep
   these commands in sync with the job `prepare` of
   [`release.yml`](.github/workflows/release.yml)), in Bash. Run them before
   tagging: the release workflow checks the tagged commit, so a check that fails
   after the tag is pushed (other than a CI run that hasn't finished yet) fails
   again on re-runs, and the release then needs a new version. The commands
   expect `origin` to be `elixir-cloud-aai/landing-page`.

   ```bash
   version=YYYY.M.MICRO  # e.g. 2026.11.0
   sha=""
   # Replace <sha> with the commit from step 2; this gets the full SHA
   git fetch origin && sha="$(git rev-parse --verify "<sha>^{commit}")"
   (
       [[ -n "${sha}" ]] || { echo "Fetch failed, or the commit is unknown"; exit 1; }
       git merge-base --is-ancestor "${sha}" origin/dev || { echo "${sha} is not on dev"; exit 1; }
       pattern='^v20[0-9]{2}\.([1-9]|1[0-2])\.(0|[1-9][0-9]*)$'
       [[ "v${version}" =~ ${pattern} ]] || { echo "Not a release version: v${version}"; exit 1; }
       IFS=. read -r year month _ <<< "${version}"
       (( year * 100 + month <= $(date -u +%Y%m) )) || { echo "Version is in the future: v${version}"; exit 1; }
       # The file of the commit, not of the working tree
       [[ "$(git show "${sha}:package.json" | jq -r .version)" == "${version}" ]] || { echo "Wrong version in package.json"; exit 1; }
       runs="$(gh api "repos/elixir-cloud-aai/landing-page/actions/workflows/ci.yml/runs?head_sha=${sha}&branch=dev&event=push&status=success&per_page=1" --jq .total_count)"
       (( runs >= 1 )) || { echo "No successful CI run for the push of ${sha} to dev"; exit 1; }
       git merge-base --is-ancestor origin/main "${sha}" || { echo "main can't be fast-forwarded to ${sha}"; exit 1; }
   ) && echo "All checks passed"
   ```

   Only if all checks passed, move `main` to the commit and tag it with a
   signed, annotated tag. Each command runs only if the one before it succeeded:
   a tag on a commit that isn't on `main` would use up the version.

   ```bash
   # ${sha:?} stops if it is empty: pushing ":main" would delete the branch
   git push origin "${sha:?}:main" &&  # fails unless it is a fast-forward
       git tag -s "v${version:?}" "${sha}" -m "v${version}" &&
       git push origin "v${version}"
   ```

5. Approve the jobs of the [release
   workflow](.github/workflows/release.yml) in the `release` environment, after
   checking that the run is for the tag you pushed. It checks that GitHub
   verified the tag's signature, that its commit is on `main`, the version and
   the CI run; pushes, scans, signs and tags the image, and publishes the GitHub
   release with the generated notes. If a job fails, use "Re-run failed jobs",
   not "Re-run all jobs": once the image is tagged, a new attempt of all jobs
   stops at the existing tag and can't finish the release. If `prepare` fails
   because CI hasn't finished for the commit, re-run the workflow once it
   passed.
6. Edit the release notes into the org's format: an intro paragraph; the
   sections `## Breaking changes`, `## Features`, `## Security`, `## Fixes`,
   `## Documentation` and `## Maintenance`, without the empty ones, each bullet
   ending with its issue and pull request numbers; then the generated notes
   under `## Commits` instead of `## What's Changed`, and last their
   `**Full Changelog**` line.
7. Check the site within a few minutes: Watchtower deploys the new image, if
   this is the highest release (the workflow warns otherwise). After the first
   release, [move the host to Docker Hub](#moving-the-host-to-docker-hub).

The repository needs, once: an environment `release` with a required reviewer,
deployments limited to `v*` tags, and access to the secrets `DOCKERHUB_LOGIN`
and `DOCKERHUB_TOKEN` (allowed to push `elixircloud/landing-page`, a public
repository on Docker Hub); a ruleset that lets only maintainers create `v*` tags
and keeps them from being moved or deleted; a ruleset for `main` that lets only
maintainers update it and protects it against deletion and non-fast-forward
pushes; and immutable releases. Forks can publish to their own Docker Hub
organization by setting the repository variable `DOCKERHUB_ORG`. The optional
variable `GA_MEASUREMENT_ID` goes into the image at build time (see the
`Dockerfile`).

Tags, published releases and released images can't be changed: if a release
fails after its tag was pushed and re-running its failed jobs doesn't help,
release the next version, with its own release-prep pull request.

The workflow `Scan` ([`scan.yml`](.github/workflows/scan.yml)) scans the image
of the latest release every Monday, and can be run by hand. It uploads the
fixable findings to code scanning and a full report as a workflow artifact, and
fails on fixable critical and high vulnerabilities: release a new version with
the fix.

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
[badge-docker]: <https://img.shields.io/docker/v/elixircloud/landing-page?sort=semver&label=image&color=C39BD3>
[badge-github-tag]: <https://img.shields.io/github/v/tag/elixir-cloud-aai/landing-page?color=C39BD3>
[badge-license]: <https://img.shields.io/badge/license-Apache%202.0-blue.svg>
[badge-url-build-status]: <https://github.com/elixir-cloud-aai/landing-page/actions/workflows/ci.yml?query=branch%3Adev>
[badge-url-docker]: <https://hub.docker.com/r/elixircloud/landing-page/tags>
[badge-url-github-tag]: <https://github.com/elixir-cloud-aai/landing-page/releases>
[badge-url-license]: <https://www.apache.org/licenses/LICENSE-2.0>
[badge-website]: <https://img.shields.io/website?url=https%3A%2F%2Felixir-on.cloud%2F>
[contributors]: <https://elixir-on.cloud/contributors>
[ga4gh-driver-projects]: <https://www.ga4gh.org/our-community/driver-projects/>
[website]: <https://elixir-on.cloud/>
