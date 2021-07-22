const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('./moduledb1');

mongoose.connect('mongodb+srv://Adriano:123Alienware$!$@cluster0.5ajuv.mongodb.net/Prova', { useNewUrlParser: true , useUnifiedTopology: true })

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile('/home/void/Desktop/Git_project/NoloNoloPlus/Code samples/mongo+node/node+ajax-client.html');
})

app.post('/', function(req, res){
    let newUser = new user({
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age
    })
    res.send("Correctly received");
    newUser.save();
    res.redirect('/');
})



app.listen(8000, function(){
    console.log('Server is running on port 8000')
})