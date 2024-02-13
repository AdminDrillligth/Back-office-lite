// import { Response } from "express"
import { db } from './config/firebase'
// // import * as functions from 'firebase-functions'
import { v4 as uuidv4 } from 'uuid';
var jwt = require("jsonwebtoken");
// // var btoa = require('btoa');
// var DateString = new Date().toLocaleDateString('en-GB');
var isoDateString = new Date().toISOString();
// // var timeNow = new Date().toLocaleTimeString();


const createFirmware = async (req: any, res: any) => {

  let newUuid = uuidv4();
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  let body = req.body;
  const json = JSON.parse(body);
  // let idUser = json.id;
  // let userDetail :any = '';
  let firmwareData = json.firmwareData;
  // let privated = json.privated;
  // let BuildNumber = 1;
  let globalHandler :any = [];

  try {
  //  if(privated == false){
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
    const querySnapshotGlobalHandler = await db.collection('global_handler').get();
    querySnapshotGlobalHandler.forEach((doc: any) => {
      globalHandler.push(doc.data());
    });
    // BuildNumber = globalHandler[0].lastFirmwareBuildNumber +1;
    globalHandler[0].publicFirmwareId = newUuid;
    // globalHandler[0].publicFirmwareBuildNumber = globalHandler[0].lastFirmwareBuildNumber +1;
    // globalHandler[0].lastFirmwareBuildNumber = globalHandler[0].lastFirmwareBuildNumber +1;
    let firmwareObject = {
      id:newUuid,
      // buildNumber:BuildNumber,
      version:firmwareData.version,
      description:firmwareData.comment,
      creationDate:isoDateString,
      firmwareData:firmwareData.base64,
    };
      const entry = db.collection('firmware-handler')
      await entry.doc(newUuid).set(firmwareObject).then( async (ref:any) => {
        const global_handler = db.collection('global_handler');
        global_handler.doc("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").set(globalHandler[0]);
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },        
          token: token,
          // BuildNumber:BuildNumber,
          id:json.id,
          // private:privated,
          newUuid:newUuid,
          firmwareObject:firmwareObject,
          globalHandler:globalHandler
        });
      });
      }
    })

  //  }
  //  else{
  //   if(idUser !== undefined){

  //     let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();
  //     userhandlerProfil.forEach(async (doc:any) =>{
  //         userDetail = doc.data();
  //     });

  //     const querySnapshotGlobalHandler = await db.collection('global_handler').get();
  //     querySnapshotGlobalHandler.forEach((doc: any) => {
  //       globalHandler.push(doc.data());
  //     });
  //     userDetail.privateFirmwareId = newUuid;
  //     // globalHandler[0].lastFirmwareBuildNumber = globalHandler[0].lastFirmwareBuildNumber +1;
  //     let firmwareObject = {
  //       id:newUuid,
  //       // buildNumber:BuildNumber,
  //       version:firmwareData.version,
  //       description:firmwareData.comment,
  //       creationDate:isoDateString,
  //       firmwareData:firmwareData.base64,
  //     };
  //     // if(userDetail.privateFirmwareBuildNumber !== undefined){
  //     //   userDetail.privateFirmwareBuildNumber = globalHandler[0].lastFirmwareBuildNumber;
  //     // }else{
  //     //   userDetail.privateFirmwareBuildNumber = globalHandler[0].lastFirmwareBuildNumber;
  //     // }
  //     const entry = db.collection('firmware-handler')
  //     const entryUser = db.collection('account-handler')
  //     await entryUser.doc(userDetail.id).set(userDetail)
  //     await entry.doc(newUuid).set(firmwareObject).then( async (ref:any) => {
  //       const global_handler = db.collection('global_handler');
  //       global_handler.doc("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").set(globalHandler[0]);
  //       return res.status(200).json({
  //         response: {
  //           result:'success',
  //           message:''
  //         },        
  //         userDetail:userDetail,
  //         token: token,
  //         // BuildNumber:BuildNumber,
  //         id:json.id,
  //         private:privated,
  //         newUuid:newUuid,
  //         firmwareObject:firmwareObject,
  //         globalHandler:globalHandler
  //       });
  //     });

  //   }
  //  }
  }
  catch(error:any) { return res.status(500).json(error.message) }
}

const getFirmware = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  let idUser = headers.id;
  // let globalFirmwareChangeCount =  headers.globalfirmwarechangecount;
  // globalFirmwareChangeCount = Number(globalFirmwareChangeCount);
  let firmwareId = headers.firmwareid;
  let globalHandler :any = [];
  let lastPublicFirmwareId = "";
  let userDetail :any = '';
  let firmwareDetail: any = [];
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
    if(idUser !== undefined){
      const querySnapshotGlobalHandler = await db.collection('global_handler').get();
      querySnapshotGlobalHandler.forEach((doc: any) => {
        globalHandler.push(doc.data());
      });
      globalHandler.forEach((global:any)=>{
        if(global.publicFirmwareId !== undefined){
          lastPublicFirmwareId = global.publicFirmwareId;
        }
      });
      let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();
      userhandlerProfil.forEach(async (doc:any) =>{
          userDetail = doc.data();
      });
      if(userDetail.privateFirmwareId !== undefined){
        if(userDetail.privateFirmwareId !== "" ){
          let firmwareHandler = await db.collection('firmware-handler').where('id', '==', userDetail.privateFirmwareId).get();
          firmwareHandler.forEach(async (doc:any) =>{
            firmwareDetail = doc.data();
          });
          return res.status(200).json({
            response: {
              result:'success',
              message:''
            },
            firmwareDetail:firmwareDetail
          });
        }else{
          let firmwareHandler = await db.collection('firmware-handler').where('id', '==', lastPublicFirmwareId).get();
          firmwareHandler.forEach(async (doc:any) =>{
            firmwareDetail =doc.data()
          });
          return res.status(200).json({
            response: {
              result:'success',
              message:''
            },
            firmwareDetail:firmwareDetail
          });
        }
      }
      
      else if(firmwareId !== lastPublicFirmwareId){
        let firmwareHandler = await db.collection('firmware-handler').where('id', '==', lastPublicFirmwareId).get();
        firmwareHandler.forEach(async (doc:any) =>{
          firmwareDetail =doc.data()
        });
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },
          firmwareDetail:firmwareDetail
        });
      }
      else{
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },
          firmwareDetail:firmwareDetail
        });
      }
      // if(globalFirmwareChangeCount === lastPublicFirmwareChangeCount || globalFirmwareChangeCount > lastPublicFirmwareChangeCount){
      //   return res.status(200).json({
      //     response: {
      //       result:'success',
      //       message:''
      //     },
      //     idUser:idUser,
      //     privateFirmwareBuildNumber:userDetail.privateFirmwareBuildNumber,
      //     privateFirmwareId:userDetail.privateFirmwareId,
      //     lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
      //     firmwareDetail:firmwareDetail
      //   });
      // }
      // else if(globalFirmwareChangeCount < lastPublicFirmwareChangeCount && globalFirmwareChangeCount !== 0){
      //   let firmwareHandler = await db.collection('firmware-handler').where('buildNumber', '==', lastPublicFirmwareChangeCount).get();
      //   firmwareHandler.forEach(async (doc:any) =>{
      //     firmwareDetail =doc.data();
          
      //   });
      //   return res.status(200).json({
      //     response: {
      //       result:'success',
      //       message:''
      //     },
      //     idUser:idUser,
      //     privateFirmwareBuildNumber:userDetail.privateFirmwareBuildNumber,
      //     privateFirmwareId:userDetail.privateFirmwareId,
      //     lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
      //     firmwareDetail:firmwareDetail
      //   });
      // }
    }
  }
  })
  }
  catch(error:any) { return res.status(500).json(error.message) }
 }


 const getFirmwaresList = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  let firmwareList:any = [];

  try{

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
        let firmwareHandler = await db.collection('firmware-handler').get();
        firmwareHandler.forEach((firmware:any)=>{
          firmwareList.push(firmware.data());
        })
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },
          firmwareList:firmwareList
          // idUser:idUser,
          // lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
          // firmwareDetail:firmwareDetail
        });
    }
  });
  }
  catch(error:any) { return res.status(500).json(error.message) }
 }

 const getFirmwareDetails = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let firmwareDetail: any = "";
  // let token = headers.token;
  let firmwareId = headers.firmwareid;
  let firmwareHandler = await db.collection('firmware-handler').where('id', '==', firmwareId).get();
  firmwareHandler.forEach(async (doc:any) =>{
    firmwareDetail = doc.data()
  });
  try{
    return res.status(200).json({
      response: {
        result:'success',
        message:''
      },
      firmwareDetail:firmwareDetail
    });
  }
  catch(error:any) { return res.status(500).json(error.message) }
 }

// const checkFirmware = async (req: any, res: Response) => {
//   // let newUuid = uuidv4();
//   try {
//     return res.status(200).json({
//       status: 'success',
//       message: 'entry updated successfully',
//     })
//   }
//   catch(error:any) { return res.status(500).json(error.message) }
// }



export { createFirmware, getFirmware, getFirmwaresList, getFirmwareDetails }
