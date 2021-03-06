require('./config/config');

const mongoose = require('mongoose');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//Cargo fichero de rutas global
app.use(require('./rutas/rutas'));

// habilitar la carpeta public
//app.use(express.static(__dirname +'../public'));
const path = require('path');
app.use( express.static( path.resolve(__dirname ,'../public') ) );



//mongoose.connect('mongodb:localhost:27017/cafe',(error,respuesta)=>{
mongoose.connect(process.env.URLDB, { useNewUrlParser: true },(error,respuesta)=>{
  if(error){
    throw error;
  }
  console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, ()=>{
  console.log("Escuchando puerto ",process.env.PORT);
});
