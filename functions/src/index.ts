
// https://blog.logrocket.com/building-rest-api-firebase-cloud-functions-typescript-firestore/#writing-first-cloud-function

import * as functions from 'firebase-functions'
import * as express from 'express'
import { addEntry, getAllEntries, updateEntry, deleteEntry } from './entryController'
import { addAdmin, getAdmins, updateAdmin, deleteAdmin } from './adminsController'
import { addUser, getUsers, updateUser, deleteUser } from './usersController'


const app = express()

//
app.get('/', (req, res) => res.status(200).send('ON DEMARRE DRILLLIGHT API !'))
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

exports.app = functions.https.onRequest(app)

