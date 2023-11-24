# Calendar Todo Frontend SPA

React SPA, built and bundled with [vite](https://vitejs.dev).
[Redux](https://redux.js.org), [redux-toolkit](http://redux-toolkit.js.org) and its [rtk-query](https://redux-toolkit.js.org/rtk-query/overview) are the state management backbone of this operation.
Utilizing [tailwindcss](https://tailwindcss.com) and [heroicons](https://heroicons.com).

## Dev Diary

Here are some of y thoughts while I was developing this thing.

### Redux

So I delved into Redux/Redux-toolkit/rtk-query."Why?" you would ask - well I've been the first tool I've used react with, oh so many years ago, when react was still in its infancy - 0.13 IIRC. I was blown away by the clarity and brilliance of the redux - a _very_ small and simple codebase could accomplish so much.

Later on I've encountered Clojure and saw how the idea of react and redux, pure functions, declarative style could do even more, with even less. ([re-frame](https://github.com/day8/re-frame) lib, if you're wondering). React+redux was immature at the time needed a lot of other pieces to make it work with the real world - sagas, routers, thunks etc, but I always thought someone smart would come along and follow the great start of redux to make it easy to use as well.

I've waned from redux for a while, mostly after reading the faithful [reducing our redux code](https://www.apollographql.com/blog/apollo-client/reducing-our-redux-code-with-react-apollo/) blog post from apollo graphql client. Using [react-query](https://tanstack.com/query/v3/docs/react/overview) and some [custom react context](https://react.dev/reference/react/useContext). Sure I'd lose the replay-ability that redux would offer, but I wasn't using it anyway. But in the back of my mind I still believed, someday someone would pick up the flag and do it _right_.

Well I come back to the present (2023) day and what do I find in redux-toolkit ... in the service of ease of use, it has lost almost all of its elegance - it _works_ but its quite far away from the promise that redux gave us.

For example, rtk-query is so incredibly stateful that they needed "inject" methods to modify configs for various endpoints. Making typescript type generation for it quite the challenge.

### Tailwind

I've used tailwind sporadically before, but now I finally was able to stretch its legs a bit. Its incredibly nice! A bit different from [twitter's bootstrap](https://getbootstrap.com), [foundation](https://get.foundation) or [bulma](https://bulma.io) though - its freeform and infinitely customizable. Where those frameworks offered you "a way to do things" and if you followed it you'd get a very uniformly crispy style, if you wanted to mold it into your project ... well it wasn't a cakewalk.

Tailwind kinda goes into the other extreme - you can do anything, but it lacks the kind of structure that teams would need to do things consistently. I guess you need some good design system guys at your company and should end up with the best of both worlds. Its _easy_ to build a design system in for sure! Just doesn't come with one - and no the paid [Tailwind UI](https://tailwindui.com) doesn't come close - I did pay for it and while it did the job and was fabulously well designed, it still isn't a framework.

Would still chose it in a heartbeat for any new project though.

### Vite

Finally something that works, and works reasonably well, after decades setting up [gulp](https://gulpjs.com) pipelines, and [webpack](https://webpack.js.org) monsters, I think its quite the fresh start.

Alongside [vitest](https://vitejs.dev) I couldn't be happier. A bit of tweaks here and there needed of course, but oh so much nicer.
