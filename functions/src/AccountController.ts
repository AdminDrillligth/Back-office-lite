import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'
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
    let email = "";
    let passwordHash = "";
    let firstName = "";
    let familyName = "";
    let fullName = "";
    let avatarURL = "";
    let birthdate = "";
    let simpleBirthdate = "";
    let address1 = "";
    let address2 = "";
    let zip = "";
    let city = "";
    let region = "";
    let phone = "";
    let comment = "";
    let rights = [];
    let users = [];
    let staff = [];
    let econes = [];
    let trainings = [];
    let videos = [];
    let licensed = 10;
    let warning = false;
    let owner = "";
    let role = "user";
    let id = "";
    let privateOnly = false;
    if(dataBodyOfRequest.id !== undefined){
      id = dataBodyOfRequest.id;
    }else{
      id = newUuid;
    }
    if(dataBodyOfRequest.passwordHash !== undefined){ passwordHash = dataBodyOfRequest.passwordHash}
    if(dataBodyOfRequest.firstName !== undefined){ firstName = dataBodyOfRequest.firstName}
    if(dataBodyOfRequest.familyName !== undefined){ familyName = dataBodyOfRequest.familyName}
    if(dataBodyOfRequest.fullName !== undefined){ fullName = dataBodyOfRequest.fullName}
    if(dataBodyOfRequest.avatarURL !== undefined){ avatarURL = dataBodyOfRequest.avatarURL}

    if(dataBodyOfRequest.birthdate !== undefined){ birthdate = dataBodyOfRequest.birthdate}
    if(dataBodyOfRequest.simpleBirthdate !== undefined){ simpleBirthdate = dataBodyOfRequest.simpleBirthdate}
    if(dataBodyOfRequest.address1 !== undefined){ address1 = dataBodyOfRequest.address1}
    if(dataBodyOfRequest.address2 !== undefined){ address2 = dataBodyOfRequest.address2}
    if(dataBodyOfRequest.zip !== undefined){ zip = dataBodyOfRequest.zip}
    if(dataBodyOfRequest.city !== undefined){ city = dataBodyOfRequest.city}
    if(dataBodyOfRequest.region !== undefined){ region = dataBodyOfRequest.region}
    if(dataBodyOfRequest.phone !== undefined){ phone = dataBodyOfRequest.phone}
    if(dataBodyOfRequest.comment !== undefined){ comment = dataBodyOfRequest.comment}

    if(dataBodyOfRequest.rights !== undefined){ rights = dataBodyOfRequest.rights}
    if(dataBodyOfRequest.users !== undefined){ users = dataBodyOfRequest.users}
    if(dataBodyOfRequest.staff !== undefined){ staff = dataBodyOfRequest.staff}
    if(dataBodyOfRequest.econes !== undefined){ econes = dataBodyOfRequest.econes}
    if(dataBodyOfRequest.trainings !== undefined){ trainings = dataBodyOfRequest.trainings}
    if(dataBodyOfRequest.videos !== undefined){ videos = dataBodyOfRequest.videos}
    if(dataBodyOfRequest.licensed !== undefined){ licensed = dataBodyOfRequest.licensed}
    if(dataBodyOfRequest.warning !== undefined){ warning = dataBodyOfRequest.warning}

    if(dataBodyOfRequest.owner !== undefined){ owner = dataBodyOfRequest.owner}
    if(dataBodyOfRequest.role !== undefined){ role = dataBodyOfRequest.role}
    if(dataBodyOfRequest.privateOnly !== undefined){ privateOnly = dataBodyOfRequest.privateOnly}

    if(dataBodyOfRequest.email){
      email = dataBodyOfRequest.email;
      const userObject = {
        id: id,
        owner:owner,
        role:role,
        email: email,
        passwordHash:passwordHash,
        firstName: firstName,
        familyName: familyName,
        fullName: fullName,
        avatarURL: avatarURL,
        personalInfo: {
            birthdate: birthdate,
            simpleBirthdate: simpleBirthdate,
            address1: address1,
            address2: address2,
            zip: zip,
            city: city,
            region: region,
            phone: phone,
            comment: comment
        },
        privileges: {
            rights: rights
        },
        users:users,
        staff: staff,
        econes: econes,
        trainings: trainings,
        videos: videos,
        licensed: licensed,
        warning:warning,
        date:DateString,
        dateIso:isoDateString,
        update:DateString,
        updateIso:isoDateString,
        privateOnly:privateOnly
        // createdBy:,
        // updatedBy:,

  }

    await entry.doc(userObject.id).set(userObject).then( async (ref:any) => {
      res.status(200).send({
        response: {
          result:'success',
          message:''
        },
        account:userObject,
      });
    })
    

    }else{
      res.status(200).send({
        response: {
          result:'emailError',
          message:'email obligatoire'
        },
      })
    }

  } catch(error:any) {
      res.status(500).send({
        result: 'error',
        message: '',
        error:error.message,
      })
  }
}


const getAccountDetails = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let userId = headers.id;
  let token = headers.token;
  let userDetails :any = '';
  try {
        jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
            if(err) {
              return res.status(200).json({
                response: {
                  result:'expiredTokenError',
                  message:'Votre token a expiré'
                },
                token:token,
              });
            }else {
              let userhandlerProfil = await db.collection('account-handler').where('id', '==', userId).get();
              userhandlerProfil.forEach((doc:any) =>{
              userDetails = doc.data();
                if(userDetails !== ""){
                  return res.status(200).json({
                      response: {
                        result:'success',
                        message:''
                      },
                    account: userDetails
                  });
                }else{
                  return res.status(200).json({
                    response: {
                      result:'noAccountError',
                      message:''
                    },
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
  let idOfUser = headers.id;
  let user:any = [];
  try {
    jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
      if(err) {
        return res.status(200).json({
          response: {
            result:'expiredTokenError',
            message:'Votre token a expiré'
          },
        });
      }else {
        let userhandlerProfil = await db.collection('account-handler').where('id', '==', idOfUser).get();
        userhandlerProfil.forEach( async (doc:any)  =>{
          user = doc.data();
          if(user !== null){
            if(user.role === 'admin'){
              const accounts: any[] = [];
              let UsersOfAccount:any = [];
              const querySnapshot = await db.collection('account-handler').get();
              querySnapshot.forEach((doc: any) => {
                accounts.push({data:doc.data()});
              });
             
              accounts.forEach((account:any)=> {
                let validate = false;
                functions.logger.log("account,account.passwordHash ",account,account.data.passwordHash )
                if(account.data.passwordHash !== ""){
                  validate = true;
                }
                  UsersOfAccount.push({
                    fullName:account.data.fullName,
                    id:account.data.id,
                    email:account.data.email,
                    role:account.data.role,
                    validate: validate
                  })
              });
                return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                    accounts: UsersOfAccount,
                });
            }
            if(user.role === 'owner'){
              const accounts: any[] = [];
              let UsersOfAccount:any = [];
              let userhandlerProfil = await db.collection('account-handler').where('owner', '==', idOfUser).get();
                userhandlerProfil.forEach( async (doc:any)  =>{
                  accounts.push({data:doc.data()})
                })
                accounts.forEach((account:any)=> {
                  UsersOfAccount.push({
                    fullName:account.data.fullName,
                    id:account.data.id,
                    email:account.data.email,
                    role:account.data.role
                  });
              });
                return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                    accounts: UsersOfAccount,
                });
            }
            if(user.role === 'staff'){

            }
            if(user.role === 'user'){

            }
            if(user.role === null || user.role === undefined){
              return res.status(200).json({
                response: {
                  result:'noAccountError',
                  message:''
                },
              });
            }
          }else{
            // get the error response !
            return res.status(200).json({
              response: {
                result:'noAccountError',
                message:''
              },
            });
          }
        })
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
  let idUser =dataBodyOfRequest.id;
  let userDetail :any = '';
  functions.logger.log("ACCOUNT UPDATE DETAILS ",bodyOfRequest.data, 'ID : ',dataBodyOfRequest.id )
   try {
    jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
      if(err) {
        return res.status(200).json({
          response: {
            result:'expiredTokenError',
            message:''
          },
        });
      } else {
          let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();
          userhandlerProfil.forEach((doc:any) =>{
          userDetail = doc.data();
          let idOfUser = doc.id;
          if(userDetail !== ""){
            if(dataBodyOfRequest.email !== undefined){ userDetail.email = dataBodyOfRequest.email }
            if(dataBodyOfRequest.passwordHash !== undefined){ userDetail.passwordHash = dataBodyOfRequest.passwordHash }
            if(dataBodyOfRequest.firstName !== undefined){ userDetail.firstName = dataBodyOfRequest.firstName }
            if(dataBodyOfRequest.familyName !== undefined){ userDetail.familyName = dataBodyOfRequest.familyName }
            if(dataBodyOfRequest.fullName !== undefined){ userDetail.fullName = dataBodyOfRequest.fullName }
            if(dataBodyOfRequest.avatarURL !== undefined){ userDetail.avatarURL = dataBodyOfRequest.avatarURL }
            if(dataBodyOfRequest.role !== undefined){ userDetail.role = dataBodyOfRequest.role }
                if(dataBodyOfRequest.personalInfo !== undefined){
                    if(dataBodyOfRequest.personalInfo.birthdate !== undefined){ userDetail.personalInfo.birthdate = dataBodyOfRequest.personalInfo.birthdate }
                    if(dataBodyOfRequest.personalInfo.simpleBirthdate !== undefined){ userDetail.personalInfo.simpleBirthdate = dataBodyOfRequest.personalInfo.simpleBirthdate }
                    if(dataBodyOfRequest.personalInfo.address1 !== undefined){ userDetail.personalInfo.address1 = dataBodyOfRequest.personalInfo.address1 }
                    if(dataBodyOfRequest.personalInfo.address2 !== undefined){ userDetail.personalInfo.address2 = dataBodyOfRequest.personalInfo.address2 }
                    if(dataBodyOfRequest.personalInfo.zip !== undefined){ userDetail.personalInfo.zip = dataBodyOfRequest.personalInfo.zip }
                    if(dataBodyOfRequest.personalInfo.city !== undefined){ userDetail.personalInfo.city = dataBodyOfRequest.personalInfo.city }
                    if(dataBodyOfRequest.personalInfo.region !== undefined){ userDetail.personalInfo.region = dataBodyOfRequest.personalInfo.region }
                    if(dataBodyOfRequest.personalInfo.phone !== undefined){ userDetail.personalInfo.phone = dataBodyOfRequest.personalInfo.phone }
                    if(dataBodyOfRequest.personalInfo.comment !== undefined){ userDetail.personalInfo.comment = dataBodyOfRequest.personalInfo.comment }
                }
                if(dataBodyOfRequest.privileges !== undefined){
                      if(dataBodyOfRequest.privileges.rights !== undefined){ userDetail.privileges.rights = dataBodyOfRequest.privileges.rights }
                }
            if(dataBodyOfRequest.users !== undefined){ userDetail.users = dataBodyOfRequest.users }
            if(dataBodyOfRequest.staff !== undefined){ userDetail.staff = dataBodyOfRequest.staff }
            if(dataBodyOfRequest.econes !== undefined){ userDetail.econes = dataBodyOfRequest.econes }
            if(dataBodyOfRequest.trainings !== undefined){ userDetail.trainings = dataBodyOfRequest.trainings }
            if(dataBodyOfRequest.videos !== undefined){ userDetail.videos = dataBodyOfRequest.videos }
            if(dataBodyOfRequest.licensed !== undefined){ userDetail.licensed = dataBodyOfRequest.licensed }
            if(dataBodyOfRequest.warning !== undefined){ userDetail.warning = dataBodyOfRequest.warning }
            if(dataBodyOfRequest.privateOnly !== undefined){ userDetail.privateOnly = dataBodyOfRequest.privateOnly }
            if(dataBodyOfRequest.privateFirmwareId !== undefined){ userDetail.privateFirmwareId = dataBodyOfRequest.privateFirmwareId }
            
            

            userDetail.update = DateString;
            userDetail.updateIso = isoDateString;
            functions.logger.log("ACCOUNT UPDATE DETAILS NEW USER DETAIL : ",userDetail )
            const account_handler = db.collection('account-handler');
            account_handler.doc(idOfUser).update(userDetail).then((ref:any) => {
                return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                  account:userDetail
                });
              });
          }else{
            return res.status(200).json({
              response: {
                result:'noUserError',
                message:''
              },
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

export { createAccount, getAccountsList, getAccountDetails, updateAccount, deleteAccount }


