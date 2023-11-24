# Calendar Todo

A simple todo organizer app, that I've developed just to try out some new tech, coming out of a sabatical.
Its the perfect app for a try out - not too complex so it doesn't take too much tiem to implement, but still requires significant forthought - user maangement, resource management etc. Simply a delight.

# Demo

You can login and play around at [calendar-todo.ikerin.com](https://calendar-todo.ikerin.com). Will require a newish browers with passkeys (passwordless) support.

## Breakdown

More on the technical implementation, decisions, woes and findings can be read at the individual app's package folders

[/backend](/backend) REST api, built with [fastify](https://fastify.dev) and [prisma](https://prisma.io)
[/frontend](/frontend) SPA app built with [React](https://react.dev) and [redux toolkit](https://redux-toolkit.js.org)

Whole thing is wrapped in a [yarn monorepo](https://yarnpkg.com/features/workspaces) and deployed via [fly.io](https://fly.io)

## Copyright

Apache License 2 - 2023 Ivan Kerin
Read the [LICENSE](./LICENSE) file.
