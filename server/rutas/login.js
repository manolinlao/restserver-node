const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../modelos/usuario');

const jwt = require('jsonwebtoken');

app.post('/login',(req,res)=>{

  //En el body viajarán el email-password
  let body = req.body;

  //veamos si existe ese usuario
  //a findOne le paso la condición de que email sea body.email
  Usuario.findOne({email:body.email}, (err,usuarioDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    //verificamos si no viene un usuario
    if( !usuarioDB ){
      return res.status(400).json({
        ok: false,
        err:{
          message: '(Usuario) o contraseña incorrectos'
        }
      });
    }
    //evaluamos la contraseña
    if(!bcrypt.compareSync(body.password,usuarioDB.password)){
      return res.status(400).json({
        ok: false,
        err:{
          message: 'Usuario o (contraseña) incorrectos'
        }
      });
    }
    //a sign se le pasa:
                //el payload, le pasamod el usuarioDB
                //   el secret, podemos poner lo que queramos separado por guiones
                //   el expiresIn, ponermos el tiempo en el que espira el token, le
                //   voy a poner en 30 días
    let token = jwt.sign({
      usuario: usuarioDB
    },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});
              //60 SEGUNDOS POR 60 MINUTOS *24 HORAS*30 DIAS

    //todo es ok, usuario y contraseña hacen match
    res.json({
      ok: true,
      usuario: usuarioDB,
      token: token
    });

  });
});


//así podremos usar todas las configuraciones que le hagamos a app para usarla en otros sitios
module.exports = app;
