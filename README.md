# RacingApp

## Requirements

- nodejs v20 LTS
- docker

## Install

In repo root:

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

## Notes

```
for name in $(docker ps -a --format '{{.Names}}' | grep supabase_ | grep _racing-app) ; do docker update --restart=no $name ; done
```
