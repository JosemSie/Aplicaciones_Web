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

let usuarios = ["Javier Montoro", "Dolores Vega", "Beatriz Nito"];

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
const cookieParser = require("cookie-parser")
app.use(cookieParser());
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

