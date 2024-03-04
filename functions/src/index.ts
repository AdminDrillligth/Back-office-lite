
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
import { createExercise, getExerciseDetails, getExercisesList, updateExercise, deleteExercise } from './exercisesController';
import { testgetSessionsList, createSession, getSessionDetails, getSessionsList, updateSession, deleteSession } from './sessionsController';
import { getToken, validateToken, passwordHash } from './tokenController';
import { createResult, getResultsList, createResultOld } from './resultsController';
import { createFirmware, getFirmware, getFirmwaresList, getFirmwareDetails, updateGlobalFirmware } from './firmwareController';

const fileMiddleware = require('express-multipart-file-parser')

// const multer = require('multer');
// const admin = require('firebase-admin');
// const serviceAccount = require('../drilllight-bf468e9e715e.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://drilllight-default-rtdb.europe-west1.firebasedatabase.app"
// });

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


const app = express();
//

app.use(cors({ origin: ['http://localhost:4200','https://drilllight.web.app','http://localhost:8100', 'capacitor://localhost','https://localhost']}));
app.use(express.json());
// app.use(fileupload());


// app.use(express.static('public'));
app.use(fileMiddleware)
app.get("/",(req, res, next) => {
  res.status(200).send('ON DEMARRE DRILLLIGHT API !')
});

app.post('/file', (req:any, res:any) => {
  const {
    fieldname,
    originalname,
    encoding,
    mimetype,
    buffer,
  } = req.files[0]
  // let files = req.files
  // let bufferOriginal = Buffer.from(JSON.parse(buffer).data);
  return res.status(200).json({
    status:'votre requetes est exécutée avec succés',
    fieldname:fieldname,
    filename:originalname,
    encoding:encoding,
    mimetype:mimetype,
    buffer:buffer.toString()
    // files:files
  });
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
app.post('/createExercise', createExercise)
app.get('/getExerciseDetails', getExerciseDetails)
app.get('/getExercisesList', getExercisesList)
app.put('/updateExercise', updateExercise)
app.delete('/deleteExercise', deleteExercise)

//
app.post('/createSession', createSession)
app.get('/getSessionDetails', getSessionDetails)
app.get('/testgetSessionsList', testgetSessionsList)
app.get('/getSessionsList', getSessionsList)
app.put('/updateSession', updateSession)
app.delete('/deleteSession', deleteSession)

//
app.post('/createEcone', createEcone)
app.get('/getEconeDetails', getEconeDetails)
app.put('/updateEcone', updateEcone)
app.delete('/deleteEcone', deleteEcone)

//
app.post('/createResult', createResult)
app.get('/getResultsList', getResultsList)
app.post('/createResultOld', createResultOld)

//
app.post('/createFirmware', createFirmware)
app.get('/getFirmware', getFirmware)
app.get('/getFirmwaresList', getFirmwaresList)
app.get('/getFirmwareDetails', getFirmwareDetails)
app.post('/updateGlobalFirmware', updateGlobalFirmware)

//
app.post('/login', connectToAccount)

//
app.get('/getToken', getToken)
app.get('/validateToken', validateToken)
app.get('/passwordHash', passwordHash)

exports.app = functions.https.onRequest(app)

