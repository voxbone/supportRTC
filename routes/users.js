var express = require('express');
var router = express.Router();
var WebRtcController = require('./webRtcController');
var webRtcController = new WebRtcController();
// var parseController = require('../controller/parseController');
var url = require('url');

/* GET Home page. */
router.get('/', function(req, res) {
        var userSearch = document.getElementById('search-user').value;
        console.log(userSearch);
        res.render('index', { title: 'Voxbone Click2Call' });
});

/* GET Userlist page. */
router.get('/:username', function(req, res) {
    var db = req.db;
    var urlParts = url.parse(req.url, true, true);
    var pathname = urlParts.pathname;
    var flastname = pathname.slice(1);

    voxrtc_config = webRtcController.createKey();
    var collection = db.get('usercollection');
    collection.findOne({username: flastname}, function(err, docs){
        res.render('profile', { user: docs });
        console.log(docs);
        console.log(voxrtc_config);
    });
    console.log(flastname);

});

module.exports = router;
