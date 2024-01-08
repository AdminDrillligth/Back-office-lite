
// https://blog.logrocket.com/building-rest-api-firebase-cloud-functions-typescript-firestore/#writing-first-cloud-function
var cors = require('cors');
import * as functions from 'firebase-functions';
import * as express from 'express';
//  var router = express.Router();
// const nodemailer = require('nodemailer');
import { addEntry, getAllEntries, updateEntry, deleteEntry } from './entryController';
import { addAdmin, getAdmins, updateAdmin, deleteAdmin } from './adminsController';
import { createAccount, getAccountDetails, getAccountsList, updateAccount, deleteAccount } from './AccountController';
import { createEcone, getEconeDetails, updateEcone, deleteEcone } from './econesController';
import { connectToAccount } from './loggerController';
import { createExercice, getExerciceDetails, getExercicesList, updateExercice, deleteExercice } from './exercicesController';
import { createSession, getSessionDetails, getSessionsList, updateSession, deleteSession } from './sessionsController';
import { getToken, validateToken, passwordHash } from './tokenController';
// import { setPasswordHash } from './passwordController';
//  var methods = require("./methods");

const app = express()
//

app.use(cors({ origin: ['http://localhost:4200','https://drilllight.web.app','http://localhost:8100', 'capacitor://localhost','https://localhost']}));
app.use(express.json());
app.get("/",(req, res, next) => {
  res.status(200).send('ON DEMARRE DRILLLIGHT API !')
});

// app.post('/token', getToken)

// app.patch('/token', updateEntry)
// app.delete('/token', deleteEntry)
app.post('/entries', addEntry)
app.get('/entries', getAllEntries)
app.patch('/entries/:entryId', updateEntry)
app.delete('/entries/:entryId', deleteEntry)

//
app.post('/admin', addAdmin)
app.get('/admin', getAdmins)
app.put('/admin', updateAdmin)
app.delete('/admin', deleteAdmin)

//
app.post('/createAccount', createAccount)
app.get('/getAccountDetails', getAccountDetails)
app.get('/getAccountsList', getAccountsList)
app.put('/updateAccount', updateAccount)
app.delete('/deleteAccount', deleteAccount)

// 
app.post('/createExercice', createExercice)
app.get('/getExerciceDetails', getExerciceDetails)
app.get('/getExercicesList', getExercicesList)
app.put('/updateExercice', updateExercice)
app.delete('/deleteExercice', deleteExercice)

//
app.post('/createSession', createSession)
app.get('/getSessionDetails', getSessionDetails)
app.get('/getSessionsList', getSessionsList)
app.put('/updateSession', updateSession)
app.delete('/deleteSession', deleteSession)

//
app.post('/createEcone', createEcone)
app.get('/getEconeDetails', getEconeDetails)
app.put('/updateEcone', updateEcone)
app.delete('/deleteEcone', deleteEcone)

//
app.post('/login', connectToAccount)

//
app.get('/getToken', getToken)
app.get('/validateToken', validateToken)
app.get('/passwordHash', passwordHash)

exports.app = functions.https.onRequest(app)

