const express = require('express');
const app = express();

const Categoria = require('../modelos/categoria');
const Usuario = require('../modelos/usuario');

//middleware de autenticacion
const { verificaToken,verificaSuper_Role } = require('../middlewares/autenticacion');

//===============================
// Obtiene todas las categorías
//===============================
app.get('/categoria', verificaToken, (req,res)=>{
  Categoria.find( {} )
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err,categorias)=>{
      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Categoria.countDocuments({}, (err,conteo)=>{
        res.json({
          ok: true,
          categorias,
          cuantos:conteo
        })
      });
    })
});

//===============================
// Obtiene una categoría por ID
//===============================
app.get('/categoria/:id', verificaToken, (req,res)=>{

  let id = req.params.id;

  Categoria.findById( id, (err,categoriaBD)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID no es correcto'
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });

  });
});

//===============================
// Crea una nueva categoría
//===============================
app.post('/categoria', [verificaToken], (req,res)=>{
  let body = req.body;

  //El id que introduzco será el req.id,porque ya lo ha pasado por el middleware de verificaToken
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err,categoriaDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No se ha podido grabar la categoría'
        }
      });
    }
    //no necesito poner el status a 200 porque está implícito
    res.json({
      ok:true,
      categoria: categoriaDB
    });

  });

});

//===============================
// Actualiza una categoría
//===============================
app.put('/categoria/:id', [verificaToken], (req,res)=>{
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion: body.descripcion
  }
  //utilizo la función pick del underscore porque sólo quiero actualizar esos campos
  //let body = _.pick(req.body, ['nombre','email','img','role','estado']);

  //el new:true es para que usuarioDB sea el modificado
  //el runValidators hará que se cumplan las validaciones definidas en el modelo
  Categoria.findByIdAndUpdate(id, descCategoria, {new:true , runValidators:true, context:'query'}, (err,categoriaDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No se ha podido actualizar la categoría'
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });

});

//===============================
// Borra una categoría
//===============================

app.delete('/categoria/:id', [verificaToken,verificaSuper_Role], (req,res)=>{

  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err,categoriaBorrada)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!categoriaBorrada){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Categoria no borrada'
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBorrada
    });

  });


});

module.exports = app;
