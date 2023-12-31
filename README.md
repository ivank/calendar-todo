# Calendar Todo

A simple todo organizer app, that I've developed just to try out some new tech, coming out of a sabbatical.
Its the perfect app for a try out - not too complex so it doesn't take too much time to implement, but still requires significant forethought - user management, resource management etc. Simply a delight.

# Demo

[![Screenshot](/screenshot.png)](https://calendar-todo.ikerin.com)

You can login and play around at [calendar-todo.ikerin.com](https://calendar-todo.ikerin.com). Will require a newish browser with passkeys (passwordless) support.

# Inspiration

The project implements a very simple "linear sync" engine, inspired by the linear project app https://www.youtube.com/watch?v=Wo2m3jaJixU to do a "local first" experience.

## Breakdown

More on the technical implementation, decisions, woes and findings can be read at the individual app's package folders

- [packages/backend](/backend) - REST api, built with [fastify](https://fastify.dev) and [prisma](https://prisma.io)
- [packages/frontend](/frontend) - SPA app built with [React](https://react.dev) and [redux toolkit](https://redux-toolkit.js.org)

Whole thing is wrapped in a [yarn monorepo](https://yarnpkg.com/features/workspaces) and deployed via [fly.io](https://fly.io)

## Copyright

Apache License 2 - 2023 Ivan Kerin, Read the [LICENSE](./LICENSE) file.
