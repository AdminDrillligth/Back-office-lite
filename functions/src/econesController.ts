import { Response } from "express"
// import { db } from './config/firebase'
// import * as functions from 'firebase-functions'
// import { v4 as uuidv4 } from 'uuid';

// Model de type Econes
// type EconesModel = {
//   name: string,
//   id:string,
//   avatarimages:string,
//   qr:string,
//   qrUrl:string,
//   asMaster:boolean,
//   personalinfosOfPrincipalCustomer:{
//     firstname:string,
//     zip:string,
//     address:string,
//     simplebirthdate:string,
//     phone:string,
//     city:string,
//     comment:string,
//     birthdate:string
//   },
//   role:'',
//   traineds:[],
//   staff:[],
//   slaves:[],
//   trainings:[],
//   videos:[],
//   date: string,
//   dashboardVersion:string,
//   firmwareVersion:string,
//   dateIso: string,
//   uuid:string,
//   update:string,
//   lastconnexion:string,
//   lastcodateIso:string,
//   warning:boolean
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
