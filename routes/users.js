const express = require('express');
const router = express.Router();
const ps = require('@prisma/client');
const { route } = require('./users');
const prisma = new ps.PrismaClient();
const appRoot = require('app-root-path');
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

  
   
 

module.exports = router;
