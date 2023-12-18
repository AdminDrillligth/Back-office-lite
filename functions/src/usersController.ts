import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'
import { v4 as uuidv4 } from 'uuid';


var DateString = new Date().toLocaleDateString();
var isoDateString = new Date().toISOString();
// var timeNow = new Date().toLocaleTimeString();

// Model de type Admin
type UsersModel = {
  firstName: string,
  avatarImages:string,
  email:string,
  asAdmin:boolean,
  personalInfos: {
    familyName:string,
    zip:string,
    address:string,
    simpleBirthdate:string,
    phone:string,
    city:string,
    comment:string,
    birthdate:string
  } ,
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
  lastConnexion:string,
  lastCodateIso:string,
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

const addUser = async (req: any, res: Response) => {
  let bodyOfRequest = req.body;
  let dataBodyOfRequest = bodyOfRequest.data; 
  let newUuid = uuidv4();
  try {
    const entry = db.collection('account-handler')
    const userObject = {
      id: newUuid, firstName:dataBodyOfRequest.firstName, avatarImages:'',
      email:dataBodyOfRequest.email, asAdmin:dataBodyOfRequest.asAdmin,
      personalInfos:{ familyName:dataBodyOfRequest.familyName, zip:dataBodyOfRequest.zip, address:dataBodyOfRequest.address, simpleBirthdate:dataBodyOfRequest.simpleBirthdate, phone:dataBodyOfRequest.phone, city:dataBodyOfRequest.city, comment:dataBodyOfRequest.comment, birthdate:dataBodyOfRequest.birthdate },
      privileges:{ rights:dataBodyOfRequest.rights },
      traineds:[], staff:[], econes:[],
      trainings:[], videos:[], licencied:10,
      date:DateString, dateIso:isoDateString,
      update:'', lastConnexion:'', lastCodateIso:'', warning:false
    }
    functions.logger.log("DATA : ! ", userObject)
    await entry.add(userObject)
    res.status(200).send({
      status: 'success',
      message: 'entry Admin added successfully',
      data: dataBodyOfRequest,
      userObject:userObject
    });
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
    let reqs =  req.query;
    let token = reqs.token;
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
        // let ifAdmin = doc.data();
        allAdmins.push({data:doc.data(), id: doc.id});
        functions.logger.log("DATA : ! ", allAdmins);
        functions.logger.log("DATA PARAMS : ! ", token);
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

const updateUser = async (req:any, res: Response) => {
  let reqs = req.query;
  let body = req.body;
  let id = reqs.adminId;
   try {
    let userCollection = db.collection('account-handler').doc(id)
    const currentData = (await userCollection.get()).data() || {}
    const userObject = {
          firstName: body.firstName || currentData.firstName,
          avatarImages: body.avatarImages || currentData.avatarImages,
          email: body.email || currentData.email,
          asAdmin: body.asAdmin|| currentData.asAdmin,
          personalInfos:{
            familyName:body.personalInfos.familyName || currentData.personalInfos.familyName,
            zip:body.personalInfos.zip || currentData.personalInfos.zip,
            address:body.personalInfos.address || currentData.personalInfos.address,
            simplebirthdate:body.personalInfos.simplebirthdate || currentData.personalInfos.simplebirthdate,
            phone:body.personalInfos.phone || currentData.personalInfos.phone,
            city:body.personalInfos.city || currentData.personalInfos.city,
            comment:body.personalInfos.comment || currentData.personalInfos.comment,
            birthdate:body.personalInfos.birthdate || currentData.personalInfos.birthdate
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
