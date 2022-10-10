var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



// 判断环境
if (process.env.NODE_ENV==='production') {
  require('dotenv').config({ path: '.env.production' })
}else{
  require('dotenv').config({ path: '.env.development' })
}

// 链接mongoose (注意要放到环境代码下面)
require('./lib/mongoose');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { Console } = require('console');

var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//使用中间件实现允许跨域
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Content-Type,authorization");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.send('服务器内部错误');
});
// for debug
console.log('==================================================')
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('PORT', process.env.PORT)
console.log('HOST', process.env.HOST)
console.log('==================================================')

module.exports = app;
