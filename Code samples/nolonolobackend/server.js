/* Server requirements */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const services = require('./api/services');
const account = require('./api/account');
const rental = require('./api/rental');
const customer = require('./api/customer');
const auth = require('./api/auth');
const employeeRoutes = require('./routes/empRoutes');
const employee = require('./api/employee');
const app = express();

require('dotenv').config();

/* Cross-Origin-Resource-Sharing */
var cors = require('cors');

/* Database url */
var url = process.env.URL;

/* Connect and start express services */
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'backoffice/html')));


/* Actual server routes */ 
app.use('/api/account/', account);
app.use('/api/services/', services);
app.use('/api/rental/', rental);
app.use('/api/customer/', customer);
app.use('/api/auth/', auth);
app.use('/api/employee/', employee);

/* Alternative routes for static files */
app.use('/employee/', employeeRoutes);

 /* These API's answer an url query with static files,
 this is required so the client can use React routes */

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
