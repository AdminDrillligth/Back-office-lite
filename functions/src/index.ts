
// https://blog.logrocket.com/building-rest-api-firebase-cloud-functions-typescript-firestore/#writing-first-cloud-function

import * as functions from 'firebase-functions';
import * as express from 'express';
var router = express.Router();
import { addEntry, getAllEntries, updateEntry, deleteEntry } from './entryController';
import { addAdmin, getAdmins, updateAdmin, deleteAdmin } from './adminsController';
import { addUser, getUsers, updateUser, deleteUser } from './usersController';
import { addEcone, getEcones, updateEcone, deleteEcone } from './econesController';
// var methods = require("./methods");

const app = express()

//
// app.get('/', (req, res) => res.status(200).send('ON DEMARRE DRILLLIGHT API !'))

app.get("/",(req, res, next) => {
  res.status(200).send('ON DEMARRE DRILLLIGHT API !')
});

//
router.post('/entries', addEntry)
router.get('/entries', getAllEntries)
router.patch('/entries/:entryId', updateEntry)
router.delete('/entries/:entryId', deleteEntry)
//
router.post('/admin', addAdmin)
router.get('/admin', getAdmins)
router.patch('/admin', updateAdmin)
router.delete('/admin', deleteAdmin)
//

router.post('/user', addUser)
router.get('/user', getUsers)
router.patch('/user', updateUser)
router.delete('/user', deleteUser)


router.post('/econe', addEcone)
router.get('/econe', getEcones)
router.patch('/econe', updateEcone)
app.delete('/econe', deleteEcone)

exports.app = functions.https.onRequest(app)

