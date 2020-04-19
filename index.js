const hyperswarm = require('hyperswarm')
const multifeed = require('multifeed')
const pump = require('pump')
const treeNames = require('random-tree-names')

const inherits = require('inherits')
const {
	EventEmitter
} = require('events')

const ram = require('random-access-memory')
const hypercore = require('hypercore')

// look for peers listed under this topic
const topic = crypto.createHash('sha256')
  .update('my-hyperswarm-topic')
  .digest()

const Buffer = require('buffer').Buffer

var defaultEncryptionKey = Buffer.from('bee80ff3a4ee5e727dc44197cb9d25bf8f19d50b0f3ad2984cfe5b7d14e75de7', 'hex')

// Orchestrates and replicates hypercore feeds
class SwarmFeeder extends EventEmitter {

	constructor(storage, opts = {}) {
		super()

		this.storage = storage || ram
		// this.storage = ram

		this.multifeed = multifeed(hypercore, this.storage, Object.assign(opts, { /*encryptionKey: this.address,*/
			key: defaultEncryptionKey,
			valueEncoding: 'json'
		}))

		this._isReady = false
		this.hyperswarm = hyperswarm({
			// wsProxy: 'ws://138.197.140.58:4977'
		})

		this.hyperswarm.on('connection', this._onconnection.bind(this))
		this.hyperswarm.on('disconnection', this._ondisconnection.bind(this))
	}

	ready(callback) {
		return new Promise((resolve, reject) => {
			// return maybe(callback, new Promise((resolve, reject) => {
			// if (!this.multifeed) this._initFeeds()

			this.multifeed.ready((err) => {
				if (err) return reject(err)

				this.discoveryKey = this.multifeed._opts.key
				console.log(`Discovery Key: ${this.discoveryKey.toString('hex')}`)

				// this.db.connections = setupLevel(path.join(this.path, 'db', 'network'))
				this._isReady = true
				return resolve()
			})
		})
	}



	swarm(announce = true) {
		console.log(`SWARMING with ANOUNCE: ${announce}`)
		this.hyperswarm.join(this.discoveryKey, {
			lookup: true,
			announce: announce
		})
		return true
	}

	watch(callback) {

	}

	seed(announce = true) {
		console.log(treeNames.random('en'))
	}

	_onconnection(socket, details) {

		pump(socket, this.multifeed.replicate(details.client), socket)

		if (details.peer) {
			const {host} = details.peer
			// console.log(peer)

			// console.log(`connected ${host} @ ${Date.now()}`)
		}
	}

	_ondisconnection(socket, details) {
		if (details.peer) {
			const {host} = details.peer
		}
	}
}


module.exports = (storage, opts) => new SwarmFeeder(storage, opts)
module.exports.SwarmFeeder = SwarmFeeder