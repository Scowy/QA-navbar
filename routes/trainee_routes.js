var express = require('express');
var traineeRoutes = express.Router();
var async = require("async");
var request = require('request');

var HolidayFeed = require('uk-bank-holidays');
const winston = require('../config/winston');
var databaseLogger = require('../config/winston-db')
var moment = require('moment');
var businessDiff = require('moment-business-days');

const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');

var AuthenticationController = require('../config/authentication');  
var passport = require ('passport');

var CryptoJS = require("crypto-js");
var requireAuth = passport.authenticate('jwt', {session: false});

let Trainee = require('../models/trainee.model');
let SortCodeCollection = require('../models/sortcode.model');


let monthlyReports = require('../models/monthlyReport.model');

require('dotenv').config()

let hex = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
let iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

//get a single trainee by id
traineeRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    console.log(req.params);
    Trainee.findById(id, function(err, trainee) {
        console.log('trainee found is :');
        console.log(trainee);
        if(!trainee){
            res.json(null);
        }
        else{
            var bytes  = CryptoJS.AES.decrypt(trainee.trainee_email, CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939"), {iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")});
            trainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_fname, '3FJSei8zPx');
            trainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_lname, '3FJSei8zPx');
            trainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.status, '3FJSei8zPx');
            trainee.status = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.added_By, '3FJSei8zPx');
            trainee.added_By = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.bursary, '3FJSei8zPx');
            trainee.bursary = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_start_date, '3FJSei8zPx');
            trainee.trainee_start_date = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_end_date, '3FJSei8zPx');
            trainee.trainee_end_date = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_bench_start_date, '3FJSei8zPx');
            trainee.trainee_bench_start_date = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_bench_end_date, '3FJSei8zPx');
            trainee.trainee_bench_end_date = bytes.toString(CryptoJS.enc.Utf8);
			bytes = CryptoJS.AES.decrypt(trainee.bank_holiday, '3FJSei8zPx');
            trainee.bank_holiday = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.bursary_amount, '3FJSei8zPx');
            trainee.bursary_amount = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(trainee.trainee_days_worked, '3FJSei8zPx');
            trainee.trainee_days_worked = bytes.toString(CryptoJS.enc.Utf8);
            if(trainee.status === 'Active'){
                bytes = CryptoJS.AES.decrypt(trainee.trainee_bank_name, '3FJSei8zPx');
                trainee.trainee_bank_name = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_account_no, '3FJSei8zPx');
                trainee.trainee_account_no = bytes.toString(CryptoJS.enc.Utf8);
                bytes = CryptoJS.AES.decrypt(trainee.trainee_sort_code, '3FJSei8zPx');
                trainee.trainee_sort_code = bytes.toString(CryptoJS.enc.Utf8);
            }
            let logger = databaseLogger.createLogger(trainee.trainee_email);
            res.json(trainee);
            logger.verbose("Trainee info accessed")
            winston.info('get data for trainee: '+ trainee.trainee_email);
        }
    })
    .catch(err => {
        console.log(err);
		winston.error(err)
        res.status(400).send("Trainee doesn't exist");
    });
}) 

module.exports = traineeRoutes;
