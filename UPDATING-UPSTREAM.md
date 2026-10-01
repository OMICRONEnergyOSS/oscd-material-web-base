# Updating from upstream Material Web

Use a stable
[`@material/web`](https://www.npmjs.com/package/@material/web) release tag as
the target, not upstream `main` or a nightly. Aim to align the fork's version
with that release; check its current history and version first rather than
assuming they already match. The fork may contain commits from upstream
`main` after its last release tag.

## Sync

Replace `X.Y.Z` with the chosen upstream release. Add the `upstream` remote if
it is not already present (`git remote -v`).

```bash
git remote add upstream https://github.com/material-components/material-web.git # only if missing
git fetch upstream tag vX.Y.Z
git switch main
git pull --ff-only origin main
git switch -c sync-material-web-X.Y.Z
git merge --no-ff vX.Y.Z
```

If Git says the tag is already merged, inspect the fork's history before
continuing: an existing upstream `main` sync may include the release already.
Do not make a version-only release without checking what code it contains.
Otherwise, resolve merge conflicts without dropping the fork's scoped-element
changes, package name, exports, or release workflows. Reconcile `package.json`
and `package-lock.json`, then validate:

```bash
npm ci
npm run build
npm test
```

The build regenerates `custom-elements.json`. Review and commit the resolved
files and generated changes on the sync branch. Push that branch
(`git push -u origin sync-material-web-X.Y.Z`) and open a PR; do not rebase or
force-push shared `main`.

When merging the PR, ensure the commit that lands on `main` has the footer
`Release-As: X.Y.Z` in its message body (for example, in the squash-merge
message). The colon is required. Confirm release-please opens a
`chore: release X.Y.Z` PR, then review and merge it. The release tag triggers
the fork's publish workflow; confirm the package is available before updating
consumers.

## Update consumers

Update `@omicronenergy/oscd-material-web-base` in `@omicronenergy/oscd-ui`,
refresh its lockfile, and run its build and tests.
