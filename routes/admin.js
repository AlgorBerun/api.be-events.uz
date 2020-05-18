var router = require('express').Router();
var tokenMaker = require('../models/verify/adminTokenMaker');
var Admin = require('../models/schemas/Admin');
var Content = require("../models/schemas/Content");
var Users = require("../models/schemas/Users");
var Groups = require("../models/schemas/Groups");
var adminVerify = require('../models/verify/adminVerify');
var adminTokenMaker = require('../models/verify/adminTokenMaker')
var fs = require('fs');
router.post('/register', async (req, res) => {
	try {
		var userExist = await Admin.findOne({phone_number: req.body.phone_number});
		if(userExist) return res.json({message: "Bunday telefon raqamli mijoz mavjud", error: 1});

		if(process.env.PAROL_ADMIN != req.body.password) throw {message: "admin parol notog'ri", error: 123};
		var date = new Date();
		var user = new Admin({
			full_name: req.body.full_name,
			phone_number: req.body.phone_number,
			accessToken: "",
			refreshToken: ""
		});
		var saveUser = await user.save();
		var token  = adminTokenMaker({
			full_name: req.body.full_name,
			_id: saveUser._id.toString()
		});
		var savedUser = await Admin.findOne({_id: saveUser._id});

		savedUser.accessToken = token.accessToken;
		savedUser.refreshToken = token.refreshToken;
		var saveUser = await savedUser.save();
		console.log(saveUser._id);
		console.log(token);

		return res.json(saveUser);
	} catch(e) {
		console.log(e);
		if(e.error == 123) 
			return res.json({message: e.message, error: 123});
		return res.json({message: "Bazada xatolik ro'y berganga o'xshaydi", error: 1});
	}
});
router.post("/register_user", adminVerify, async (req, res) => {
	try {
		var userExist = await Users.findOne({phone_number: req.body.phone_number});
		if(userExist) return res.json({message: "Bunday telefon raqamli mijoz mavjud", error: 1});

		
		var date = new Date();
		var user = new Admin({
			full_name: req.body.full_name,
			phone_number: req.body.phone_number,
			accessToken: "",
			refreshToken: ""
		});
		var saveUser = await user.save();
		var token  = tokenMaker({
			full_name: req.body.full_name,
			_id: saveUser._id
		});
		var savedUser = await Admin.findOne({_id: saveUser._id});

		savedUser.accessToken = token.accessToken;
		savedUser.refreshToken = token.refreshToken;
		var saveUser = await savedUser.save();
		console.log(saveUser._id);
		console.log(token);

		return res.json(saveUser);
	} catch(e) {
		console.log(e);
		if(e.error == 123) 
			return res.json({message: e.message, error: 123});
		return res.json({message: "Bazada xatolik ro'y berganga o'xshaydi", error: 1});
	}
});
router.get('/content', async (req, res) => {
	try {
		var contents = await Content.find();
		return res.json(contents);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});
router.get('/content/:id', async (req, res) => {
	try {
		var contents = await Content.findOne({_id: req.params.id});
		return res.json(contents);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});
router.post('/content', async (req, res) => {
	
	try {

		if (!req.files || Object.keys(req.files).length === 0) {
			return res.status(400).send('No files were uploaded.');
		}

		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
		let videoContent = req.files.video_content;
		let poster = req.files.video_img;

		// Use the mv() method to place the file somewhere on your server
		var d = new Date();
		var src = d.getTime()+"_"+req.files.video_content.name;
		var poster_src = d.getTime()+"_"+req.files.video_img.name;

		videoContent.mv(process.env.CONTENT_SRC+src, async function(err) {
			if (err) return res.status(500).send(err);
			poster.mv(process.env.CONTENT_SRC+poster_src, async function(err) {
				var date = new Date();
				var content = new Content({
					name: req.body.name,
					created_at: date.getTime(),
					src: src,
					poster_src: poster_src,
					section: req.body.section,
					text_content: req.body.text_content,
					click_count: 0
				});
				var saveContent = await content.save();
				Users.find({}, (err, docs) => {
					let content_id = saveContent._id;
					let content_name = saveContent.name;
					for(let i in docs){
						docs[i].access_content.push({access: false, content_id: content_id, content_name: content_name});
						docs[i].save((err, result) => {
							if(err) return console.log(err);
							console.log(result);
						});
					}
				})
				return res.json(saveContent);
			})
		});
	} catch(e) {
		console.log(e);
		return res.status(400).send({message: e.message, error: 3});
	}
});
router.post('/access_content', async (req, res) => {
	let user = await Users.findOne({_id: req.body.user_id});
	// res.json(user);
	console.log(req.body);
	let access = user.access_content[Number(req.body.access_content_index)];
	if(access.content_id == req.body.content_id) {
		console.log('true');
		user.access_content[req.body.access_content_index].access = (req.body.access == "false")? false : true;
		console.log(user);
		Users.updateOne({_id: req.body.user_id},{access_content: user.access_content}, function(err, docs) {
			if(err) console.log(err);
			console.log(docs);
			res.json(docs);
		})
	} else {
		console.log('false')
		return res.json({message: "content_idlar mos kelmadi!", error: 1});
	}
});
router.put('/content/:id', async (req, res) => {
	try {
		var content = await Content.updateOne({_id: req.params.id}, req.body);
		return res.json(content);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});
router.delete('/content/:id', async (req, res) => {
	try {
		var c= await Content.findOne({_id: req.params.id});
		fs.unlinkSync(process.env.CONTENT_SRC + c.src);
		fs.unlinkSync(process.env.CONTENT_SRC + c.poster_src);
		Users.find({}, (err, users) => {
			if(err) return console.log(err);
			let indexDeleting = -1;
			let content_id = req.params.id;
			if(users.length) {
				for(let i=0; i<users[0].access_content.length; i++) {
					if(users[0].access_content[i].content_id == content_id) {
						indexDeleting = i;
						break;
					}
				}
			}
			for(let i in users) {
				users[i].access_content.splice(indexDeleting, 1);
				users[i].save((err, docs) => {
					if(err) return console.log(err);
					console.log(docs);
				})
			}
		});
		var content = await Content.remove({_id: req.params.id});
		res.json(content);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});

router.get('/groups', async (req, res) => {
	try {
		var groups = await Groups.find({});
		return res.json(groups);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});
router.get('/group/:id', async (req, res) => {
	try {
		var group = await Groups.findOne({_id: req.params.id});
		return res.json(group);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});
router.post('/group', async (req, res) => {
	try {
		var group = new Groups({
			name: req.body.name,
			access_content: req.body.access_content
		});
		var saveGroup = await group.save();
		return res.json(saveGroup);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});
router.put('/group/:id', async (req, res) => {
	try {
		var group = await Groups.updateOne({_id: req.params.id}, req.body);
		return res.json(group);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});


router.get('/users', async (req, res) => {
	try {
		var users = await Users.find({});
		return res.json(users);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});
router.get('/user/:id', async (req, res) => {
	try {
		var users = await Users.findOne({_id: req.params.id});
		return res.json(users);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});
router.put('/user/:id', async (req, res) => {
	try {
		var user = await Users.updateOne({_id: req.params.id}, req.body);
		return res.json(user);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});
router.delete('/user/:id', async (req, res) => {
	try {
		var user = await Users.remove({_id: req.params.id});
		res.json(user);
	} catch(e) {
		console.log(e);
		return res.json({message: e.message, error: 1});
	}
});

module.exports = router;
