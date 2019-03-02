const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require ('mongoose');
const path = require ('path');
const bodyParser = require ('body-parser');

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  res.status(404).send('<h2 align=center>Error :(</h2>');
});

app.set('port', process.env.PORT || 3001)
var x = app.get('port');
app.listen(app.get('port'), () =>{
    console.log("Server On "+x);
});
