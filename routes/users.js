const express = require('express');
const router = express.Router();
const ps = require('@prisma/client');
//const { route } = require('./users');
const prisma = new ps.PrismaClient();
module.exports = router;



router.get('/login', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    content:'名前とパスワードを入力してください。' 
  }
  res.render('users/login', data);
});

router.post('/login', (req, res, next) => { 
  prisma.User.findMany({
    where:{
      name:req.body.name,
      pass:req.body.pass,
      
    }
  }).then(usr=>{
    if (usr != null && usr[0] != null) {
      req.session.login = usr[0];
      let back = req.session.back;
      if (back == null){
        back = '/boards';
      }
      res.redirect(back);
    } else {
      var data = {
        title: 'Users/Login',
        content: '名前かパスワードに問題があります。再度入力してください。'
      }
      res.render('users/login', data);
    }
  })
});

router.get('/add',(req, res, next)=> {
  const data = {
    title:'Users/Add'
  }
  res.render('users/add', data);
});
/*
router.post('/add',(req, res, next)=> { 
  prisma.User.create({
    data:{
        name: req.body.name,
        pass: req.body.pass,
        mail: req.body.mail,
        //age: +0
    }
  })
  .then(()=> {
    res.redirect('/users/login');
  });
});
*/

router.post('/add', (req, res, next) => {
  prisma.User.create({
    data: {
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      //age: +0
    }
  })
  .then(() => {
    res.redirect('/users/login');
  })
  .catch((error) => {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error" + error.message);
  });
});


router.get('/', (req, res, next)=> {
  const id = +req.query.id;
  if (!id) {
  prisma.user.findMany().then(users=> {
    const data = {
        title: 'Users/Index',
        content:users 
    }
    res.render('users/index', data);
  });
} else {
  prisma.user.findMany({
    where: {id: {lte: id} } 
    }).then(usr => {
      var data = {
        title: 'User/Index',
        content: usr
      }
      res.render('users/index', data);
    });
      
    }
  });

  //calender.ejsの処理
  router.get('/calender',(req, res, next)=> {
        var data = {
          mail:'221y051@epson-isc.com',
        }
        res.render('users/calender', data);
      });

   //delete.ejsの処理
   router.get('/delete/:id',(req, res, next)=> {
    const id = req.params.id;
    prisma.user.findUnique(
      { where:{ id:+id }}
    ).then(usr=>{
      const data =  {
        title:'アカウント削除画面',
        user:usr
      };
      res.render('users/delete', data);
    });
  });

router.post('/delete',(req, res, next)=> {
  prisma.User.delete({
    where:{id:+req.body.id}
  }).then(()=> {
    res.redirect('/users/login');
  });
});
      

module.exports = router;
