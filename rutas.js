const express = require ('express');
const router = express.Router();
const User = require ('./usuarios.js');

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


router.get('/ingresar', async (req,res)=>{


  res.json({
    status: 'Ingresar a la cuenta'
   });

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
