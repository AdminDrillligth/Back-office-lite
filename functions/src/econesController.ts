import { Response } from "express"
// import { db } from './config/firebase'
// import * as functions from 'firebase-functions'
// import { v4 as uuidv4 } from 'uuid';

// SSID DE BASE : DRILLLIGHT 
//

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
//   password:string, // SYNC
//   firmwareVersion:string, // SYNC
//   lastFirmwareUpdate:string, // SYNC
//   lastUseDate:string, // SYNC
//   lastUseDateIso:string, // SYNC
// }

// SET CREATE A NEW ECONE ON THE DATA BASE
// THE MODEL TO INSERT IS :

// addEcone
const addEcone = async (req: any, res: Response) => {
  // let newUuid = uuidv4();
  try {

    return res.status(200).json({
      status: 'success',
      message: 'entry updated successfully',

    })
  }
  catch(error:any) { return res.status(500).json(error.message) }
}

// getEcones
const getEcones = async (req: any, res: Response) => {
  // let newUuid = uuidv4();
  try {

    return res.status(200).json({
      status: 'success',
      message: 'entry updated successfully',

    })
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

export { addEcone, getEcones, updateEcone, deleteEcone }