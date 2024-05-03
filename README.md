# RacingApp

![Main Branch](https://github.com/dsge/racing-app/actions/workflows/pipeline-build-test-deploy.yml/badge.svg?branch=main)

## Requirements

- nodejs v20 LTS
- docker

## Install

In repo root:

- `corepack enable`
- `yarn`

## Running

- `npx supabase start`
- `npx ng serve`

## Development

- `npx supabase db reset`

### Local test users:

- `user1@example.com` //// `password123`
- `user2@example.com` //// `password123`
- ...
- `user10@example.com` //// `password123`

`user2` is a moderator, the others are not

## Recommended editor plugins

- editorconfig
- eslint
- esbenp.prettier-vscode ( or equivalent ) and enable format on save

## Notes

```
for name in $(docker ps -a --format '{{.Names}}' | grep supabase_ | grep _racing-app) ; do docker update --restart=no $name ; done
```
