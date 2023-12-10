var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3');

//データベースオブジェクトの取得
const db = new sqlite3.Database('mydb.db');

/* GET home page. */
router.get('/',(req, res, next) => {
    //データベースのシリアライズ
    db.serialize(() => {
        var rows = "";
        db.each("select * from mydata",(err, row) => {
            //データベースアクセス完了時の処理
            if (!err) {
                    rows += "<tr><th>" + row.id + "</th><td>"
                    + row.name + "</td></tr>";
                }
            }, (err, count) => {
                if (!err){
                    var data = {
                        title: 'hello',
                        content: rows
                    };
                    res.render('hello/index', data);
                }
           
        });
    });
});
//findの処理
router.get('/find',(req, res, next) => {
    db.serialize(() => {
        db.all("select * from mydata",(err, rows) => {
            if (!err) {
                var data = {
                    title: 'Hello/find',
                    find: '',
                    content: '検索条件を入力してください',
                    mydata: rows
                };
                res.render('hello/find', data);
            }
        });
    });
});

router.post('/find', (req, res, next) => {
    var find = req.body.find;
    db.serialize(() => {
        var q = "select * from mydata where ";
        db.all(q + find, [], (err, rows) => {
            if (!err) {
                var data = {
                    title: 'Hello/find',
                    find:find,
                    content: '検索条件 ' + find,
                    mydata: rows
                }
                res.render('hello/find', data);
            }
        });
    });
});

//Showの処理を作成
router.get('/show', (req, res, next) => {
    const id = req.query.id;
    db.serialize(() => {
        const q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'Hello/show',
                    content: 'id = ' + id + 'のレコード',
                    mydata: row
                }
                res.render('hello/show', data);
            }
        });
    });
});

//editの処理
router.get('/edit', (req, res, next) => {
    const id = req.query.id;
    db.serialize(() => {
        const q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'hello/edit',
                    content: 'id = ' + id + 'のレコードを編集:',
                    mydata: row
                }
                res.render('hello/edit', data);
            }
        });
    });
});

router.post('/edit', (req, res, next) => {
    const id = req.body.id;
    const nm = req.body.name;
    const ml = req.body.mail;
    const ag = req.body.age;
    const q = "update mydata set name = ?, mail = ?, age = ? where id = ?";
    db.serialize(() => {
        db.run(q, nm, ml, ag, id);
    });
    res.redirect('/hello');
});


module.exports = router;

router.get('/add', (req, res, next) => {
    var data = {
        title: 'Hello/Add',
        content: '新しいレコードを入力：'
    }
    res.render('hello/add', data);
});

router.post('/add', (req, res, next) => {
    const nm = req.body.name;
    const ml = req.body.mail;
    const ag = req.body.age;
    db.serialize(() => {
        db.run('insert into mydata (name, mail, age) values (?, ?, ?)',
            nm, ml, ag);
    });
    res.redirect('/hello');
});
