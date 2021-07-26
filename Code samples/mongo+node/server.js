const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const user = require('./moduledb1');
var ObjectId = require('mongoose').Types.ObjectId;
const app = express();
var url ='mongodb+srv://Adriano:123Armadiopieno$!$@cluster0.5ajuv.mongodb.net/Prova?retryWrites=true&w=majority';

mongoose.connect(url, { useNewUrlParser: true ,  useUnifiedTopology: true  });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
	//res.sendFile('/home/void/Desktop/Git_project/NoloNoloPlus/Code samples/mongo+node/client2.html');
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/', function(req, res){

    let newUser = new user({
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age
    });
    newUser.save();
    res.redirect('/');
});


app.delete('/:id', function(req, res) {
    user.findByIdAndRemove({_id: req.params.id});
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
        //user.remove(); //dovrebbe cancellare tutti quelli che matchano
        //user.remove({name: docs.params.});
        //user.findByIdAndRemove({_id: docs.id});
        //user.findByIdAndRemove({_id: ObjectId(docs.id)});//perchè non lo elimina porcodio?
        //user.findByIdAndRemove({_id: '60f9ba4a495d752b245ed8fc'});
        console.log("Result : ", docs);
    }
});


app.listen(8000, function(){
    console.log('Server is running on port 8000')
})
