var express = require('express');
var adminRoutes = express.Router();

const fs = require('fs');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const winston = require('../config/winston');
const databaseLogger = require('../config/winston-db')

var jwt = require('jsonwebtoken');
var AuthenticationController = require('../config/authentication');  
var passport = require ('passport');

var CryptoJS = require("crypto-js");
var secret = require('../config/auth.js');
var requireAuth = passport.authenticate('jwt', {session: false});

let User = require('../models/staff');
let Records = require('../models/record.model');
let Trainee = require('../models/trainee.model');

//gets single user by id
adminRoutes.route('/staff/:id').get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, staff) {
        console.log('STAFF TRYING TO FIND :');
        console.log(staff);
        if(!staff){
            res.json(null);
        }
        else{
		    staff.fname = CryptoJS.AES.decrypt(staff.fname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
		    staff.lname = CryptoJS.AES.decrypt(staff.lname, 'c9nMaacr2Y').toString(CryptoJS.enc.Utf8);
		    staff.email = CryptoJS.AES.decrypt(staff.email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")}).toString(CryptoJS.enc.Utf8);
            staff.status = CryptoJS.AES.decrypt(staff.status, '3FJSei8zPx').toString(CryptoJS.enc.Utf8);
            res.json(staff);
            let logger = databaseLogger.createLogger(staff.email);
            winston.info('Returned Staff details: ' + staff.email);
            logger.verbose('Returned Staff details: ' + staff.email);
        }
    })
    .catch(err => {
        res.status(400).send("Staff doesn't exist");
		console.log('staff doesnt exist');
        winston.error('tried to get staff member but does not exist ' + err)
    });
});

module.exports = adminRoutes;