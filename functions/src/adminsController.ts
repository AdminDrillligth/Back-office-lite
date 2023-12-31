//ADMIN PAGE
// GESTION DES COMPTES ADMINISTEURS
// CRUD

// 
import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'
// import { v4 as uuidv4 } from 'uuid';
var jwt = require("jsonwebtoken");
// Model to SET an User Type Admin
// type AdminModel = {
//   name: string, // Required
//   avatarimages:string, //
//   email:string, // Required
//   asAdmin:boolean, //
//   personalinfos:{
//     firstname:string, // Required
//     zip:string, 
//     address:string,
//     simplebirthdate:string,
//     phone:string,
//     city:string,
//     comment:string,
//     birthdate:string
//   },
//   privileges:{ role:'', rights:string // required
//   },
//   traineds:[],
//   staff:[],
//   econes:[],
//   trainings:[],
//   videos:[],
//   licencied:number,
//   date: string,
//   dateIso: string,
//   uuid:string,
//   update:string,
//   lastconnexion:string,
//   lastcodateIso:string,
//   warning:boolean
// }

// Model De requests
// type Request = { body: any, params: { adminId: string }}
  
// ON INSERE UN ADMIN EN BASE VIA POST
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

const addAdmin = async (req: any, res: Response) => {
  let bodyOfRequest = req.body;
  let dataBodyOfRequest = bodyOfRequest.data; 
  // let newUuid = uuidv4();
  // const {
  //   name, 
  // avatarimages, 
  // email,
  // //   asAdmin,
  // //   personalinfos:{ 
  //   firstname, 
  //   zip, 
  //   address, 
  //   simplebirthdate, 
  //   phone, 
  //   city, 
  //   comment, 
  //   birthdate },
  // //   privileges:{ rights },
  // //   traineds,
  //  staff,
  //   econes,
  // //   trainings, 
  // videos, 
  // licencied,
  // //   date, 
  // dateIso,
  // //   update, 
  // lastconnexion, 
  // lastcodateIso, 
  // warning
  // } = dataBodyOfRequest
  try {
  //   const entry = db.collection('account-handler')
  //   const adminObject = {
  //     role:'Administrateur',
  //     id: entry.id, name:dataBodyOfRequest.firstName, avatarImages:'',
  //     email:dataBodyOfRequest.email, asAdmin:,
  //     personalinfos:{ firstname:dataBodyOfRequest.firstName, zip, address, simplebirthdate, phone, city, comment, birthdate },
  //     privileges:{ rights },
  //     traineds, staff, econes,
  //     trainings, videos, licencied,
  //     date, dateIso, newUuid,
  //     update, lastconnexion, lastcodateIso, warning
  //   }
  //   await entry.add(adminObject)
    res.status(200).send({
      status: 'success',
      message: 'entry Admin added successfully',
      data: dataBodyOfRequest
    })
  } catch(error:any) {
      res.status(500).json(error.message)
  }
}

// ON RECUPERE LA LISTE DES ADMINS VIA GET
// REQUEST TEMPLATE
// JUST BEARER TOKEN
const getAdmins = async (req: any, res: Response) => {
  try {
    let reqs =  req.query
    let token = reqs.token
    let decodeds:any;
    const allAdmins: any[] = [];
    const querySnapshot = await db.collection('account-handler').get();
    jwt.verify(token, 'secret', { expiresIn: '1h' },  function(err:any, decoded:any) {
        if(err){
          functions.logger.log("DATA DECODED ERROR: ! ", err)
          decodeds = 'err';
        }else{
          functions.logger.log("DATA DECODED NO ERROR: ! ", decoded)
          decodeds = 'no error';
        }
    });
    querySnapshot.forEach((doc: any) => {
      let ifAdmin = doc.data();
      if(ifAdmin.asAdmin == true){
        allAdmins.push({data:doc.data(), id: doc.id})
        functions.logger.log("DATA : ! ", allAdmins)
        functions.logger.log("DATA PARAMS : ! ", token)
      }
    });
    return res.status(200).json({allAdmins :allAdmins, decoded:decodeds });
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

const updateAdmin = async (req:any, res: Response) => {
  let reqs = req.query;
  let body = req.body;
  let id = reqs.adminId;
   try {

    let adminCollection = db.collection('account-handler').doc(id)
    const currentData = (await adminCollection.get()).data() || {}
    const adminObject = {
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

  await adminCollection.set(adminObject).catch((error:any) => {
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
      adminObject: adminObject
    })
   }
  catch(error:any) { return res.status(500).json(error.message) }
}

const deleteAdmin = async (req: any, res: Response) => {
  let reqs = req.query;
  let id = reqs.adminId;
  try {
    const adminCollection = db.collection('account-handler').doc(id)
    await adminCollection.delete().catch((error:any) => {
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

export { addAdmin, getAdmins, updateAdmin, deleteAdmin }
