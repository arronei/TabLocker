## Summary

<!-- What does this PR do and why? -->

## PR title requirement

This repo squash-merges every PR, and the PR title becomes the commit message on `main`.
The title **must** follow [Conventional Commits](https://www.conventionalcommits.org/) and is enforced by CI:

```
<type>: <description>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Checklist

- [ ] Tests pass locally (`yarn test:unit`)
- [ ] Lint / typecheck / build pass locally (`yarn lint`, `yarn typecheck`, `yarn build`)
- [ ] Linked issue, if applicable (e.g. `Closes #N`)

## Linked issue

Closes #
