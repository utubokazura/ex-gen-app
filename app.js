 //ローカル環境用コード
 /*
var helloRouter = require('./routes/hello');

var boardsRouter = require('./routes/boards');


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const session = require('express-session');

var app = express(); 

var session_opt = {
  secret: 'keybord cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
};
app.use(session(session_opt));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/boards', boardsRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hello', helloRouter);

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
 */

//Redisをセッションストアとして使用したコード

var helloRouter = require('./routes/hello');
var boardsRouter = require('./routes/boards');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');  

var app = express();

// Redisの接続情報を設定します。必要に応じて変更してください。
/*
var client = redis.createClient({
  host: "localhost",
  port: 6379,
  // Redisにパスワードが設定されている場合は追加 
  //password: 'YourStrongPasswordHere'
}); 
*/

//const client = redis.createClient({url: process.env.REDIS_URL});
//const client = redis.createClient({ url: 'redis://:paf716cf1f4efe654f6af61c7dd8e37d21ed8e292b2a4863230a993dbb77800d4@ec2-35-174-32-196.compute-1.amazonaws.com:12409' });
const client = redis.createClient({ url: 'redis://:paf716cf1f4efe654f6af61c7dd8e37d21ed8e292b2a4863230a993dbb77800d4@ec2-44-214-176-229.compute-1.amazonaws.com:7869' });


// エラーが発生した場合の処理を追加します
client.on("error", function (err) {
  console.log("Redis error: " + err);
});

// セッションオプションを設定します。RedisStoreを使用します。
var session_opt = {
  store: new RedisStore({ client: client }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
};

// セッションを有効にします。
app.use(session(session_opt)); // 修正：session_optを使用する

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/boards', boardsRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hello', helloRouter);

// 404エラー時の処理
app.use(function(req, res, next) {
  next(createError(404));
});

// エラーハンドリング
app.use(function(err, req, res, next) {
  // 開発環境のみエラーを表示
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // エラーページを表示
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

