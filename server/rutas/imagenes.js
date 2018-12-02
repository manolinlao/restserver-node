const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req,res)=>{
    let tipo = req.params.tipo;
    let img = req.params.img;

    // Path de la imagen a mostrar si no existe la imagen a buscar
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    
    // Path de la imagena a buscar
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        res.sendFile(noImagePath); 
    }

   

    
});


module.exports = app;