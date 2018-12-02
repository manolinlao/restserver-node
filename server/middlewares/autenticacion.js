const jwt = require('jsonwebtoken');

// =============================
// Verificar token
// =============================

let verificaToken = ( req, res, next )=>{
  //leemos del header el valor de token
  let token = req.get('token');

  jwt.verify(token, process.env.SEED, (err,decoded)=>{
    if(err){
      return res.status(401).json({
        ok: false,
        message1:'na no va esto',
        token: token,
        seed: process.env.SEED,
        err: err
      });
    }
    //el decoded contiene info del usuario, contiene el payload
    //sé que en el objeto que encripté puse el usuarios
    //puedo hacer que cualquier petición tenga acceso a la info del usuarios
    //estamos añadiendo al objeto request de la petición un nuevo elemento, en este
    //caso el usuario, además es un usuario válido porque ya pasó por el
    //verifica token
    req.usuario = decoded.usuario;

    next();

  });

};


// =============================
// Verificar SUPER_ROLE
// =============================
let verificaSuper_Role = (req, res, next ) => {
  //aquí ya tenemos el usuario porque hah pasado por el verificaToken
  let usuario = req.usuario;

  if(usuario.role === 'SUPER_ROLE'){
    next();
  }else{
    return res.json({
      ok: false,
      err:{
        message: 'El usuario no es superrole'
      }
    });
  }
}

// =============================
// Verificar token para imagen (por URL)
// =============================
let verificaTokenImg = (req, res, next) => {
  //obtenemos el token por url
  let token = req.query.token;  //enviare ....?token=...


  jwt.verify(token, process.env.SEED, (err,decoded)=>{
    if(err){
      return res.status(401).json({
        ok: false,
        err:{
          message: 'token no valido'
        }
      });
    }
    
    req.usuario = decoded.usuario;

    next();

  });
}

module.exports = {
  verificaToken,
  verificaSuper_Role,
  verificaTokenImg
}
