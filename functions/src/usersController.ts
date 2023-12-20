import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'
import { v4 as uuidv4 } from 'uuid';
var jwt = require("jsonwebtoken");

var DateString = new Date().toLocaleDateString();
var isoDateString = new Date().toISOString();
// var timeNow = new Date().toLocaleTimeString();

// Model de type Admin
// type UsersModel = {
//   firstName: string,
//   avatarImages:string,
//   email:string,
//   asAdmin:boolean,
//   personalInfos: {
//     familyName:string,
//     zip:string,
//     address:string,
//     simpleBirthdate:string,
//     phone:string,
//     city:string,
//     comment:string,
//     birthdate:string
//   } ,
//   privileges:{ role:'', rights:string },
//   traineds:[],
//   staff:[],
//   econes:[],
//   trainings:[],
//   videos:[],
//   //   applicationVersion:string,
//   licencied:number,
//   date: string,
//   dateIso: string,
//   uuid:string,
//   update:string,
//   lastConnexion:string,
//   lastCodateIso:string,
//   warning:boolean
// }

// Model De requests
// type Request = { body: UsersModel, params: { userId: string }}
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
      message: 'Utilisateur ajouté avec succés',
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
const getUsers = async (req: any, res: Response) => {
  try {
    let reqs =  req.query;
    let token = reqs.token;
    let decodeds:any;
    const allUsers: any[] = [];
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
        allUsers.push({data:doc.data(), id: doc.id});
        functions.logger.log("DATA : ! ", allUsers);
        // functions.logger.log("DATA PARAMS : ! ", token);
    });
    return res.status(200).json({
      status:'succes',
      allUsers :allUsers,
      decoded:decodeds 
      });
  } catch(error:any) { return res.status(500).json(error.message) }
}

// ICI ON UPDATE AVEC LA FONCTION UPDATE ADMIN VIA PATCH
// REQUEST TEMPLATE

const updateUser = async (req:any, res: Response) => {
  let body = req.body;
  let dataUser = body.data;
  let token = body.token;
  let userDetail :any = '';
   try {
    let userCollection = await db.collection('account-handler').where('email', '==', dataUser.email).get();
    // if(userCollection.length !== 0){
      userCollection.forEach((doc:any) =>{
        userDetail = doc.data();
          jwt.verify(token, 'secret', { expiresIn: '1h' },  function(err:any, decoded:any) {
            if (err) {
              return res.status(200).json({
                status: 'success',
                message: 'Yo just get ERROR the token',
                token: token,
                err: err
              });
            }else{
              // Details
              if(userDetail.asAdmin == false){
                userDetail.firstName = dataUser.firstName;
                userDetail.email = dataUser.email;
                // Personnal INFOS
                userDetail.personalInfos.address = dataUser.address;
                userDetail.personalInfos.zip = dataUser.zip;
                userDetail.personalInfos.city = dataUser.city;
                userDetail.personalInfos.comment = dataUser.comment;
                userDetail.personalInfos.simpleBirthdate = dataUser.simpleBirthdate;
                userDetail.personalInfos.birthdate = dataUser.birthdate;
                userDetail.personalInfos.phone = dataUser.phone;
                // PRIVILEGES
                userDetail.privileges.rights = dataUser.rights;
                userDetail.asAdmin = dataUser.asAdmin;
                userDetail.licencied = dataUser.licences;
                //
                userDetail.update = DateString;
                userDetail.warning = dataUser.warning;
                //
                userDetail.staff = dataUser.staff;
                userDetail.traineds = dataUser.traineds;
                userDetail.econes = dataUser.econes;
                userDetail.trainings = dataUser.trainings;
                userDetail.videos = dataUser.videos;
              }else{
                // ADMIN PART 
                // Détails 
                userDetail.firstName = dataUser.firstName;
                userDetail.email = dataUser.email;
                // Personnal INFOS
                userDetail.personalInfos.address = dataUser.address;
                userDetail.personalInfos.zip = dataUser.zip;
                userDetail.personalInfos.city = dataUser.city;
                userDetail.personalInfos.comment = dataUser.comment;
                userDetail.personalInfos.simpleBirthdate = dataUser.simpleBirthdate;
                userDetail.personalInfos.birthdate = dataUser.birthdate;
                userDetail.personalInfos.phone = dataUser.phone;
                // PRIVILEGES
                userDetail.privileges.rights = dataUser.rights;
                userDetail.asAdmin = dataUser.asAdmin;
                // userDetail.licencied = dataUser.licences;
                //
                userDetail.update = DateString;
                userDetail.warning = dataUser.warning;
                // 
                userDetail.staff = dataUser.staff;
                userDetail.traineds = dataUser.traineds;
                userDetail.econes = dataUser.econes;
                userDetail.trainings = dataUser.trainings;
                userDetail.videos = dataUser.videos;
              }
              
              
              return res.status(200).json({
                status: 'success',
                message: 'Yo just get the token',
                emailUser:dataUser.email,
                token:token,
                dataUser:dataUser,
                user:userDetail,
              });
            }
          });
      });
  // await userCollection.set(userObject).catch((error:any) => {
  //     return res.status(400).json({
  //       status: 'error',
  //       message: error.message
  //     })
  //   })

    return res.status(200).json({
      status: 'success',
      message: 'UPDATE USER updated successfully',
      body:body,
      // currentData: currentData,
      // adminObject: userObject
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
