var express = require('express');
var router = express.Router();
var resultadosModel = require('./../models/resultadosModel');
var cloudinary = require('cloudinary').v2;

router.get('/resultados', async function (req, res, next){
	let resultados = await resultadosModel.getResultados();

	resultados = resultados.map(resultados => {
		if (resultados.img_id){
			const imagen = cloudinary.url(resultados.img_id, {
				width: 960,
				height: 200,
				crop: 'fill'
			});
			return {
				...resultados,
				imagen
			}
		} else {
			return {
				...resultados,
				imagen:''
			}
		}
	});
	
	res.json(resultados);
});

module.exports = router;