 //前コード→ 
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
/*
// Redisの接続情報を設定します。必要に応じて変更してください。
var redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
  // Redisにパスワードが設定されている場合は追加
  //password: 'YourStrongPasswordHere'
});*/

var redisClient = redis.createClient(process.env.REDIS_URL);

// エラーが発生した場合の処理を追加します
redisClient.on("error", function (err) {
  console.log("Redis error: " + err);
});

// セッションオプションを設定します。RedisStoreを使用します。
var session_opt = {
  store: new RedisStore({ client: redisClient }),
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



//MongoDBをセッションストアとして使用したコード
/* 
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const helloRouter = require('./routes/hello');
const boardsRouter = require('./routes/boards');

const app = express();

// MongoDBへの接続
mongoose.connect('mongodb://localhost/sessionStore');
const db = mongoose.connection;

// MongoDB接続エラーのハンドリング
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// MongoDBをセッションストアとして使用するための設定
const sessionStore = MongoStore.create({
  mongoUrl: 'mongodb://localhost/sessionStore',
  collectionName: 'sessions',
  ttl: 60 * 60 * 24 // セッションの有効期限を1日に設定（秒単位）
});

// セッションの設定
const sessionOpt = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }, // ブラウザのセッションクッキーの有効期限を1時間に設定
  store: sessionStore // MongoDBをセッションストアとして使用
};
app.use(session(sessionOpt));

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

module.exports = app;*/
