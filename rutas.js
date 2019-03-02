const express = require ('express');
const router = express.Router();
const User = require ('./usuarios.js');
const Chaza = require ('./chazas.js');

router.get('/', (req,res) =>{
  res.json({
    status: 'Servidor de ChazUN online'
   });
  }
)

router.get('/usuarios', async (req,res)=>{
  const usuarios = await User.find();
  res.json(usuarios);
})

router.get('/chazas', async (req,res)=>{
  const chazas = await Chaza.find();
  res.json(chazas);
})

router.post('/ingresar', async (req,res)=>{
  const {email, password} = req.body;
  var usuario = await User.findOne({email: email},
       function(err,obj) {
         console.log(obj);
          });

  if(usuario.password == password){
    res.json({
      status: 'Ingresar a la cuenta', usuario: usuario, validado: 'ok'
     });
  }
  else{
    res.json({
      status: 'Ingresar a la cuenta falla', usuario: usuario, validado: 'not', error: 'Contraseña o usuario inválidos'
     });
  }


})

router.post('/nuevonegocio', async (req,res) =>{
  const {nombre, descripcion, administrador, celular, latitud, longitud} = req.body;
  const errors = [];

  if(nombre.length <=0){
    errors.push({status: 'Error. Inserta un nombre'});
  }
  if(descripcion.length <=0){
    errors.push({status: 'Error. Inserta una descripcion'});
  }
  if(celular.length <=0){
    errors.push({status: 'Error. Inserta un celular'});
  }

  if(errors.length == 0){
    const newNegocio = new Chaza({nombre,descripcion,administrador,celular,latitud,longitud});
    await newNegocio.save();
    res.json({
      status: 'Negocio registrado exitosamente!', registrado: 'ok'
     });
   }
   
  else{
    res.json({registrado: 'not'});
   }


})


router.post('/registrarse', async (req,res) =>{
  const {nombre, apellido, email, password, rol} = req.body;
  console.log(req.body);
  const errors = [];
  if(nombre.length <=0){
    errors.push({status: 'Error. Inserta un nombre'});
  }
  if(apellido.length <=0){
    errors.push({status: 'Error. Inserta un apellido'});
  }
  if(email.length <=0){
    errors.push({status: 'Error. Inserta un email'});
  }
  if(password.length <=0){
    errors.push({status: 'Error. Inserta una contraseña'});
  }


  const emailExists = await User.findOne({email: email});
  if(emailExists){
     errors.push({status: 'Error. Ese email ya está registrado'});
    }

  if(errors.length == 0){
    let timeStamp = Date.now();
    const newUser = new User({nombre,apellido,email,password,rol,timeStamp});
    newUser.password = password;
    await newUser.save();
    res.json({
      status: 'Te has registrado exitosamente!', registrado: 'ok'
     });
  }
  else{
    res.json({registrado: 'not'});
   }

})



module.exports = router;
