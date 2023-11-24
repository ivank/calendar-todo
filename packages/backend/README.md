# Calendar Todo Backend API

A [fastify](https://fastify.dev) server that utilizes [prisma](https://prisma.io) for data modeling. Exposes an automatically generated and enforced openapi.

## Dev Diary

Back before [nextjs](http://nextjs.org) and fastify I did develop my own framework - [laminar](http://github.com/ivank/laminar) on two major axises - make it work with extensible typescript types, and use as few deps as possible. Now I wanted to see if the world has moved on enough that what I did was not needed anymore.

### Fastify

I so want to like this project ... it does so much stuff well - it is indeed a better, faster, more typescript-y express. But it still has ways to go. Instead of function composition which would have allowed it to work seamlessly with typescript, there are awkward, stateful method calls and method chains everywhere. It does work, and work well, but not very safely. Maybe the next generation, something built for deno?

For example in order to generate openapi file you have to construct your full app. The fastify authors have chosen for better or worse to follow in the express' footsteps and make everything so malleable that type simply cannot be done for some tasks, even with the latest TypeScript has to offer.

### Prisma

I ... like it. I started out not really - its the least common denominator of the various DBs, thus it looses on features to all of them. And the data modeling is rather lacking in composition - any composition really. But the more I read on it the more I like it. After its latest updates it becomes extremely extensible and thus can now solve most of the rough edges I've had with it before.

Hope people build on it a bit more to offer some of the tooling that pythonists/rubyist have had for decades with [sqlalchemy](https://www.sqlalchemy.org) and [active model](https://guides.rubyonrails.org/active_model_basics.html).

### Vitest

Was really positively surprised that I could use my frontend testing runner to test backend - and test it well, managed to displace jest from my heart with regards to unit testing, which is something I never thought possible!
