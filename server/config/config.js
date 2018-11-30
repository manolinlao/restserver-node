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

//==========================
//  Vencimiento del token
//==========================
//60 segundos  60 minutos 24 horas 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//==========================
//  SEED
//==========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==========================
//  Google Client ID
//==========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '680992887697-plrhpa5mg4u0a04u52bhkogspht4oaba.apps.googleusercontent.com';
