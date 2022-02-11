
global.rootDir = __dirname;

/* Server requirements */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const employee = require('./schemas/moduleEmployee');
const pending = require('./schemas/modulePendingRequest');
const user = require('./schemas/moduleUser');
const rental = require('./api/rental');
const account = require('./api/account');
const pendingRequest = require('./api/pending');
const customer = require('./api/customer');
const auth = require('./api/auth');
const employeeRoutes = require('./routes/empRoutes');
const emp = require('./api/newemployee');
const manager = require('./api/manager');
const categories = require('./api/categories');
const products = require('./api/products');
const userApi = require('./api/user');
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
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'backoffice')));
app.use('/images', express.static(path.join(__dirname, 'images')));

/* Actual API server routes */
app.use('/api/account/', account);
app.use('/api/rental/', rental);
app.use('/api/pending/', pendingRequest);
app.use('/api/customer/', customer);
app.use('/api/auth', auth);
app.use('/api/employee/', emp);
app.use('/api/categories', categories);
app.use('/api/products', products);
app.use('/api/user', userApi);
app.use('/api/manager/', manager);

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

app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/personalpage", function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/products', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/images/categories/:type', (req, res) => {
    const type = req.params.type;
    res.sendFile(path.join(__dirname, 'images', 'categories', type));
});

app.get('/images/users/:name', (req, res) => {
    const name = req.params.name;
    res.sendFile(path.join(__dirname, 'images', 'users', name));
});

app.get('/images/employee/:name', (req, res) => {
    const name = req.params.name;
    res.sendFile(path.join(__dirname, 'images', 'employees', name));
});

app.get('/dashboard/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

app.listen(8001, function () {
    console.log('Server is running on port 8001');
});
