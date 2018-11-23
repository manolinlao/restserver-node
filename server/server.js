require('../config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//Rutas
app.get('/', (req,res)=>{
  res.json('Hello world');
});

app.get('/usuario', (req,res)=>{
  res.json('get Usuario');
});

app.post('/usuario', (req,res)=>{
  let body = req.body;

  if(body.nombre==undefined){
    //en vez de mandar un json envío un status, para enviar un código de respuesta
    res.status(400).json({
      ok: false,
      mensaje: "El nombre es necesario"
    });
  }else{
    res.json({
      persona: body
    });
  }
});

app.put('/usuario/:id', (req,res)=>{
  let param_id = req.params.id;

  res.json({
    param_id
  });

});

app.delete('/usuario', (req,res)=>{
  res.json('delete Usuario');
});

app.listen(process.env.PORT, ()=>{
  console.log("Escuchando puerto ",process.env.PORT);
});
