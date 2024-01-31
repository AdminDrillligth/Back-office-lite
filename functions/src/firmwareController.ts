// import { Response } from "express"
import { db } from './config/firebase'
// // import * as functions from 'firebase-functions'
import { v4 as uuidv4 } from 'uuid';
// var jwt = require("jsonwebtoken");
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


  let base64 = json.zip;
  let BuildNumber = 1;
  let version = "0.0.1";
  let globalHandler :any = [];

  try {
   
    const querySnapshotGlobalHandler = await db.collection('global_handler').get();
    querySnapshotGlobalHandler.forEach((doc: any) => {
      globalHandler.push(doc.data());
    });
    BuildNumber = globalHandler[0].globalFirmwareChangeCount +1
    globalHandler[0].globalFirmwareChangeCount = globalHandler[0].globalFirmwareChangeCount +1;
    let firmwareObject = {
      BuildNumber:BuildNumber,
      version:version,
      creationDate:isoDateString,
      firmwareData:base64
    };
      const entry = db.collection('firmware-handler')
  //   jwt.verify(token, 'secret', { expiresIn: '24h' }, function(err:any, decoded:any) {
  //     if(err){ 
  //     decodeds = 'err';
  //   }
  //     else{ decodeds = 'no error';
  //   }
  //   });
      await entry.doc(newUuid).set(firmwareObject).then( async (ref:any) => {
      const global_handler = db.collection('global_handler');
      global_handler.doc("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").set(globalHandler[0])
    
      return res.status(200).json({
        status: 'success',
        message: 'add Econe Service successfully',
        token: token,
        BuildNumber:BuildNumber,
        id:json.id,
        newUuid:newUuid,
        firmwareObject:firmwareObject,
        globalHandler:globalHandler
      });
    })
    
  }
  catch(error:any) { return res.status(500).json(error.message) }
}

const getFirmware = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  // let token = headers.token;
  let idUser = headers.id;
  let globalFirmwareChangeCount =  headers.globalfirmwarechangecount;
  globalFirmwareChangeCount = Number(globalFirmwareChangeCount);
  let globalHandler :any = [];
  let lastPublicFirmwareChangeCount = "";
  let userDetail :any = '';
  let firmwareDetail: any = [];
  try {
    if(idUser !== undefined){
      const querySnapshotGlobalHandler = await db.collection('global_handler').get();
      querySnapshotGlobalHandler.forEach((doc: any) => {
        globalHandler.push(doc.data());
      });
      globalHandler.forEach((global:any)=>{
        if(global.globalFirmwareChangeCount !== undefined){
          lastPublicFirmwareChangeCount = global.globalFirmwareChangeCount;
        }
      });
      let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();
      userhandlerProfil.forEach(async (doc:any) =>{
          userDetail = doc.data();
      });

      if(globalFirmwareChangeCount === 0){
        let firmwareHandler = await db.collection('firmware-handler').where('BuildNumber', '==', lastPublicFirmwareChangeCount).get();
        firmwareHandler.forEach(async (doc:any) =>{
          firmwareDetail.push(doc.data());
        });
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },
          // idUser:idUser,
          // globalFirmwareChangeCount:globalFirmwareChangeCount,
          lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
          userDetail:userDetail,
          firmwareData:firmwareDetail
        });
      }
      if(globalFirmwareChangeCount === lastPublicFirmwareChangeCount || globalFirmwareChangeCount > lastPublicFirmwareChangeCount){
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },
          idUser:idUser,
          // globalFirmwareChangeCount:globalFirmwareChangeCount,
          lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
          userDetail:userDetail,
          firmwareData:firmwareDetail
        });
      }
      else if(globalFirmwareChangeCount < lastPublicFirmwareChangeCount && globalFirmwareChangeCount !== 0){
        let firmwareHandler = await db.collection('firmware-handler').where('BuildNumber', '==', lastPublicFirmwareChangeCount).get();
        firmwareHandler.forEach(async (doc:any) =>{
          firmwareDetail.push(doc.data());
          
        });
        return res.status(200).json({
          response: {
            result:'success',
            message:''
          },
          idUser:idUser,
          // globalFirmwareChangeCount:globalFirmwareChangeCount,
          lastPublicFirmwareChangeCount:lastPublicFirmwareChangeCount,
          userDetail:userDetail,
          firmwareData:firmwareDetail
        });
      }
//     // let decodeds:any;
//     // jwt.verify(token, 'secret', { expiresIn: '24h' }, function(err:any, decoded:any) {
//     //   if(err){ decodeds = 'err'; }
//     //   else{ decodeds = 'no error'; }
//     // });
//     // const AllEcones: any[] = [];
//     // const EconeCollection = await db.collection('e-cones-handler').get();
//     // EconeCollection.forEach((econe:any)=>{
//     //   AllEcones.push(econe.data());
//     // });



  }
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



export { createFirmware, getFirmware }
