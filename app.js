var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require("body-parser");
var fileUpload = require('express-fileupload');

var dotenv = require('dotenv');
dotenv.config();

var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



var userRouter = require('./routes/user');
var contentRouter = require('./routes/content');
var adminRouter = require('./routes/admin');
var viewRouter = require('./routes/view');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(cors());

app.use('/site', viewRouter); // CLient uchun ko'rinish
app.use('/content', contentRouter); // admin uchun ko'rinish
app.use('/user', userRouter); // user uchun ko'rinish va api
app.use('/admin', adminRouter); // admin uchun api
app.get('/signup', (req, res) => {
	res.render('user/signup', { title: 'Signup' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
