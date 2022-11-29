var express = require('express');
var router = express.Router();
var resultadosModel = require ('./../../models/resultadosModel');
//DEPENDENCIAS DE IMÁGENES
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);


//LISTAMOS LOS RESULTADOS Y MOSTRAMOS IMÁGENES (SI LAS HAY)
router.get('/', async function(req,res,next){
  var resultados = await resultadosModel.getResultados();

  resultados = resultados.map(resultado =>{
    if (resultado.img_id){
      const imagen = cloudinary.image(resultado.img_id,{
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return{
        ...resultado,
        imagen
      }
    } else {
      return{
        ...resultado,
        imagen:''
      }
    }
  });
/* GET home page. */
  res.render('admin/resultados', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    resultados
  });
});

//DISEÑO DE ALTA DE RESULTADOS
router.get('/agregar', (req,res,next) => {
  res.render('admin/agregar',{
    layout: 'admin/layout'
  });
});

//AGREGAR RESULTADOS
router.post('/agregar', async (req, res, next)=> {
  try{
    var img_id ='';
    if(req.files && Object.keys(req.files).length > 0){
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if(req.body.deporte != "" && req.body.categoria != "" && req.body.fecha != "" && req.body.cancha != "" && req.body.local != "" && req.body.puntosl != "" && req.body.visitante != "" && req.body.puntosv != ""){
      await resultadosModel.insertResultado({
        ...req.body,
        img_id
      });
      res.redirect('/admin/resultados')
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true, message: 'Todos los campos son requeridos'
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true, message: 'No se cargó el nuevo resultado'
    });
  }
});

//DELETE RESULTADOS
router.get('/eliminar/:id', async (req, res, next)=>{
  var id = req.params.id;

  let resultado = await resultadosModel.getResultadoById(id);
  if (resultado.img_id){
    await (destroy(resultado.img_id));
  }

  await resultadosModel.deleteResultadoById(id);
  res.redirect('/admin/resultados')
  });

//MODIFICAR LA VISTA => FORMULARIO CON DATOS CARGADOS
router.get('/modificar/:id', async (req, res, next) =>{
  var id = req.params.id;
  var resultado = await resultadosModel.getResultadoById(id);
  res. render ('admin/modificar', {
    layout: 'admin/layout',
    resultado
  });
});

//ACTUALIZAR RESULTADOS
router.post('/modificar', async (req, res, next) => {
  try{
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete === "1"){
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length >0){
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }
    if (borrar_img_vieja && req.body.img_original){
      await (destroy(req.body.img_original));
    }

    var obj = {
      deporte: req.body.deporte,
      categoria: req.body.categoria,
      fecha: req.body.fecha,
      cancha: req.body.cancha,
      local: req.body.local,
      puntosl: req.body.puntosl,
      visitante: req.body.visitante,
      puntosv: req.body.puntosv,
      img_id
    }
    console.log(obj)
    console.log(req.body.id)

    await resultadosModel.modificarResultadoById(obj, req.body.id);
    res.redirect('/admin/resultados');
  }
  catch (error){
    console.log(error)
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true, message: 'No se modificó el resultado'
    })
  }
})

module.exports = router;