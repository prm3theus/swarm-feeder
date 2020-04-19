const SwarmFeeder = require('./index')
const randomAccessIDB = require('random-access-idb')
const id = process.argv[2] || 0

const storage = (typeof window === 'undefined') ? `./leaf-${id}` : function() {
	return randomAccessIDB('hypercore-spike')(`feed-${id}`)
}

console.log(`Connecting with key: ${id}`);
console.log('Starting up');

(async () => {

	// instantiate feed with unique key
	console.log('Starting up')
	const leaf = SwarmFeeder(storage)

	await leaf.ready()
	console.log('Ready...')

	leaf.multifeed.on('feed', function(feed, name) {
		console.log("NEW FEED in MULTI!")
		feed.createReadStream({
			live: true
		}).on('data', (data) => {
			console.log('data to multi');
			console.log(data)
			console.log(data.toString());
		})
	})

	process.stdin.on('data', async (data) => {
		const msg = data.toString();
		const contents = msg.split('|')
		console.log(contents)
		if (contents.length == 2 & contents[0] == 'msg') {
			const msgContents = contents[1]
			console.log('msg')
			console.log(msgContents)
			leaf.multifeed.writer('local', (err, feed) => {
				if (err) console.log(err)
				console.log('writing to feed')
				console.log(feed)
				console.log(id + msgContents)
				console.log(feed.length)

				feed.append({
					msg: id + msgContents
				})

			})

		} else if (msg == 'swarm\n') {
			console.log('replicating...')
			await leaf.swarm()
			var feeds = leaf.multifeed.feeds()
			console.log(feeds)
		} else if (msg == 'get\n') {
			// get list of feeds
			const feeds = leaf.multifeed.feeds()
			console.log(feeds.length)

			if (feeds.length > 0) {
				const feed1 = feeds[0]

				feeds.forEach((feed) => {
					console.log('creating read stream')
					console.log(feed)
					console.log('IS_READABLE')
					console.log(feed.readable)
					console.log(feed.length)

					feed.get(0, (err, content) => {
						if(err) console.log(err)
						else console.log(content)
					})
				})

			}
		}
	})
})()