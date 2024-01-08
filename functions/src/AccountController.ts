import { Response } from "express"
import { db } from './config/firebase'
// import * as functions from 'firebase-functions'
import { v4 as uuidv4 } from 'uuid';
var jwt = require("jsonwebtoken");
// var btoa = require('btoa');
var DateString = new Date().toLocaleDateString('en-GB');
var isoDateString = new Date().toISOString();
// var timeNow = new Date().toLocaleTimeString();

// Model de type Admin
// type UsersModel = {
  // email: "xxx@gmail.com",
  // passwordHash:"xxx",
  // firstName: "John",
  // familyName: "Doe",
  // fullName: "John Doe",
  // avatarURL: "",
  // role: "admin",
  // personalInfo: {
  //     birthdate: "",
  //     simpleBirthdate: "",
  //     address1: "",
  //     address2: "",
  //     zip: "",
  //     city: "",
  //     region: "",
  //     phone: "",
  //     comment: ""
  // },
  // privileges: {
  //     rights: []
  // },
  // trainees: [],
  // staff: [],
  // econes: [],
  // trainings: [],
  // videos: [],
  // licensed: 10,
  // warning: false
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


// const authorizationValue = 'Basic ' + window.btoa( username + ':' + password );



const createAccount = async (req: any, res: Response) => {
  let bodyOfRequest = req.body;
  // let dataBodyOfRequest = JSON.parse(bodyOfRequest);
  let dataBodyOfRequest = bodyOfRequest.data
  // let token = bodyOfRequest.token;
  // let decodeds:any;
  let newUuid = uuidv4();
  try {
    const entry = db.collection('account-handler');
    const userObject = {
          id: newUuid,
          email: dataBodyOfRequest.email,
          passwordHash:dataBodyOfRequest.passwordHash,
          firstName: dataBodyOfRequest.firstName,
          familyName: dataBodyOfRequest.familyName,
          fullName: dataBodyOfRequest.fullName,
          avatarURL: dataBodyOfRequest.avatarURL,
          // role: "admin",
          personalInfo: {
              birthdate: dataBodyOfRequest.personalInfo.birthdate,
              simpleBirthdate: dataBodyOfRequest.personalInfo.simpleBirthdate,
              address1: dataBodyOfRequest.personalInfo.address1,
              address2: dataBodyOfRequest.personalInfo.address2,
              zip: dataBodyOfRequest.personalInfo.zip,
              city: dataBodyOfRequest.personalInfo.city,
              region: dataBodyOfRequest.personalInfo.region,
              phone: dataBodyOfRequest.personalInfo.phone,
              comment: dataBodyOfRequest.personalInfo.comment
          },
          privileges: {
              rights: dataBodyOfRequest.privileges.rights
          },
          trainees: dataBodyOfRequest.trainees,
          staff: dataBodyOfRequest.staff,
          econes: dataBodyOfRequest.econes,
          trainings: dataBodyOfRequest.trainings,
          videos: dataBodyOfRequest.videos,
          licensed: dataBodyOfRequest.licensed,
          warning: dataBodyOfRequest.warning,
          date:DateString,
          dateIso:isoDateString,
          update:DateString,
          updateIso:isoDateString,
          // createdBy:,
          // updatedBy:,

    }

    await entry.add(userObject);
    res.status(200).send({
      status: 'success',
      message: 'Utilisateur ajouté avec succés',
      data: dataBodyOfRequest,
      userObject:userObject,
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
const getUsers = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;

  try {
    let decodeds:any;
    const allUsers: any[] = [];
    const querySnapshot = await db.collection('account-handler').get();
    jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
        if(err) {
          decodeds = 'err';
          return res.status(200).json({
            status:'Votre token a expiré',
            token:token,
            decoded:decodeds
          });
        }else {
          decodeds = 'no error';
          querySnapshot.forEach((doc: any) => {
            allUsers.push({data:doc.data(), id: doc.id});
          });
          return res.status(200).json({
            status:'votre requetes est exécutée avec succés',
            allUsers: allUsers,
            token: token,
            decoded: decodeds 
          });
        }
    });
  } catch(error:any) { return res.status(500).json(error.message) }
}



// ON RECUPERE LA LISTE DES ADMINS VIA GET
// REQUEST TEMPLATE
// JUST BEARER TOKEN
const getAccountDetails = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let username = headers.username;
  let token = headers.token;
  let userDetails :any = '';
  try {
    let decodeds: any;
        jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
            if(err) {
              decodeds = 'err';
              return res.status(200).json({
                status:'Votre token a expiré',
                token:token,
                decoded:decodeds
              });
            }else {

              decodeds = 'no error';
              let userhandlerProfil = await db.collection('account-handler').where('email', '==', username).get();
              userhandlerProfil.forEach((doc:any) =>{
              userDetails = doc.data();   
                if(userDetails !== ""){
                  let idOfUser = doc.id;  
                  return res.status(200).json({
                    status:'votre requetes est exécutée avec succés',
                    userDetails: userDetails,
                    idOfUser:idOfUser,
                    decoded: decodeds 
                  });
                }else{
                  return res.status(200).json({
                    status:'pas de compte associé',
                    decoded: decodeds 
                  });
                }
              })
            }
       });
    
  } catch(error:any) { return res.status(500).json(error.message) }
}

const getAccountsList = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  try {
    let decodeds: any;
    const allUsers: any[] = [];
    const querySnapshot = await db.collection('account-handler').get();
        jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
            if(err) {
              decodeds = 'err';
              return res.status(200).json({
                status:'Votre token a expiré',
                token:token,
                decoded:decodeds
              });
            }else {
              decodeds = 'no error';
              querySnapshot.forEach((doc: any) => {
                 allUsers.push({data:doc.data(), id: doc.id});
              });
              return res.status(200).json({
                status:'votre requetes est exécutée avec succés',
                allUsers: allUsers,
                token: token,
                decoded: decodeds 
              });
            }
       });
  }
  catch(error:any) { return res.status(500).json(error.message)}
}


// ICI ON UPDATE AVEC LA FONCTION UPDATE ADMIN VIA PATCH
// REQUEST TEMPLATE

const updateAccount = async (req:any, res: any) => {
  let bodyOfRequest = req.body;
  let dataBodyOfRequest = bodyOfRequest.data;
  let headers = req.headers;
  let token = headers.token;
  let userDetail :any = '';
  let decodeds: any;
   try {

    jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
      if(err) {
        decodeds = 'err';
        return res.status(200).json({
          status:'Votre token a expiré',
          token:token,
          decoded:decodeds
        });
      }else {
          let userhandlerProfil = await db.collection('account-handler').where('email', '==', dataBodyOfRequest.email).get();
          userhandlerProfil.forEach((doc:any) =>{
          userDetail = doc.data();   
          if(userDetail !== ""){
            let idOfUser = doc.id;  
            // if(dataBodyOfRequest.email !== undefined){ userDetail.email = dataBodyOfRequest.email }
            if(dataBodyOfRequest.passwordHash !== undefined){ userDetail.passwordHash = dataBodyOfRequest.passwordHash }
            if(dataBodyOfRequest.firstName !== undefined){ userDetail.firstName = dataBodyOfRequest.firstName }
            if(dataBodyOfRequest.familyName !== undefined){ userDetail.familyName = dataBodyOfRequest.familyName }
            if(dataBodyOfRequest.fullName !== undefined){ userDetail.fullName = dataBodyOfRequest.fullName }
            if(dataBodyOfRequest.avatarURL !== undefined){ userDetail.avatarURL = dataBodyOfRequest.avatarURL }
            if(dataBodyOfRequest.role !== undefined){ userDetail.role = dataBodyOfRequest.role }

            if(dataBodyOfRequest.personalInfo.birthdate !== undefined){ userDetail.personalInfo.birthdate = dataBodyOfRequest.personalInfo.birthdate }
            if(dataBodyOfRequest.personalInfo.simpleBirthdate !== undefined){ userDetail.personalInfo.simpleBirthdate = dataBodyOfRequest.personalInfo.simpleBirthdate }
            if(dataBodyOfRequest.personalInfo.address1 !== undefined){ userDetail.personalInfo.address1 = dataBodyOfRequest.personalInfo.address1 }
            if(dataBodyOfRequest.personalInfo.address2 !== undefined){ userDetail.personalInfo.address2 = dataBodyOfRequest.personalInfo.address2 }
            if(dataBodyOfRequest.personalInfo.zip !== undefined){ userDetail.personalInfo.zip = dataBodyOfRequest.personalInfo.zip }
            if(dataBodyOfRequest.personalInfo.city !== undefined){ userDetail.personalInfo.city = dataBodyOfRequest.personalInfo.city }
            if(dataBodyOfRequest.personalInfo.region !== undefined){ userDetail.personalInfo.region = dataBodyOfRequest.personalInfo.region }
            if(dataBodyOfRequest.personalInfo.phone !== undefined){ userDetail.personalInfo.phone = dataBodyOfRequest.personalInfo.phone }
            if(dataBodyOfRequest.personalInfo.comment !== undefined){ userDetail.personalInfo.comment = dataBodyOfRequest.personalInfo.comment }
            if(dataBodyOfRequest.privileges.rights !== undefined){ userDetail.privileges.rights = dataBodyOfRequest.privileges.rights }

            if(dataBodyOfRequest.trainees !== undefined){ userDetail.trainees = dataBodyOfRequest.trainees }
            if(dataBodyOfRequest.staff !== undefined){ userDetail.staff = dataBodyOfRequest.staff }
            if(dataBodyOfRequest.econes !== undefined){ userDetail.econes = dataBodyOfRequest.econes }
            if(dataBodyOfRequest.trainings !== undefined){ userDetail.trainings = dataBodyOfRequest.trainings }
            if(dataBodyOfRequest.videos !== undefined){ userDetail.videos = dataBodyOfRequest.videos }
            if(dataBodyOfRequest.licensed !== undefined){ userDetail.licensed = dataBodyOfRequest.licensed }
            if(dataBodyOfRequest.warning !== undefined){ userDetail.warning = dataBodyOfRequest.warning }
            userDetail.update = DateString;
            userDetail.updateIso = isoDateString;
            const account_handler = db.collection('account-handler'); 
            account_handler.doc(idOfUser).update(userDetail).then((ref:any) => {
                return res.status(200).json({
                  status: 'success',
                  message: 'Update du compte validé',
                  dataBodyOfRequest:dataBodyOfRequest,
                  userDetail:userDetail,
                  idOfUser:idOfUser
                });
              });
          }else{
            return res.status(200).json({
              status: 'error',
              message: 'pas d\'utilisateur correspondant',
              userDetail:userDetail,
            });

          }
        });
      }
    });

   }
  catch(error:any) { return res.status(500).json(error.message) }
}

const deleteAccount = async (req: any, res: Response) => {
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

export { createAccount, getUsers, getAccountsList, getAccountDetails, updateAccount, deleteAccount }


