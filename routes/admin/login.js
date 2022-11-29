var express = require('express');
var router = express.Router();

//llamo a usuariosModel.js
var usuariosModel = require('./../../models/usuariosModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/login', {
    layout: 'admin/layout'
  });
});

//Variable de SESSION
router.get('/logout', function(req, res, next){
  req.session.destroy();//DESTRUYO LA SESION
  res.render('admin/login', { //TE MANDO AL LOGIN
    layout: 'admin/layout'
  });
});



//llamo al POST
router.post('/', async(req, res, next) =>{
  try{
    var usuario = req.body.usuario; //capturo la info: Juan
    var password = req.body.password; // 123456

    var data = await usuariosModel.getUserByUsernameAndPassword(usuario,password);

    if (data != undefined){

      req.session.id_usuario = data.id;
      req.session.nombre = data.usuario;

      res.redirect('/admin/resultados');
    }else{
      res.render('admin/login',{
        layout:'admin/layout',
        error:true
      });
    }
  }catch(error){
    console.log(error);
  }
})

module.exports = router;
