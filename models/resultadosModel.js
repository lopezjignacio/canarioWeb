var pool = require('./bd');

async function getResultados(){
	var query = "select * from resultados order by id desc";
	var rows = await pool.query(query);
	return rows;
}

async function insertResultado(obj){
	try{
		var query = "insert into resultados set ? ";
		var rows = await pool.query(query, [obj]);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

async function deleteResultadoById(id){
	var query = "delete from resultados where id = ? ";
	var rows = await pool.query(query, [id]);
	return rows;
}

async function getResultadoById(id){
	var query = "select * from resultados where id = ? ";
	var rows = await pool.query(query, [id]);
	return rows[0];
}

async function modificarResultadoById(obj, id){
	try{
		var query = "update resultados set ? where id=?";
		var rows = await pool.query(query, [obj, id]);
		return rows;
	} catch (error) {
		throw error;
	}
}

module.exports = {getResultados, insertResultado, deleteResultadoById, getResultadoById, modificarResultadoById}