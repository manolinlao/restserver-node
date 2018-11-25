const express = require('express');
const app = express();

const Usuario = require('../modelos/usuario');

const bcrypt = require('bcrypt');

//Librería underscore
const _ = require('underscore');


app.get('/usuario', (req,res)=>{

  //si no viene el parámetro "desde" consideramos que será el "0"
  let desde = req.query.desde || 0;
  desde = Number(desde); //transformamos desde en un número
  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find( { estado: true} )
    .skip(desde)
    .limit(limite)
    .exec((err,usuarios)=>{
      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Usuario.count({ estado: true }, (err,conteo)=>{
        res.json({
          ok: true,
          usuarios,
          cuantos:conteo
        })
      });
    })
});

app.post('/usuario', (req,res)=>{
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync( body.password, 10),
    role: body.role
  });

  usuario.save((err,usuarioDB)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    //usuarioDB.password = null;  //solución no elegante para no  mostrar password

    //no necesito poner el status a 200 porque está implícito
    res.json({
      ok:true,
      usuario: usuarioDB
    });


  });

});

app.put('/usuario/:id', (req,res)=>{
  let id = req.params.id;
  //utilizo la función pick del underscore porque sólo quiero actualizar esos campos
  let body = _.pick(req.body, ['nombre','email','img','role','estado']);

  //el new:true es para que usuarioDB sea el modificado
  //el runValidators hará que se cumplan las validaciones definidas en el modelo
  Usuario.findByIdAndUpdate(id, body, {new:true , runValidators:true, context:'query'}, (err,usuarioDB)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

});

app.delete('/usuario/:id', (req,res)=>{

  let id = req.params.id;

  let cambiaEstado = {
    estado: false
  }

  Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true}, (err,usuarioBorrado)=>{
  //Usuario.findByIdAndRemove(id, (err,usuarioBorrado)=>{
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if(!usuarioBorrado){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    });

  });


});

module.exports = app;
