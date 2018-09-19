
//const createAzureFunctionHandler = require("azure-function-express").createAzureFunctionHandler;
const express = require("express");

const appInsights = require("applicationinsights");
appInsights.setup("99956a9b-a5c8-41f0-a252-087872ffaf03");
appInsights.start();
let client = appInsights.defaultClient;

// DATABASE SETUP
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');


var Transaction = require('./app/models/Transaction');
var Contract = require('./app/models/Contract');
var Favourite = require('./app/models/Favourite');
var Token = require('./app/models/Token');

// Lookup for tokens
var tokens

if ("MONGODB" in process.env) {
	mongoose.connect(process.env["MONGODB"]);
} else {
	mongoose.connect('mongodb://localhost:27017/visualise_ethereum');
}

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	console.log("DB connection alive");
});



Token.find({}, function (err, t) {
	if (err) {
		console.log(err)
		db.close();
	} else {
		exposeTokens(t)
	}
});


// Create express app as usual
const app = express();


// CORS
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/api/inklin/transactions/:block', function (req, res) {

	client.trackNodeHttpRequest({ request: req, response: res });

	if ("MONGODB" in process.env) {
		mongoose.connect(process.env["MONGODB"]);
	} else {
		mongoose.connect('mongodb://localhost:27017/visualise_ethereum');
	}

	// Handle the connection event
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		console.log("DB connection alive");
	});

	console.log(`Requesting ${req.params.block}`);

	Transaction.find({ "block_number": req.params.block }, function (err, transactions) {
		if (err)
			res.send(err);

		results = getForceGraph(transactions);
		results.block_number = req.params.block

		res.json(results);
		db.close();

	});
});

app.get('/api/inklin/live/:lastblock', function (req, res) {

	client.trackNodeHttpRequest({ request: req, response: res });

	if ("MONGODB" in process.env) {
		mongoose.connect(process.env["MONGODB"], { useNewUrlParser: true });
	} else {
		mongoose.connect('mongodb://localhost:27017/visualise_ethereum', { useNewUrlParser: true });
	}

	// Handle the connection event
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		console.log("DB connection alive");
	});

	console.log(`Requesting ${req.params.lastblock}`);
	if (req.params.lastblock > 0) {
		Transaction.find({ "block_number": { "$gt": req.params.lastblock } }, function (err, transactions) {
			results = getForceGraph(transactions);


			if (results.nodes.length > 0) {
				results.block_time = transactions[transactions.length - 1].block_time
				results.block_number = transactions[transactions.length - 1].block_number
			} else {
				results.block_number = req.params.lastblock
			}

			res.json(results);
			db.close();

		});
	} else {
		Transaction.find({}, function (err, transactions) {
			if (err)
				console.log(err);

			Transaction.find({ "block_number": transactions[0]["block_number"] }, function (err, tx) {
				results = getForceGraph(tx)

				results.block_number = tx[0].block_number
				results.block_time = tx[0].block_time
				client.trackMetric({ name: "Transactions", value: tx.length });

				res.json(results);
				db.close();

			});

		}).limit(1).sort({ "block_number": -1 });

	}


});

//db.transactions.find({ "block_time" : { "$gte" : new Date("2017-12-04T00:00:00Z"), "$lte": new Date("2017-12-04T23:59:00Z")}}).count()
app.get('/api/inklin/transactions/:from/:to', function (req, res) {


	if ("MONGODB" in process.env) {
		mongoose.connect(process.env["MONGODB"]);
	} else {
		mongoose.connect('mongodb://localhost:27017/visualise_ethereum');
	}

	// Handle the connection event
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		console.log("DB connection alive");
	});

	from = new Date(req.params.from)
	to = new Date(req.params.to)


	Transaction.paginate({ "type": "token", "block_time": { "$gte": from, "$lte": to } }, { from: 1, to: 1, block_time: 1, data: 1, limit: 1000 }, function (err, results) {
		if (err)
			res.send(err);



		for (t in results.docs) {
			results.docs[t]["to"] = "0x" + results.docs[t]["data"].slice(34, 74);
			// 	//transactions[t]["value"] = parseInt(transactions[t]["data"].slice(121),16)
			// 	//console.log(transactions[t]["value"]/1000000)
		}

		res.json(results);

	});
});

function exposeTokens(t) {
	  tokens = t
	  db.close();

}

function getToken(address) {
	const token = tokens.find(x => x.address === address)
	return (token ? token["name"] : "")
}

function getTokenSymbol(address) {
	const token = tokens.find(x => x.address === address)
	console.log(token);
	return (token ? token["symbol"] : "")
}

function getForceGraph(results) {
	const tmp_nodes = []
	const tokens = []
	const nodes = []
	const links = []
	const values = []
	const hashes = []
	const erc20_values = []
	
	const stats = { tokens: 0, contracts: 0, ethvalue: 0 }

	for (t in results) {
		const value = results[t]["value"];

		if (value != null) {
			values.push(parseInt(value))
		}
	}



	for (t in results) {

		const from = results[t]["from"];
		const value = results[t]["value"];

		const block_number = results[t]["block_number"];
		const block_time = results[t]["block_time"]
		//const value = data[y]["value"];
		let to = results[t]["to"];
		let hash = results[t]["hash"];

		let from_exists = false;
		let to_exists = false;
		let contract_exists = false;

		if (from != null && to != null) {
			if (results[t]["to"] == 0) {
				stats.contracts++
			}

			hashes.push(hash)
			
			if (results[t]["data"].startsWith("0xa9059")) {
				stats.tokens++
				if (!tokens.includes(to) && !tmp_nodes.includes(to)) {
					tokens.push(to)
				}

				if (!tmp_nodes.includes(from) && !tokens.includes(from)) {
					tmp_nodes.push(from)
				}

				links.push({ from: from, to: to, color: "#2aaee2", hash: hash })
				final_to = "0x" + results[t]["data"].slice(34, 74);

				erc20_values.push(parseInt(results[t]["data"].slice(75),16))

				if (!tmp_nodes.includes(final_to) && !tokens.includes(final_to)) {
					tmp_nodes.push(final_to)
				}

				links.push({ from: to, to: final_to, color: "yellow", hash: hash, value: parseInt(results[t]["data"].slice(75),16)/1000000000000000000, token: getTokenSymbol(to) })

			} else {
				stats.ethvalue = stats.ethvalue + results[t]["value"]

				if (!tmp_nodes.includes(to) && !tokens.includes(to)) {
					tmp_nodes.push(to)
				}

				// Only add the node if it doesn't exist
				if (!tmp_nodes.includes(from) && !tokens.includes(from)) {
					tmp_nodes.push(from)
				}

				links.push({ from: from, to: to, color: "#2aaee2", hash: hash, value: `Ξ${results[t]["value"]}` })
			}
		}

	}

	for (i in tmp_nodes) {
		//const color = getColor(Math.max(...values), Math.min(...values), values[i], false)
		//const color = getColor((parseInt(value) - Math.min(...values)) / (Math.max(...values) - Math.min(...values)))
		nodes.push({ id: tmp_nodes[i], color: "white", title: tmp_nodes[i] })
	}

	for (i in tokens) {
		nodes.push({ id: tokens[i], color: "#2aaee2", label: getToken(tokens[i]), font: '40px arial white' })
	}

	const edges = links
	results = { nodes, edges }
	results.stats = stats
	return results
}


function getForceGraphLive(results) {
	const tmp_nodes = []
	const tokens = []
	const nodes = []
	const links = []
	const res = []


	for (t in results) {
		const from = results[t]["from"];
		const block_number = results[t]["block_number"];
		//const value = data[y]["value"];
		let to = results[t]["to"];
		let from_exists = false;
		let to_exists = false;
		let contract_exists = false;
		const nodes = []
		const links = []
		const full_nodes = []

		if (from != null && to != null) {

			if (results[t]["data"].startsWith("0xa9059")) {
				nodes.push(to)

				nodes.push(from)

				links.push({ source: from, target: to, color: "#2aaee2" })
				final_to = "0x" + results[t]["data"].slice(34, 74);

				nodes.push(final_to)

				links.push({ source: to, target: final_to, color: "yellow" })

			} else {
				nodes.push(to)

				// Only add the node if it doesn't exist
				nodes.push(from)

				links.push({ source: from, target: to, color: "#2aaee2" })
			}
		}

		for (i in nodes) {
			full_nodes.push({ id: nodes[i], color: "white" })
		}

		res.push({ nodes: full_nodes, links: links })

	}


	// for (i in tokens) {
	// 	nodes.push({ id: tokens[i], color: "#2aaee2" })
	// }



	return { results: res }
}

app.get('/api/inklin/token/:address', function (req, res) {

	if ("MONGODB" in process.env) {
		mongoose.connect(process.env["MONGODB"]);
	} else {
		mongoose.connect('mongodb://localhost:27017/visualise_ethereum');
	}

	// Handle the connection event
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		console.log("DB connection alive");
	});



	Token.find({"address": req.params.address }, function (err, t) {
		if (err)
			console.log(err)
		else
			console.log(t)
			res.json(t);

	});

});

app.get('/api/inklin/txaddress/:address', function (req, res) {

	client.trackNodeHttpRequest({ request: req, response: res });

	if ("MONGODB" in process.env) {
		mongoose.connect(process.env["MONGODB"]);
	} else {
		mongoose.connect('mongodb://localhost:27017/visualise_ethereum');
	}

	// Handle the connection event
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		console.log("DB connection alive");
	});

	console.log(`Requesting ${req.params.lastblock}`);

	Transaction.paginate({ "$or": [{ "from": req.params.address.toLowerCase() }, { "to": req.params.address.toLowerCase() }] }, { from: 1, to: 1, block_time: 1, data: 1, limit: 2000 }, function (err, results) {
		console.log(results);
		if (err)
			console.log(err)
		//res.send(err);

		results.docs = getForceGraph(results.docs)
		res.json(results);

	});
});


app.get('/api/inklin/address_stats/:address', function (req, res) {

	client.trackNodeHttpRequest({ request: req, response: res });

	Transaction.count({})
	Transaction.paginate({ "$or": [{ "from": req.params.address.toLowerCase() }, { "to": req.params.address.toLowerCase() }] }, { from: 1, to: 1, block_time: 1, data: 1, limit: 2000 }, function (err, results) {
		if (err)
			console.log(err)
		//res.send(err);

		results.docs = getForceGraph(results.docs)
		res.json(results);

	});
});

app.get('/api/inklin/like/:block', function (req, res) {

	var fav = Favourite({ block_number: req.params.block, favourited_time: new Date().toISOString() })

	fav.save(function (err) {
		if (err) {
			console.log(err)
		} else {
			res.send({ result: "ok" })
		}
	});

});


app.get('/api/inklin/tokens/:block', function (req, res) {



	if ("MONGODB" in process.env) {
		mongoose.connect(process.env["MONGODB"]);
	} else {
		mongoose.connect('mongodb://localhost:27017/visualise_ethereum');
	}

	// Handle the connection event
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		console.log("DB connection alive");
	});

	Transaction.aggregate([
		{ $match: { "block_number": req.params.block } },
		{
			$group: {
				'_id': "$to",
				count: { $sum: 1 }

			}
		}
	], function (err, result) {
		if (err) {
			console.log(err);
			return;
		}

		res.json(result)
	});

})



app.get('/api/inklin/histogram/:address', function (req, res) {

	Transaction.aggregate([
		{ $match: { "$or": [{ 'to': req.params.address.toLowerCase() }, { 'from': req.params.address.toLowerCase() }] } },
		{
			$group: {
				'_id': {
					'year': { '$year': "$block_time" },
					'month': { '$month': "$block_time" },
					'day': { '$dayOfMonth': "$block_time" }
				},
				count: { $sum: 1 }

			}
		}
	], function (err, result) {
		if (err) {
			console.log(err);
			return;
		}

		res.json(result)
	});

})

app.get('/api/inklin/contracts/:block/:contract', function (req, res) {
	Transaction.find({ "type": "token", "block_number": { "$gt": req.params.block }, "to": req.params.contract.toLowerCase() }, function (err, transactions) {
		if (err)
			console.log(err)
		//res.send(err);

		Transaction.find({ "type": "token", "block_number": transactions[0]["block_number"], "to": req.params.contract.toLowerCase() }, function (err, tx) {
			for (t in tx) {
				tx[t]["to"] = "0x" + tx[t]["data"].slice(34, 74);
			}
			res.json(tx);
		});
	}).limit(1).sort({ "block_number": 1 });
});

app.get('/api/inklin/search/:term', function (req, res) {

	Contract.find({ $or: [{ name: { '$regex': req.params.term, '$options': 'i' } }, { address: { '$regex': req.params.term, '$options': 'i' } }, { symbol: { '$regex': req.params.term, '$options': 'i' } }] }, function (err, results) {
		if (err)
			console.log(err);
		//	res.send(err);

		res.json(results);
	});
});

app.get('/api/inklin/history/:currentblock', function (req, res) {

	client.trackNodeHttpRequest({ request: req, response: res });

	if ("MONGODB" in process.env) {
		mongoose.connect(process.env["MONGODB"]);
	} else {
		mongoose.connect('mongodb://localhost:27017/visualise_ethereum');
	}

	// Handle the connection event
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function () {
		console.log("DB connection alive");
	});


	console.log(`Requesting history before ${req.params.currentblock}`);

	Transaction.aggregate([
		{ $match: { "block_number": { "$lt": parseInt(req.params.currentblock), "$gt": parseInt(req.params.currentblock) - 50 } } },
		{ $group: { _id: { block_number: '$block_number' }, no: { $sum: 1 } } }
	], function (err, just_blocks) {
		res.json(just_blocks);
		//	db.close();
	})


});




app.get('/api/inklin/stats', function (req, res) {

	from = new Date(req.params.from)
	to = new Date(req.params.to)


	Transaction.paginate({ "type": "token", "block_time": { "$gte": from, "$lte": to } }, { from: 1, to: 1, block_time: 1, data: 1, limit: 1000 }, function (err, results) {
		if (err)
			res.send(err);



		for (t in results.docs) {
			results.docs[t]["to"] = "0x" + results.docs[t]["data"].slice(34, 74);
			// 	//transactions[t]["value"] = parseInt(transactions[t]["data"].slice(121),16)
			// 	//console.log(transactions[t]["value"]/1000000)
		}

		res.json(results);

	});
});



const PORT = process.env.PORT || 7071;

app.listen(PORT, () => console.log(`API listening on port ${PORT}!`))