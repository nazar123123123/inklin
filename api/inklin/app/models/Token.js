var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TokenSchema   = new Schema({

	symbol: String,
	address: String,
	name: String
	
});

module.exports = mongoose.model('Token', TokenSchema);