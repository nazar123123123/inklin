var mongoose     = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema       = mongoose.Schema;

var FavouriteSchema   = new Schema({
	block_number: Number,
	favourited_time: Date,
});



module.exports = mongoose.model('Favourite', FavouriteSchema);