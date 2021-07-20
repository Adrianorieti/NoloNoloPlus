var mongoose = require('mongoose'); // mongoose è un module semplice per interagire col database

//qui mi connetto al database locale, nel caso di online userei una chiave API
mongoose.connect('mongodb://localhost/mydb', { useNewUrlParser: true ,useUnifiedTopology: true });

//once è come "on" di jquery, qui vediamo se si connette bene o da errore
mongoose.connection.once('open', function(){
    console.log('Connection completed');
}).on('error', function(error){
    console.log('Connection error', error);
});