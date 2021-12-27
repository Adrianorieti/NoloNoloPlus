const jwt = require('jsonwebtoken');
require('dotenv').config();
const employee = require('../schemas/moduleEmployee'); //questo serve per fare le statistiche sugli impiegati.
//const manager = require('../schemas/moduleManager');
const product = require('../schemas/moduleProduct');
const category = require('../schemas/moduleCategory');
const user = require('../schemas/moduleUser');
const emailChange = require('../functions/emailCascade');
const auth = require('./auth');
const express = require('express');
const bcrypt = require('bcrypt');


const router = express.Router();

/**
 * Verify if the manager exists in the database. If yes, the manager receive a token
 * @param {email, password}
 * @return {token}
 */
router.get('/stat/user', async (req, res) => {
    //trovo tutti gli user del sistema
    const users = await user.find();
    //prendo soltanto gli user che hanno almeno una reservation conclusa
    const filteredUsers = users.filter(user => user.pastReservations.length > 0);
    if (filteredUsers.length > 0) {
        //ora da filteredUsers prendo soltanto i valori che mi interessano -> fatturato, numero di noleggi danni e mail.
        const finalUsers = filteredUsers.map(user => ({ email: user.email, expense: user.amountPaid, reservations: user.pastReservation.length, damages: user.fidelityPoints }));
        res.status(200).json({ users: finalUsers });
    }
    else {
        //non ci sono utenti che hanno delle prenotazioni, quindi non si possono fare delle statistiche
        res.status(500).send("no active users");
    }
});

router.get('/stat/category', async (req, res) => {
    //prendo tutte le categorie, e mi salvo solo i loro nomi
    const categories = await category.find();
    const categoriesName = categories.map(cat => cat.name);
    let finalCategories = [];
    for (let name of categoriesName) {
        //ora per ogni nome devo prendere gli oggetti della categoria, e sommare il fatturato, i noleggi e il numero di oggetti che ha.
        const products = product.find({ type: name });
        //prendo soltanto i prodotti che hanno sia totlaSales, che numberOfRents.
        const filteredProducts = products.filter(prod => prod.totalSales && prod.numberOfRents);
        if (filteredProducts.length > 0) {
            //ho array con tutti i prodotti della categoria name, che hanno anche totalSales e numberOfRents
            let totalSalesCategory = 0;
            let numberOfRentsCategory = 0;
            for (let prod of filteredProducts) {
                //sommo tutte le vendite e i noleggi della categoria
                numberOfRentsCategory += prod.numberOfRents;
                totalSalesCategory += prod.totalSales;
            }
            //metto nell'array da mandare allo user tutti i dati interessanti della categoria
            finalCategories.push({ name: name, numberOfProducts: filteredProducts.length, totalSales: totalSalesCategory, numberOfRents: numberOfRentsCategory });
            //con il numero di prodotti, posso fare una specie di statistica del rapporto numero di prodotto fatturato tipo.
        }
    }
    if (finalCategories.length > 0) {
        //ho qualcosa da mandare
        res.status(200).json({ categories: finalCategories });
    }
    else {
        //non ci sono mai stati noleggi di alcun oggetto
        res.status(500).send("no statistical data");
    }
});

router.get('/stat/category/products', async (req, res) => {
    const products = await product.find();
    //prendo soltanto i prodotti che hanno sia totlaSales, che numberOfRents.
    const filteredProducts = products.filter(prod => prod.totalSales && prod.numberOfRents);
    if (filteredProducts) {
        //ora da filteredProducts prendo soltanto i valori che mi interessano -> fatturato, numero di noleggi, nome, e status.
        const finalProducts = filteredProducts.map(prod => ({ name: prod.name, status: prod.status, sales: prod.totalSales, rents: prod.numberOfRents }));
        //così posso paragonare tra di loro i singoli oggetti.
        res.status(200).json({ products: finalProducts });
    }
    else {
        // non ci sono prodotti che sono stati noleggiati.
        res.status(500).send('no statistical data on products.');
    }
});

router.get('/stat/user/reservation', async (req, res) => {
    //trovo tutti gli user del sistema
    const users = await user.find();
    //prendo soltanto gli user che hanno almeno una reservation conclusa
    const filteredUsers = users.filter(user => user.pastReservations.length > 0);
    if (filteredUsers.length > 0) {
        //ora da filteredUsers prendo soltanto i valori che mi interessano -> le past reservations. Poi verranno analizzate client side.
        const finalreservations = filteredUsers.map(user => user.pastReservations);
        res.status(200).json({ users: finalreservations });
    }
    else {
        //non ci sono utenti che hanno delle prenotazioni, quindi non si possono fare delle statistiche
        res.status(500).send("no reservations");
    }
});

router.get('/stat/employee', async (req, res) => {
    const employees = await employee.find();
    //prendo soltanto gli useemployee che hanno almeno una reservation conclusa
    const filteredEmployees = employees.filter(employee => employee.pastReservations.length > 0);
    if (filteredEmployees.length > 0) {
        //ora da filteredEmployees prendo soltanto i valori che mi interessano -> fatturato, numero di noleggi danni, fatturato.
        let finalEmployees = [];
        for (let employee of filteredEmployees) {
            let totalSales = 0;
            for (let res of employee.pastReservations) {
                totalSales += res.expense;
            }
            finalEmployees.push({ email: employee.email, sales: totalSales, numberOfReservations: employee.pastReservations.length });
        }
        //const finalEmployees = filteredEmployees.map(employee => ({ email: employee.email, reservations: employee.pastReservation }));
        res.status(200).json({ users: finalEmployees });
    }
    else {
        //non ci sono employee che hanno delle prenotazioni, quindi non si possono fare delle statistiche
        res.status(500).send("no active employees");
    }
});

router.get('/employee', async (req, res) => {
    const employees = await employee.find();
    const finalEmployees = employees.map(employee => ({ name: employee.name, surname: employee.surname, phone: employee.phone, email: employee.email }));
    res.status(200).json({ finalEmployees });
});
