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
  const {nombre, descripcion, administrador, celular, latitud, longitud, horario,email,categoria} = req.body;
  const errors = [];
  console.log(req.body)
  var aid;
        console.log('correo: '+email);

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
    const newNegocio = new Chaza({nombre,descripcion,administrador,celular,latitud,longitud,horario,categoria});
    await newNegocio.save(async function(err,obj) {
        aid = obj._id;
        console.log(aid)
        if(aid!=null && aid!=undefined){
          var usuario = await User.findOne({email: email});
          console.log(usuario);
          usuario.chaza.push({iden: aid})
          usuario.save();
          res.json({
            status: 'Negocio registrado exitosamente!', registrado: 'ok'
           });
        }
      });;
  }

  else{
    res.json({registrado: 'not'});
   }


})

router.post('/calificarChaza', async(req,res)=>{
  const {email,calificacion,autor,comentario,timeStamp,chaza} = req.body;
  var shouldUpdate = false;
  await Chaza.findOne({_id: chaza._id},
       function(err,obj) {
         //var chazObj = obj;
         var updateIndex = 0;
         var index = null;
         obj.comentarios.forEach(comentario=>{
            if(comentario.autorEmail == email){
              shouldUpdate = true;
              index = updateIndex;
            }
           updateIndex++;
          });

          if(shouldUpdate){
            obj.calificacion = obj.calificacion - obj.comentarios[index].calificacion; //restar antigua califiacion
            obj.comentarios[index] = {comentario:comentario,autor:autor,autorEmail:email,
                                            calificacion:calificacion,timeStamp:timeStamp};
            var average = 0;
            obj.comentarios.forEach(comentario=>{
                average= average + comentario.calificacion;
            });
            average = parseFloat((average)/obj.totalCalificaciones).toFixed(1);
            obj.calificacion = average;
            //obj.calificacion = (obj.calificacion + calificacion)/ obj.totalCalificaciones; //sumar nueva calificacion
            obj.save();
            res.json({añadido: 'updated'});
          }
          else{
            obj.comentarios.push({comentario:comentario,autor:autor,autorEmail:email,
                                       calificacion:calificacion,timeStamp:timeStamp});

            obj.totalCalificaciones = obj.totalCalificaciones + 1;

            var average = 0;
            obj.comentarios.forEach(comentario=>{
                average= average + comentario.calificacion;
            });
            average = parseFloat((average)/obj.totalCalificaciones).toFixed(1);
            obj.calificacion = average;
            //obj.calificacion = (obj.calificacion + calificacion)/ obj.totalCalificaciones;
            obj.save();
            res.json({añadido: 'ok'});
          }

        });

});

router.post('/getchazasofuser', async (req,res) =>{
  const {email} = req.body;
  var usuario = await User.findOne({email: email},
       function(err,obj) {
          });

  var itemGroupItemIds = usuario.chaza.map(function(item){
    return item.iden
    });
  const chazas = await Chaza.find({_id: {$in: itemGroupItemIds}});
  console.log(chazas[0].nombre);
  res.json({negocios: chazas});

});

router.post('/nuevoProducto', async (req,res) =>{
  const {producto,precio,id} = req.body;
  var errors = 0;
  if(producto.length <=0){
     errors++;
  }
  if(precio.length<=0){
     errors++;
  }
  var chaza = await Chaza.findOne({_id: id},
       function(err,obj) {
         if(!err && errors == 0){
           obj.productos.push({producto:producto,precio:precio});
           obj.save(function(err){
              var productosActualizados = obj.productos;
              res.json({añadido: 'ok', productos: productosActualizados});
            });

         }
         else{
           res.json({añadido: 'not'});
         }

          });

});

router.post('/removerProducto', async (req,res) =>{
  const {id,index} = req.body;
  var chaza = await Chaza.findOne({_id: id},
       function(err,obj) {
         if(!err){
           console.log('eliminando: '+obj.productos[index]);
           obj.productos.splice(index, 1);
           obj.save(function(err){
              var productosActualizados = obj.productos;
              res.json({removido: 'ok', productos: productosActualizados});
            });

         }
         else{
           res.json({removido: 'not'});
            }
          });

});

router.post('/removeChaza', async (req,res) =>{
  Chaza.remove({ _id: req.body.id }, function(err) {
    if (!err) {
            res.json({removido: 'ok'});
    }
    else {
            res.json({removido: 'not', error:'No se pudo remover'});
    }
});

});

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
