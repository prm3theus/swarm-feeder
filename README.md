# 🐝 swarm-feeder 🍯 (in progress)
Use a sticky & memorable name to seed a p2p swarm and generate feeds, managed by [multifeed](https://github.com/kappa-db/multifeed).. in the web 🕸️.

Really just an opinionated & useful combination of abstractions from a few ~floating hypercore based modules (e.g. hypercore, hyperswarm, multifeed, crypto, etc.) for any p2p farmer, punk, or api(ar)ists.

## How to Use

```js
// duh
const SwarmFeeder = require('swarm-feeder')

// if for the web, pass in `wsProxy`
const feeder = SwarmFeeder({encoding: 'utf-8'}) 

// seed or join a name for the swarm, outputs hash (can join from hash too)
await feeder.join("bumble-colony")
// => 'bee80ff3a4ee5e727dc44197cb9d25bf8f19d50b0f3ad2984cfe5b7d14e75de7'
// => 2 peers connected, things are happenin'

// push to the default local feed, replicates to all remote
await feeder.local.push("bzz")

// keep a watch out for items that are added
await feeder.watch()
// => watching for anything new ... 
// => got one! { 'bzz' }

// pull from remote feed, based on id or name
await feeder.remote.pull(0, console.log)
// => { 0: ['howdy', 'ho'] }

```
If a name is not given, **seed 🌱 the location** for the swarm by a **random tree name** for others to join, courtesy of [per](https://github.com/perguth/random-tree-names).
```js
await feeder.seed()
// => 'flowering-almira-norway-maple'
// => 'b2b26976c9ae329e2b8ce072d28hhell05d9e20a7f24a6af917f0ed3ad3f8b5a5'
// => 0 peers connected, :(
```

### TODO
- [ ] minimal impl
- [ ] naming for feeds

### License
MIT
