const config = require("./config");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const morgan = require("morgan");

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);
//Es necesaria para el ejercicio 3 y el de cokies ya que parsea el texto de las cokies para que se pueda tratar desde el request y response
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// Middlewares
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: false}));

// Arrancar el servidor
app.listen(config.port, function(err) {
	if (err)
		console.log("ERROR al iniciar el servidor");
	else console.log(`Servidor arrancado en el puerto ${config.port}`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));
//Variable necesaria para el ejercicio 2 de la hoja de ejercicios
let usuarios = ["Javier Montoro", "Dolores Vega", "Beatriz Nito"];
//Ejercicio 3 de la hoja de ejercicios se inicia desde http://localhost:3000/sumador
app.get("/sumador", function(request, response) {
    response.status(200);
    response.render("sumador");
});
app.get("/sumadorDos", function(request, response) {
    response.status(200);
    response.render("sumadorDos");
});
app.get("/setSumador",function(request,response){
    response.status(200);
    response.cookie("sum1",request.query.valor);
    response.redirect("sumadorDos");
});
app.get("/setSumadorDos",function(request,response){
    response.status(200);
    response.cookie("sum2",request.query.valor);
    response.redirect("/mostrarSum");
});
app.get("/mostrarSum",function(request,response){

    let total = Number(request.cookies.sum1) + Number(request.cookies.sum2);
    response.status(200);
    response.clearCookie("sum1");
    response.clearCookie("sum2");
    response.render("mostrarSum",{s1: request.cookies.sum1,s2: request.cookies.sum2,total: total});
});

//Ejercico 2 de la hoja de ejercicios se incia desde http://localhost:3000/users.html
app.get("/users.html", function(request, response) {
        response.status(200);
        response.render("users",{users: usuarios} );
});
app.get("/borrar/:id" , function(request , response){
    usuarios.splice(request.params.id,1);
    response.status(500);
	response.redirect("/users.html");
});
app.post("/borrar",function(request,response){
    usuarios.splice(request.body.id,1);
    response.status(500);
	response.redirect("/users.html");
});


//Cokies. Ejercico de clase se inicia desde http://localhost:3000/increment.html
app.get("/reset.html", function(request, response) {
	response.status(200);
	response.cookie("contador", 0, { maxAge: 86400000 } );
	response.type("text/plain");
	response.end("Has reiniciado el contador");
});
app.get("/increment.html", function(request, response) {
	if (request.cookies.contador === undefined) {
		response.redirect("/reset.html");
	} else {
		let contador = Number(request.cookies.contador) + 1;
		response.cookie("contador", contador);
		response.status(200);
		response.type("text/plain");
		response.end(`El valor actual del contador es ${contador}`);
	}
});

