var router = require('express').Router();
var Users = require('../models/schemas/Users');
var tokenMaker = require("../models/verify/tokenMaker");


router.post('/register', async (req, res) =>  {
  try {
  	var userExist = await Users.findOne({phone_number: req.body.phone_number});
  	if(userExist) return res.json({message: "Bunday telefon raqamli mijoz mavjud", error: 1});


  	var date = new Date();
  	var user = new Users({
  		full_name: req.body.full_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      accessToken: "",
      refreshToken: "",
      group: "",
      created_at: date.getTime(),
      status: "",
      ip: "",
      access_content: []
    });
  	var saveUser = await user.save();
  	var token  = tokenMaker({
  		full_name: req.body.full_name,
  		email: req.body.email,
  		phone_number: req.body.phone_number,
  		_id: saveUser._id
  	});
  	var savedUser = await Users.findOne({_id: saveUser._id});
  	
  	savedUser.accessToken = token.accessToken;
  	savedUser.refreshToken = token.refreshToken;
  	var saveUser = await savedUser.save();
  	console.log(saveUser._id);
  	console.log(token);

  	return res.json(saveUser);
  } catch(e) {
  	console.log(e);
  	return res.json({message: "Bazada xatolik ro'y berganga o'xshaydi", error: 1});
  }
});
router.put('/edit_profil', async (req, res) => {

});

module.exports = router;
