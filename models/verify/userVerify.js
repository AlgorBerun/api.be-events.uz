const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
	
	// console.log(process.env.TOKEN_SECRET);
	// console.log(process.env.REFRESH_TOKEN_SECRET);
	const token = req.header('user-token');
	if(!token) return res.json({message: "Ro'yxatdan o'tmagansiz", error: 1});

	try {
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = verified;
		next();
	} catch(e) {
		console.log("\x1b[37m%s\x1b[41m","verifyToken:", e.message);
		return res.json({message: "Kechirasiz ro'yxatdan qaytadan o'ting", error: 1});
	}
}