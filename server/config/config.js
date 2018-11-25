//==========================
//  puerto
//==========================
//Si estamos en producción heroku pone valor  a esa variable si no, ponemos 3000
process.env.PORT = process.env.PORT || 3000;

//==========================
//  Entorno
//==========================
//si la variable node_env no existe la pongo a "dev" (Desarrollo)
//esta variable NODE_ENV la pone heroku si es que estamos en producción.
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

//==========================
//  Base de datos
//==========================
let urlDB;
if(process.env.NODE_ENV==="dev"){
  urlDB = 'mongodb://localhost:27017/cafe';
}else{
  urlDB = process.env.MONGO_URI;
}
//nos inventamos el environment URLDB que usaremos en server.js
process.env.URLDB = urlDB;
