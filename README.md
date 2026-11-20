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

| File               | Page                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `product.json`     | [Products](https://elixir-on.cloud/products)                                                     |
| `services.json`    | [Demo](https://elixir-on.cloud/demo): live services                                              |
| `nodes.json`       | [Demo](https://elixir-on.cloud/demo): Nodes (flags in `public/flags/`, logos in `public/nodes/`) |
| `project.json`     | [Projects](https://elixir-on.cloud/projects) (parked: online, not in the menu or the sitemap)    |
| `contributor.json` | [Contributors][contributors]                                                                     |
| `funding.json`     | [Funding](https://elixir-on.cloud/funding)                                                       |

To change content, edit the relevant file and open a pull request.

The listings (Products, Funding, Contributors) share one filter behaviour
([`src/lib/filters.ts`](src/lib/filters.ts)): several filters can be selected,
and an item is listed if it matches any of them. The selection is kept in the
URL, so a link can open a listing with filters set, e.g.
`/products?filter=ga4gh-tes,ga4gh-wes`. A filter's id is its label in lower
case, with dashes for spaces and other characters.

Every page sets its own title and description for search engines and link
previews: in the `metadata` export of its `page.tsx`, or of the route's
`layout.tsx` for pages that are client components (`'use client'`). Titles
appear as `<title> | ELIXIR On-Cloud` (the template in
[`src/seo/base-seo.ts`](src/seo/base-seo.ts)), except on the home page,
which sets its full title. `src/app/metadata.test.ts` checks that every
route has a title and description of its own; add new routes to its list.

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
- `npm run lint`: lint the JavaScript and TypeScript sources with
  [ESLint](https://eslint.org/) (Next.js's recommended config with
  typescript-eslint, see [`eslint.config.js`](eslint.config.js)); fails on
  warnings too. `npm run lint-fix` fixes what can be fixed automatically.
  Images use `Image` from `next/image`, which sizes and optimizes them; the
  lint rejects plain `<img>` tags. Images from other hosts need an entry in
  `images.remotePatterns` in [`next.config.js`](next.config.js)
- `npm test`: run the tests ([Vitest](https://vitest.dev/) with Testing
  Library); `npm run test:watch` reruns them on changes
- `npm run test:coverage`: run the tests and write coverage to
  `coverage/lcov.info` (for Codecov)
- `npm run check-links`: check the outbound links in `src/` (test files,
  `*.test.json`/`*.spec.json` fixtures and `src/test/` excluded; sites that
  block automated requests, such as LinkedIn, are listed as "skip" for a manual
  check). A link is dead on 404/410, a TLS error, a DNS error that persists
  after one retry, a malformed URL, or an address outside the public internet
  (loopback, private, link-local, cloud metadata, IPv6 translation and 6to4,
  and other reserved ranges).
  The check follows redirects itself and checks every target the same way
  before requesting it. This is a pre-check: the request resolves the name
  again, so a host whose DNS answer changes in between isn't caught. Results
  need public DNS: resolvers that answer with private or synthetic addresses
  (some proxies, split-horizon DNS) make links look dead. Server errors (5xx)
  and other network errors are retried once after a short delay and, if they
  persist, reported as unverified, like other 4xx responses, redirects to other
  schemes and chains of more than 10 redirects. The command exits with 2 on
  dead links, with 0 otherwise. The [Link check](.github/workflows/links.yml)
  workflow runs it every Monday (one run at a time), shows the summary (with
  unverified links) in the run's job summary, or a failure note if the check
  broke, and opens or updates an issue for dead links.

Tests live next to the code they test (`*.test.ts(x)`). The data tests in
`src/data/data.test.ts` check the JSON files: unique ids, references between
services, products and Nodes, and that every referenced image exists.

### Checks

[CI](.github/workflows/ci.yml) runs these jobs on every pull request and push to `dev`:

- `PR title`: the title follows Conventional Commits and has at most 50
  characters (see [Contributing](#contributing)).
- `Lint`: lints all JavaScript and TypeScript sources with ESLint
  (`npm run lint`); errors and warnings fail it. It also checks the curated
  release notes in `docs/releases/` (see [Releasing](#releasing)), and that
  those of the version in `package.json` exist once it is a release version.
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

The site used to be a PWA. `public/sw.js` is written by hand and only removes
the old service worker from the browsers of past visitors. Keep it until at
least November 2027.

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
3. Keep the images on `ghcr.io` until a release from Docker Hub has proven good,
   then remove them by hand.

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

1. Open a release-prep pull request into `dev`: add the curated release notes
   as `docs/releases/<version>.md` (without the `v`, e.g.
   `docs/releases/2026.11.0.md`), and set the version in `package.json` and
   `package-lock.json`, also without the `v`. Merge it. The version in
   `package.json` must match the tag, so each release needs this change:

   ```bash
   npm version 2026.11.0 --no-git-tag-version
   ```

   The release workflow publishes the notes as the start of the GitHub
   release, so they follow the organization's format, which CI (job `Lint`)
   and the release workflow's first job check: an intro paragraph saying what
   the release brings, then the sections `## Breaking changes`, `## Features`,
   `## Security`, `## Fixes`, `## Documentation` and `## Maintenance` (in this
   order, empty ones left out), holding bullets only, each ending with its
   issue and pull request numbers, e.g., `(#12, #34)`. Links must be absolute
   (e.g., `https://elixir-on.cloud/demo`), as they must also work on GitHub;
   no `## Commits` section and no `**Full Changelog**` line, which the
   workflow adds. The shared action
   [`publish-release`](https://github.com/elixir-cloud-aai/.github/tree/main/actions/publish-release)
   describes the format and its checks.

2. Wait until CI has passed for the push to `dev` of the commit that the merge
   created on `dev` (`<sha>`, not the head of the pull request): the release
   workflow requires a successful CI run for a push of the tagged commit (runs
   for pull requests test merge commits, not the commit itself). CI also scans
   the image with the flags of the release scan (job `Scan build`), so that a
   fixable critical or high vulnerability fails CI before the tag rather than
   the release. Fix it (e.g., by bumping the Node.js image of the `Dockerfile`
   or a dependency) or, with a reason and an expiry date, accept it in
   `.trivyignore.yaml`. Either takes another pull request: release the commit
   that its merge created, once CI has passed for it. Vulnerabilities published
   between the CI run and the release can still fail the release scan: tag soon
   after CI has passed.
3. Run the release workflow's checks that need no tag, as it runs them (keep
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
       # The files of the commit, not of the working tree
       [[ "$(git show "${sha}:package.json" | jq -r .version)" == "${version}" ]] || { echo "Wrong version in package.json"; exit 1; }
       # The notes of the commit, with the checker of the action that
       # `release.yml` pins (as the job `Lint` of `ci.yml` does)
       notes="$(mktemp -d)" && git show "${sha}:docs/releases/${version}.md" > "${notes}/notes.md" &&
           curl -fsSL "https://raw.githubusercontent.com/elixir-cloud-aai/.github/31f22fccc1f3c597ed7c1d1f75b2f85522155348/actions/publish-release/publish.py" -o "${notes}/publish.py" &&
           python3 -I "${notes}/publish.py" check "${notes}/notes.md" || { echo "Release notes docs/releases/${version}.md missing or not in the format"; exit 1; }
       # Also drafts, which the release workflow can't see before it fails on them
       release="$(gh release view "v${version}" --repo elixir-cloud-aai/landing-page 2>&1)" && { echo "A release or draft of v${version} exists: delete a draft"; exit 1; }
       [[ "${release}" == *"release not found"* ]] || { echo "Cannot check the releases: ${release}"; exit 1; }
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

4. Approve the jobs of the [release
   workflow](.github/workflows/release.yml) in the `release` environment, after
   checking that the run is for the tag you pushed. It checks that GitHub
   verified the tag's signature, that its commit is on `main`, the version, the
   release notes and the CI run; pushes, scans, signs and tags the image
   (`Release image`), and then, without another approval, creates the GitHub
   release (`Publish release`): the curated notes of the tagged commit, then
   GitHub's generated notes under `## Commits` (without their
   `## What's Changed` header, with "New Contributors"), and GitHub's
   `**Full Changelog**` line last. Releases aren't edited after publishing (by
   convention): fix mistakes in the notes of the next release. If a job fails,
   use "Re-run failed jobs", not "Re-run all jobs": once the image is tagged, a
   new attempt of all jobs stops at the existing tag and can't finish the
   release, and once the GitHub release exists, `prepare` fails; a re-run of
   `Publish release` passes without changes if an earlier attempt created the
   release after all. `prepare` can't see draft releases and `Publish release`
   fails on them, so delete any draft of the tag before you push the tag. If
   `prepare` fails because CI hasn't finished for the commit, re-run the
   workflow once it passed.
5. Check the site within a few minutes: Watchtower deploys the new image, if
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

[badge-build-status]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/ci.yml/badge.svg?branch=dev
[badge-coverage]: https://codecov.io/gh/elixir-cloud-aai/landing-page/branch/dev/graph/badge.svg?branch=dev
[badge-docker]: https://img.shields.io/docker/v/elixircloud/landing-page?sort=semver&label=image&color=C39BD3
[badge-github-tag]: https://img.shields.io/github/v/tag/elixir-cloud-aai/landing-page?color=C39BD3
[badge-license]: https://img.shields.io/badge/license-Apache%202.0-blue.svg
[badge-url-build-status]: https://github.com/elixir-cloud-aai/landing-page/actions/workflows/ci.yml?query=branch%3Adev
[badge-url-coverage]: https://codecov.io/gh/elixir-cloud-aai/landing-page?branch=dev
[badge-url-docker]: https://hub.docker.com/r/elixircloud/landing-page/tags
[badge-url-github-tag]: https://github.com/elixir-cloud-aai/landing-page/releases
[badge-url-license]: https://www.apache.org/licenses/LICENSE-2.0
[badge-website]: https://img.shields.io/website?url=https%3A%2F%2Felixir-on.cloud%2F
[contributors]: https://elixir-on.cloud/contributors
[ga4gh-driver-projects]: https://www.ga4gh.org/our-community/driver-projects/
[website]: https://elixir-on.cloud/
