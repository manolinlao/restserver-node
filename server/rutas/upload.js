const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../modelos/usuario');
const Producto = require('../modelos/producto');

const fs = require('fs');
const path = require('path');

//default options
//es un middleware
//hace que cuando se llama a ese servicio coloca todo lo que se está subiendo dentro de 
//un objeto llamado files en el request
//Podemos agregar configuraciones al fileUpload
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req,res){

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // ===================================
    // Validación del tipo
    // ===================================
    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        if(tiposValidos.indexOf(tipo)<0){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Las tipos permitidos son ' + tiposValidos.join(', '),
                }
            });
        }
    }

    // ===================================
    // Validación del nombre del fichero
    // ===================================
    //nombre del fichero
    let archivo = req.files.archivo;
    let nombreArchivoSpliteado = archivo.name.split('.');
    let extensionArchivo = nombreArchivoSpliteado[nombreArchivoSpliteado.length-1];

    // Extensiones permitidas
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo)<0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extensionArchivo
            }
        });
    }

    // Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    
    //se usa el método mv para colocar el fichero en algún  lugar del servidor
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err,
                mensajito: 'peta aki'
            });
        }

        // Aquí la imagen está cargada
        if(tipo==='usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }
       

    });


});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err,usuarioDB)=>{
        if(err){
            borrarArchivo(nombreArchivo,'usuarios'); //para evitar llenar el servidor de basura

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            borrarArchivo(nombreArchivo,'usuarios'); //para evitar llenar el servidor de basura

            return res.status(400).json({
                ok: false,
                err: {
                    message: ' Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img,'usuarios'); //cojo la imagen actual y la borro, porque subirá la nueva
        

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err,usuarioGuardado)=>{
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });


    });
}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err,productoDB)=>{
        if(err){
            borrarArchivo(nombreArchivo,'productos'); //para evitar llenar el servidor de basura

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            borrarArchivo(nombreArchivo,'productos'); //para evitar llenar el servidor de basura

            return res.status(400).json({
                ok: false,
                err: {
                    message: ' Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img,'productos'); //cojo la imagen actual y la borro, porque subirá la nueva
        

        productoDB.img = nombreArchivo;

        productoDB.save((err,productoGuardado)=>{
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            });
        });


    });
}


function borrarArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;

