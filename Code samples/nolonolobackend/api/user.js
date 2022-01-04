const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs =require('fs');
const user = require('../schemas/moduleUser');
const express = require('express');
const multer = require('multer');
const path = require('path');

const userImagesPath = path.join(
    global.rootDir,
    '/images/users' 
)
// Initialize local storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, userImagesPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) //Appending extension
    },
})

function deleteImg(img) {
    if (img) {
        try {// controllare se non c'è default dentro il nome dell'immagine
            fs.unlinkSync(path.join(userImagesPath, path.basename(img)))
        } catch (err) {
            console.log('Error while removing image')
            console.log({ error: err })
        }
    }
}

const upload = multer({ storage: storage })

const router = express.Router();

router.get('/:email', (req, res) => {
    let email = req.params.email;
    user.findOne({ email: email })
        .exec()
        .then((result) => {
            res.status(200).json({ user: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "internal server error" });
        })
})
//quando creiamo uno user inseriamo l'immagine di default

router.post('/:email', upload.single('img'),(req, res) => {
    let email = req.params.email;
    let newData = {};
    if(!req.file)    
    {
         newData = req.body;
    }else
    {
         newData.image = path.join('/images/users', req.file.filename)
    }
    console.log(newData);
    user.findOneAndUpdate(
        { email: email },
        { $set: newData },
        { runValidators: true, new: false, useFindAndModify: false }
    ).exec()
        .then((result) => {
                 res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ message: 'Bad input parameter', error: err })
        })
})

module.exports = router;