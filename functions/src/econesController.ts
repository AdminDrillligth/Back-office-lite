import { Response } from "express";
import { db } from './config/firebase';
var jwt = require("jsonwebtoken");
// import * as functions from 'firebase-functions';
import { v4 as uuidv4 } from 'uuid';
var DateString = new Date().toLocaleDateString('en-GB');
var isoDateString = new Date().toISOString();
// SSID DE BASE : DRILLLIGHT 

// Model de type Econes
// type EconesModel = {
//   id:string, // STATIC 
//   uniqueId:string, // STATIC
//   qr:string, // STATIC 
//   qrUrl:string, // STATIC
//   creationDate: string, // STATIC
//   creationDateIso: string, // STATIC
//   customerId:string, // ADMIN
//   name: string, // SYNC
//   avatarimages:string, // SYNC
//   asMaster:boolean, // SYNC
//   SSID:string, // SYNC
//   passwordSSID:string, // SYNC
//   firmwareVersion:string, // SYNC
//   lastFirmwareUpdate:string, // SYNC
//   lastUseDate:string, // SYNC
//   lastUseDateIso:string, // SYNC
// }

// SET CREATE A NEW ECONE ON THE DATA BASE
// THE MODEL TO INSERT IS :


// addEcone
const createEcone = async (req: any, res: Response) => {

  let newUuid = uuidv4();
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;

  let bodyOfRequest = req.body;
  let data = bodyOfRequest.data;
  let decodeds:any;
  let EconeObject = {
    id:data.serial, // STATIC 
    uniqueId:newUuid, // STATIC
    qr:newUuid, // STATIC 
    qrUrl:'', // STATIC
    creationDate: DateString, // STATIC
    creationDateIso: isoDateString, // STATIC
    customerId:data.idOfCustomer, // ADMIN
    name: '', // SYNC
    avatarImages:'', // SYNC
    asMaster:true, // SYNC
    SSID:data.SSID, // SYNC
    passwordSSID: data.passwordSSID, // SYNC
    firmwareVersion:data.firmware, // SYNC
    lastFirmwareUpdate:'', // SYNC
    lastUseDate:'', // SYNC
    lastUseDateIso:'', // SYNC
  };
  
  try {
    // const entry = db.collection('e-cones-handler')
    jwt.verify(token, 'secret', { expiresIn: '24h' }, function(err:any, decoded:any) {
      if(err){ 
      decodeds = 'err';
    }
      else{ decodeds = 'no error';
    }
    });
    // await entry.add(EconeObject)
    return res.status(200).json({
      status: 'success',
      message: 'add Econe Service successfully',
      token: token,
      data: data,
      EconeObject: EconeObject,
      decodeds: decodeds
    });
  }
  catch(error:any) { return res.status(500).json(error.message) }
}

// getEcones
const getEconeDetails = async (req: any, res: Response) => {
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;

  try {
    let decodeds:any;
    jwt.verify(token, 'secret', { expiresIn: '24h' }, function(err:any, decoded:any) {
      if(err){ decodeds = 'err'; }
      else{ decodeds = 'no error'; }
    });
    const AllEcones: any[] = [];
    const EconeCollection = await db.collection('e-cones-handler').get();
    EconeCollection.forEach((econe:any)=>{
      AllEcones.push(econe.data());
    });
    return res.status(200).json({
      status: 'success',
      message: 'Get all econes successfully',
      ListEcones: AllEcones,
      token:token,
      decodeds:decodeds
    });
  }
  catch(error:any) { return res.status(500).json(error.message) }
}

// updateEcone
const updateEcone = async (req: any, res: Response) => {
  // let newUuid = uuidv4();
  try {
    return res.status(200).json({
      status: 'success',
      message: 'entry updated successfully',
    })
  }
  catch(error:any) { return res.status(500).json(error.message) }
}

// deleteEcone
const deleteEcone = async (req: any, res: Response) => {
  // let newUuid = uuidv4();
  try {
    return res.status(200).json({
      status: 'success',
      message: 'entry updated successfully',
    })
  }
  catch(error:any) { return res.status(500).json(error.message) }
}


export { createEcone, getEconeDetails, updateEcone, deleteEcone }
