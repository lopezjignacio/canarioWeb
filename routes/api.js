var express = require('express');
var router = express.Router();
var resultadosModel = require('./../models/resultadosModel');
var cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');

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

//FINALIZA GET NOVEDADES
//INICIA POST MAIL

router.post('/contacto', async(req, res) => {
	const mail = {
		to: 'lopez.jignacio@gmail.com',
		subject: 'Contacto Canario',
		html: `${req.body.nombre} se contactó a través de la web, con la dirección de correo: ${req.body.email} <br> Además, envió el siguiente mensaje a los Canarios: ${req.body.mensaje} <br> Su tel es:${req.body.telefono} <br>¡¡¡VAMOS CANARIO!!!`
	}

	const transport = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		}
	}); //cierra transport

	await transport.sendMail(mail)

	res.status(201).json({
		error: false,
		message: 'Mensaje enviado'
	});
});



module.exports = router;