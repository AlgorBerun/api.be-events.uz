const jwt = require('jsonwebtoken');

let tokenMaker = (payload) => {
	var token = jwt.sign(payload, process.env.ADMIN_TOKEN_SECRET, {expiresIn: Number(process.env.ADMIN_TOKEN_TIME)});
	var refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: Number(process.env.REFRESH_TOKEN_TIME)*60*60*24});
	return {
		accessToken: token,
		refreshToken: refreshToken
	}
}

module.exports = tokenMaker;