const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require('./moduledb1');
var ObjectId = require('mongoose').Types.ObjectId;
var url ='mongodb+srv://Adriano:<password>@cluster0.5ajuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';



mongoose.connect("mongodb+srv://Adriano:123Alienware$!$@cluster0.5ajuv.mongodb.net/Prova?retryWrites=true&w=majority", { useNewUrlParser: true ,  useUnifiedTopology: true  });
app.use(express.json());

app.get('/', function(req, res) {
	res.sendFile('/home/void/Desktop/Git_project/NoloNoloPlus/Code samples/mongo+node/client2.html');
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


app.delete('/:id', function(req, res) {
    user.findByIdAndDelete({_id: req.params.id});
});

app.put('/:id', function(req, res) {
    user.findByIdAndUpdate({_id: req.params.id}, req.body);
});

//find an object, in this case age > 40 , with this we can extract the id
user.findOne({age: {$gte:40} }, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Result : ", docs);
        user.findByIdAndDelete({_id: ObjectId(docs.id)});//perchè non lo elimina porcodio?
    }
});


app.listen(8000, function(){
    console.log('Server is running on port 8000')
})
