const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require('./moduledb1');
var url ='mongodb+srv://Adriano:<password>@cluster0.5ajuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect("mongodb+srv://Adriano:123Alienware$!$@cluster0.5ajuv.mongodb.net/Prova?retryWrites=true&w=majority", { useNewUrlParser: true ,  useUnifiedTopology: true  });
app.use(express.json());

app.get('/', function(req, res) {
	res.sendFile('/home/void/Desktop/Git_project/NoloNoloPlus/Code samples/mongo+node/client.html');
})

app.post('/', function(req, res){

    let newUser = new user({
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age
    });
    console.log(req.body.name);
    console.log(req.body.surname);
    console.log(req.body.age);
    newUser.save();
    res.redirect('/');
})

app.listen(8000, function(){
    console.log('Server is running on port 8000')
})
