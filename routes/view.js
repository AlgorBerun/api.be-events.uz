var router = require('express').Router();
var Users = require('../models/schemas/Users');
var tokenMaker = require("../models/verify/tokenMaker");
var Content = require('../models/schemas/Content');
var fs = require('fs');

router.get('/', (req, res) =>  {
  Content.find({}, (err, contents) => {
    if(err) return res.render('user/content', { message: err.message, error: 1});
    res.render('user/content', { error: 0, contents: contents});

  });
});
router.get('/index', (req, res) =>  {
	Content.find({}, (err, contents) => {
		if(err) return res.render('user/content', { message: err.message, error: 1});
		res.render('user/content', { error: 0, contents: contents});

	});
});
router.get('/video/:src', (req, res) => {
	Content.findOne({_id: req.params.src}, (err, content) => {
		if(err) return res.render('user/video', {error: 1});
		res.render('user/video', { content: content });
	})
});
router.get('/v/:id', async (req, res) => {
	// console.log(req.headers);
	let content = await Content.findOne({_id: req.params.id});
   const path = process.env.CONTENT_SRC + content.src;
   const stat = fs.statSync(path);
   const fileSize = stat.size;
   const range = req.headers.range;
   if (range) {

     const parts = range.replace(/bytes=/, "").split("-")
     const start = parseInt(parts[0], 10)
     const end = parts[1] 
     ? parseInt(parts[1], 10)
     : fileSize-1
     const chunksize = (end-start)+1
    // const file = fs.createReadStream(path, {start, end})
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
  	console.log("ikki");
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})
module.exports = router;