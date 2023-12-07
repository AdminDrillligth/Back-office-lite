
// https://blog.logrocket.com/building-rest-api-firebase-cloud-functions-typescript-firestore/#writing-first-cloud-function

import * as functions from 'firebase-functions'
import * as express from 'express'
import { addEntry, getAllEntries, updateEntry, deleteEntry } from './entryController'
import { addAdmin } from './adminController'

const app = express()

app.get('/', (req, res) => res.status(200).send('ON DEMARRE DRILLLIGHT API !'))
app.post('/entries', addEntry)
app.get('/entries', getAllEntries)
app.patch('/entries/:entryId', updateEntry)
app.delete('/entries/:entryId', deleteEntry)

app.post('/admin', addAdmin)


exports.app = functions.https.onRequest(app)
