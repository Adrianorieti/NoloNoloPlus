// Express requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const services = require('./api/services');
const account = require('./api/account');
const rental = require('./api/rental');
const costumer = require('./api/costumer');
const auth = require('./api/auth');
const app = express();

require('dotenv').config();

// Cross-Origin-Resource-Sharing
var cors = require('cors');
//Database url
var url = process.env.URL;

//Connect and start express services
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/account/', account);
app.use('/api/services/', services);
app.use('/api/rental/', rental);
app.use('/api/costumer/', costumer);
app.use('/api/auth/', auth);

// These API's answer an url query with static files
// This is required so the client can use React routes

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/personalpage", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get("/updatepage", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8001, function () {
    console.log('Server is running on port 8001');
});
