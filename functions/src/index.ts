
// https://blog.logrocket.com/building-rest-api-firebase-cloud-functions-typescript-firestore/#writing-first-cloud-function
var cors = require('cors');
import * as functions from 'firebase-functions';
import * as express from 'express';
// var router = express.Router();
import { addEntry, getAllEntries, updateEntry, deleteEntry } from './entryController';
import { addAdmin, getAdmins, updateAdmin, deleteAdmin } from './adminsController';
import { addUser, getUsers, updateUser, deleteUser } from './usersController';
import { addEcone, getEcones, updateEcone, deleteEcone } from './econesController';
import { connectToAccount } from './loggerController';
// var methods = require("./methods");

const app = express()
//

app.use(cors({ origin: ['http://localhost:4200']}));
app.get("/",(req, res, next) => {
  res.status(200).send('ON DEMARRE DRILLLIGHT API !')
});
// 
//
app.post('/entries', addEntry)
app.get('/entries', getAllEntries)
app.patch('/entries/:entryId', updateEntry)
app.delete('/entries/:entryId', deleteEntry)
//
app.post('/admin', addAdmin)
app.get('/admin', getAdmins)
app.patch('/admin', updateAdmin)
app.delete('/admin', deleteAdmin)
//
app.post('/user', addUser)
app.get('/user', getUsers)
app.patch('/user', updateUser)
app.delete('/user', deleteUser)
//
app.post('/econe', addEcone)
app.get('/econe', getEcones)
app.patch('/econe', updateEcone)
app.delete('/econe', deleteEcone)
//
app.post('/login', connectToAccount)

exports.app = functions.https.onRequest(app)

