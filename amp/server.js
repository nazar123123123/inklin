// load the things we need
var express = require('express');
var app = express();
var request = require("request")


// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    var block_number = 5752271;
    const url = "http://api.inkl.in/api/inklin/live/0"

    request({
        url: url,
        json: true
    }, function (error, response, body) {
    
        if (!error && response.statusCode === 200) {
            console.log(body.links.length) // Print the json response
            res.render('pages/index', {
                block_number: body.block_number,
                previous_block_number: parseInt(body.block_number) - 1,
                next_block_number: parseInt(body.block_number) + 1,
                transactions: body.links.length
            });
        
        }
    })

    
    // res.render('pages/index', {
    //     block_number: block_number,
    //     previous_block_number: parseInt(block_number) - 1,
    //     next_block_number: parseInt(block_number) + 1
    // });

});


app.get('/block/:block_number', function(req, res) {
    console.log(req.params.block_number)
    const url = "http://api.inkl.in/api/inklin/transactions/" + req.params.block_number

    request({
        url: url,
        json: true
    }, function (error, response, body) {
    
        if (!error && response.statusCode === 200) {
            console.log(body.links.length) // Print the json response
            res.render('pages/index', {
                block_number: body.block_number,
                previous_block_number: parseInt(body.block_number) - 1,
                next_block_number: parseInt(body.block_number) + 1,
                transactions: body.links.length
            });
        
        }
    })


});

app.listen(3001);
console.log('3001 is the magic port');