const express = require('express');
const app = express();

//middleware de autenticacion
const { verificaToken } = require('../middlewares/autenticacion');

let Producto = require('../modelos/producto');

//===============================
// Obtiene todas los productos
//===============================
app.get('/productos',verificaToken, (req,res)=>{
  // trae todos los productos
  // populate usuario y categoría
  // paginado

  //si no viene el parámetro "desde" consideramos que será el "0"
  let desde = req.query.desde || 0;
  desde = Number(desde); //transformamos desde en un número
  let limite = req.query.limite || 5;
  limite = Number(limite);

  //sólo busco los productos con el campo disponible a true
  Producto.find( {disponible: true} )
    .sort('nombre')
    .skip(desde)
    .limit(limite)
    .populate('usuario','nombre email')
    .populate('categoria','nombre')
    .exec((err,productos)=>{
      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }

      //sólo son válidos los que tienen el campo disponible a true
      Producto.countDocuments({ disponible: true }, (err,conteo)=>{
        res.json({
          ok: true,
          productos,
          cuantos:conteo
        })
      });
    })

});

//===============================
// Obtiene  productos por id
//===============================
app.get('/productos/:id',(req,res)=>{
  // populate usuario y categoría
  // paginado
  let id = req.params.id;

  Producto.findById(id)
          .populate('usuario','nombre email')
          .populate('categoria','descripcion')
          .exec((err,productoDB)=>{
            if(err){
              return res.status(500).json({
                ok: false,
                err
              });
            }
            if(!productoDB){
              if(err){
                return res.status(400).json({
                  ok: false,
                  err:{
                    message: 'ID no existe'
                  }
                });
              }
            }
            res.json({
              ok: true,
              producto: productoDB
            });
          });

});

//===============================
// Buscar producto
//===============================
app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{

  let terminoDeBusqueda = req.params.termino;

  //expresión regular para hacer la búsqueda más flexible
  let regex = new RegExp(terminoDeBusqueda,'i');

  Producto.find({ nombre: regex })
    .populate('categoria','nombre')
    .exec((err,productos)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        productos
      });
    })
})


//===============================
// crear producto
//===============================
app.post('/productos',verificaToken,(req,res)=>{
  // grabar usuario
  // grabar categoría
  let body = req.body;

  console.log(req.usuario._id);

  //El id que introduzco será el req.id,porque ya lo ha pasado por el middleware de verificaToken
  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  });


  producto.save((err,productoDB)=>{
    if(err){
      return res.status(500).json({
        ok:false,
        err
      });
    }
    res.status(201).json({
      ok:true,
      producto: productoDB
    });
  });

});

//===============================
// Actualizar producto
//===============================
app.put('/productos/:id',(req,res)=>{
  // actualizar usuario
  // actualizar categoría
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id,(err,productoDB)=>{
    if(err){
      return res.status(500).json({
        ok:false,
        err
      });
    }
    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err:{
          message:'El ID no existe'
        }
      });
    }
    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err,productoGuardado)=>{
      if(err){
        return res.status(500).json({
          ok:false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado
      });

    });

  });


});

//===============================
// Borrar producto
//===============================
app.delete('/productos/:id',(req,res)=>{
  // borrar usuario
  // borrar categoría pero usando el campo disponible, que pase a falso
  let id=req.params.id;
  Producto.findById(id, (err,productoDB)=>{
    if(err){
      return res.status(500).json({
        ok:false,
        err
      });
    }
    if(!productoDB){
      return res.status(400).json({
        ok:false,
        err:{
          message: "ID no existe"
        }
      });
    }

    //le cambiamos el disponible
    productoDB.disponible = false;
    productoDB.save((err,productoBorrado)=>{
      if(err){
        return res.status(500).json({
          ok:false,
          err
        });
      }
      res.json({
        ok: true,
        producto: productoBorrado,
        message: 'Producto borrado'
      });
    })

  });

});

module.exports = app;
