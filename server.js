const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require ('mongoose');
const path = require ('path');
const bodyParser = require ('body-parser');
const router = express.Router();

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));


// allow-cors
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
})


app.use(require('./rutas.js'));
app.use(require('./chazas.js'));

//2eb3c691-ae90-4d4a-9d7b-b3fe7ddc2a49
//Conectarse a la base de datos
const db = 'mongodb://admin:admin@cluster0-shard-00-00-t96vb.mongodb.net:27017,cluster0-shard-00-01-t96vb.mongodb.net:27017,cluster0-shard-00-02-t96vb.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(db, {
  useNewUrlParser: true,
  })
  .then (db=> console.log('Conectado a la db')).catch(er=>console.log(err));

app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Error :(</h2>');
});



app.set('port', process.env.PORT || 3001)
var x = app.get('port');
app.listen(app.get('port'), () =>{
    console.log("Server On "+x);
});
