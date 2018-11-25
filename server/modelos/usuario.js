const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const uniqueValidator = require('mongoose-unique-validator');

//para valiar el role
  //definimos los values válidos
  //message es el mensaje que daremos cuando se entre un valor no permitido
  //{PATH} es el valor que entra el usuario, esto lo maneja mongoose
let rolesValidos = {
  values: ['SUPER_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  password: {
    type: String,
    required: [true, 'El password es obligatorio']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado:{
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

//Si este modelo se printa, haremos que no se printe el campo password
usuarioSchema.methods.toJSON = function(){
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

usuarioSchema.plugin( uniqueValidator, { message:'{PATH} debe de ser único' });

//Al modelo le llamo Usuario
module.exports = mongoose.model( 'Usuario' , usuarioSchema);
//mongoose pone 'Usuario' en minúscula y le añade una 's' --> usuarios
//en este caso va a coincidir con el nombre de la colección que ya tenemos
