import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'

type AdminModel = {
  name: string,
  avatarimages:string,
  email:string,
  asAdmin:boolean,
  personalinfos:{
    firstname:string,
    zip:string,
    address:string,
    simplebirthdate:string,
    phone:string,
    city:string,
    comment:string,
    birthdate:string
  },
  privileges:{    role:'Administrateur',
    rights:string,
  },
  traineds:[],
  staff:[],
  econes:[],
  trainings:[],
  videos:[],
  licencied:number,
  date: string,
  dateIso: string,
  uuid:string,
  update:string,
  lastconnexion:string,
  lastcodateIso:string,
  warning:boolean

}


type Request = {
  body: AdminModel,
  params: { adminId: string }
}
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



const addAdmin = async (req: Request, res: Response) => {
  const {
    name, avatarimages, email,
    asAdmin,
    personalinfos:{ firstname, zip, address, simplebirthdate, phone, city, comment, birthdate },
    privileges:{ rights },
    traineds, staff, econes,
    trainings, videos, licencied,
    date, dateIso, uuid,
    update, lastconnexion, lastcodateIso, warning
  } = req.body
  try {
    const entry = db.collection('account-handler')
    const adminObject = {
      role:'Administrateur',
      id: entry.id, name, avatarimages,
      email, asAdmin,
      personalinfos:{ firstname, zip, address, simplebirthdate, phone, city, comment, birthdate },
      privileges:{ rights },
      traineds, staff, econes,
      trainings, videos, licencied,
      date, dateIso, uuid,
      update, lastconnexion, lastcodateIso, warning
    }

    await entry.add(adminObject)

    res.status(200).send({
      status: 'success',
      message: 'entry Admin added successfully',
      data: adminObject
    })
  } catch(error:any) {
      res.status(500).json(error.message)
  }
}

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const allAdmins: any[] = []
    const querySnapshot = await db.collection('account-handler').get()
    querySnapshot.forEach((doc: any) => {
      let ifAdmin = doc.data();
      if(ifAdmin.asAdmin == true){
        allAdmins.push({data:doc.data(), id: doc.id})
        functions.logger.log("DATA : ! ", allAdmins)
      }
    })

    return res.status(200).json(allAdmins)
  } catch(error:any) { return res.status(500).json(error.message) }
}



const updateAdmin = async (req:any, res: Response) => {
    // const { body: { 
    //   name, avatarimages, email,
    //   asAdmin,
    //   personalinfos:{ firstname, zip, address, simplebirthdate, phone, city, comment, birthdate },
    //   privileges:{ rights },
    //   traineds, staff, econes,
    //   trainings, videos, licencied,
    //   date, dateIso, uuid,
    //   update, lastconnexion, lastcodateIso, warning
    // }, params: { adminId } } = req
    // console.log('LA REQUEST',req)
    let reqs = req.query;
    let body = req.body;
    functions.logger.log("DATA : !!! ",reqs.adminId, body)
    const admin = db.collection('account-handler').doc(reqs.adminId)
    functions.logger.log('LE CHAMP : ! ',(await admin.get()).data() || {})
  // try {
  //    const admin = db.collection('account-handler').doc(adminId)
  //    const currentData = (await admin.get()).data() || {}

  //   const adminObject = {
  //         name:name || currentData.name, 
  //         avatarimages:avatarimages || currentData.avatarimages,
  //         email:email || currentData.email,
  //         asAdmin: asAdmin|| currentData.asAdmin,
  //         personalinfos:{ 
  //           firstname:firstname || currentData.firstname, 
  //           zip:zip || currentData.zip, 
  //           address:address || currentData.address, 
  //           simplebirthdate:simplebirthdate || currentData.simplebirthdate, 
  //           phone:phone || currentData.phone, 
  //           city:city || currentData.city, 
  //           comment:comment || currentData.comment, 
  //           birthdate:birthdate || currentData.birthdate
  //         },
  //         privileges:{ 
  //           rights: rights|| currentData.rights
  //          },
  //         traineds:traineds || currentData.traineds, 
  //         staff:staff || currentData.staff, 
  //         econes:econes || currentData.econes ,
  //         trainings:trainings||currentData.trainings,
  //         videos:videos||currentData.videos,
  //         licencied:licencied||currentData.licencied,
  //         date:date||currentData.date,
  //         dateIso:dateIso||currentData.dateIso, 
  //         uuid:uuid||currentData.uuid,
  //         update:update||currentData.update, 
  //         lastconnexion:lastconnexion||currentData.lastconnexion, 
  //         lastcodateIso:lastcodateIso||currentData.lastcodateIso, 
  //         warning:warning||currentData.warning
  //   }

  //   await admin.set(adminObject).catch((error:any) => {
  //     return res.status(400).json({
  //       status: 'error',
  //       message: error.message
  //     })
  //   })

    return res.status(200).json({
      status: 'success',
      message: 'entry ADMIN updated successfully',
      // data: adminObject
    })
  // }
  // catch(error:any) { return res.status(500).json(error.message) }
}

export { addAdmin, getAllAdmin, updateAdmin }
