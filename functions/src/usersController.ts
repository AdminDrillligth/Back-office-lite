import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'
import { v4 as uuidv4 } from 'uuid';

// Model de type Admin
type UsersModel = {
  firstName: string,
  avatarImages:string,
  email:string,
  asAdmin:boolean,
  personalInfos:{
    familyName:string,
    zip:string,
    address:string,
    simplebirthdate:string,
    phone:string,
    city:string,
    comment:string,
    birthdate:string
  },
  privileges:{ role:'', rights:string },
  traineds:[],
  staff:[],
  econes:[],
  trainings:[],
  videos:[],
  //   applicationVersion:string,
  licencied:number,
  date: string,
  dateIso: string,
  uuid:string,
  update:string,
  lastconnexion:string,
  lastcodateIso:string,
  warning:boolean
}

// Model De requests
type Request = { body: UsersModel, params: { userId: string }}
// ON INSERE UN USER EN BASE VIA POST
// REQUEST TEMPLATE
// {
//   "name": "", "avatarimages": "",
//   "email":"",
//   "asAdmin":true,
//   "personalinfos":{ "firstname":"", "zip":"","address":"","simplebirthdate":"", "phone":"","city":"","comment":"","birthdate":""},
//   "privileges":{"rights":""},
//   "traineds":[], "staff":[],"econes":[],"trainings":[], "videos":[],
//   "licencied":10,"date":"", "dateIso":"", "uuid":"","update":"",
//   "lastconnexion":"","lastcodateIso":"", "warning":false
// }

const addUser = async (req: Request, res: Response) => {
  let newUuid = uuidv4();
  const {
    name, avatarimages, email,
    asAdmin,
    personalinfos:{ firstname, zip, address, simplebirthdate, phone, city, comment, birthdate },
    privileges:{role, rights },
    traineds, staff, econes,
    trainings, videos, licencied,
    date, dateIso,
    update, lastconnexion, lastcodateIso, warning
  } = req.body
  try {
    const entry = db.collection('account-handler')
    const userObject = {
      role:'',
      id: entry.id, name, avatarimages,
      email, asAdmin,
      personalinfos:{ firstname, zip, address, simplebirthdate, phone, city, comment, birthdate },
      privileges:{role:'Customer', rights },
      traineds, staff, econes,
      trainings, videos, licencied,
      date, dateIso, newUuid,
      update, lastconnexion, lastcodateIso, warning
    }
    await entry.add(userObject)
    res.status(200).send({
      status: 'success',
      message: 'entry Admin added successfully',
      data: userObject,
    })
  } catch(error:any) {
      res.status(500).send({
        status: 'Erreur lors du traitement des données',
        message: 'Une erreur est survenue, vérifiez la validité du fomulaire',
        messageSub: 'erreur Code 500 veuillez reéssayer',
        error:error.message,
      })
  }
}

// ON RECUPERE LA LISTE DES ADMINS VIA GET
// REQUEST TEMPLATE
// JUST BEARER TOKEN
const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers: any[] = []
    const querySnapshot = await db.collection('account-handler').get()
    querySnapshot.forEach((doc: any) => {
      let ifAdmin = doc.data();
      if(ifAdmin.asAdmin == false){
        allUsers.push({data:doc.data(), id: doc.id})
        functions.logger.log("DATA : ! ", allUsers)
      }
    })
    return res.status(200).json(allUsers)
  } catch(error:any) { return res.status(500).json(error.message) }
}

// ICI ON UPDATE AVEC LA FONCTION UPDATE ADMIN VIA PATCH
// REQUEST TEMPLATE
// {
//   "name": "", "avatarimages": "",
//   "email":"",
//   "asAdmin":true,
//   "personalinfos":{ "firstname":"", "zip":"","address":"","simplebirthdate":"", "phone":"","city":"","comment":"","birthdate":""},
//   "privileges":{"rights":""},
//   "traineds":[], "staff":[],"econes":[],"trainings":[], "videos":[],
//   "licencied":10,"date":"", "dateIso":"", "uuid":"","update":"",
//   "lastconnexion":"","lastcodateIso":"", "warning":false
// }

const updateUser = async (req:any, res: Response) => {
  let reqs = req.query;
  let body = req.body;
  let id = reqs.adminId;
   try {
    let userCollection = db.collection('account-handler').doc(id)
    const currentData = (await userCollection.get()).data() || {}
    const userObject = {
          name: body.name || currentData.name,
          avatarimages: body.avatarimages || currentData.avatarimages,
          email: body.email || currentData.email,
          asAdmin: body.asAdmin|| currentData.asAdmin,
          personalinfos:{
            firstname:body.personalinfos.firstname || currentData.personalinfos.firstname,
            zip:body.personalinfos.zip || currentData.personalinfos.zip,
            address:body.personalinfos.address || currentData.personalinfos.address,
            simplebirthdate:body.personalinfos.simplebirthdate || currentData.personalinfos.simplebirthdate,
            phone:body.personalinfos.phone || currentData.personalinfos.phone,
            city:body.personalinfos.city || currentData.personalinfos.city,
            comment:body.personalinfos.comment || currentData.personalinfos.comment,
            birthdate:body.personalinfos.birthdate || currentData.personalinfos.birthdate
          },
          privileges:{
            rights: body.privileges.rights|| currentData.privileges.rights|| ''
           },
          traineds:body.traineds || currentData.traineds|| [],
          staff:body.staff || currentData.staff || [],
          econes:body.econes || currentData.econes || [],
          trainings:body.trainings||currentData.trainings|| [],
          videos:body.videos||currentData.videos || [],
          licencied:body.licencied||currentData.licencied|| 10,
          date:body.date||currentData.date || '',
          dateIso:body.dateIso||currentData.dateIso,
          uuid:body.uuid||currentData.uuid,
          update:body.update||currentData.update,
          lastconnexion:body.lastconnexion||currentData.lastconnexion,
          lastcodateIso:body.lastcodateIso||currentData.lastcodateIso,
          warning:body.warning||currentData.warning
    }

  await userCollection.set(userObject).catch((error:any) => {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'entry ADMIN updated successfully',
      id:id,
      name:body.name,
      currentData: currentData,
      adminObject: userObject
    })
   }
  catch(error:any) { return res.status(500).json(error.message) }
}

const deleteUser = async (req: any, res: Response) => {
  let reqs = req.query;
  let id = reqs.adminId;
  try {
    const userCollection = db.collection('account-handler').doc(id)
    await userCollection.delete().catch((error:any) => {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    })
    return res.status(200).json({
      status: 'success',
      message: 'entry deleted successfully',
    })
  }
  catch(error:any) { return res.status(500).json(error.message) }
}

export { addUser, getUsers, updateUser, deleteUser }
