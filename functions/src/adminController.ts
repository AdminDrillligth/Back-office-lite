import { Response } from "express"
import { db } from './config/firebase'

type AdminModel = {
  name: string,
  avatarimages:string,
  email:string,
  asAdmin:boolean,
  // personalinfos:{
  //     firstname:string,
  //     zip:string,
  //     address:string,
  //     simplebirthdate:string,
  //     name:string,
  //     email:string,
  //     phone:string,
  //     city:string,
  //     comment:string,
  //     birthdate:string
  // },
  // privileges:{
  //     role:'Administrateur',
  //     rights:string
  // },
  // traineds:[],
  // staff:[],
  // econes:[],
  // trainings:[],
  // videos:[],
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
  params: { entryId: string }
}



const addAdmin = async (req: Request, res: Response) => {
  const {
    name,
    avatarimages,
    email,
    asAdmin,
    // personalinfos:{
    //     firstname:string,
    //     zip:string,
    //     address:string,
    //     simplebirthdate:string,
    //     name:string,
    //     email:string,
    //     phone:string,
    //     city:string,
    //     comment:string,
    //     birthdate:string
    // },
    // privileges:{
    //     role,
    //     rights
    // },
    // traineds,
    // staff,
    // econes,
    // trainings,
    // videos,
    licencied,
    date,
    dateIso,
    uuid,
    update,
    lastconnexion,
    lastcodateIso,
    warning
  } = req.body
  // const { title, text } = req.body
  try {
    const entry = db.collection('account-handler').doc()
    const adminObject = {
      name,
      avatarimages,
      email,
      asAdmin,
      // personalinfos:{
      //     firstname:string,
      //     zip:string,
      //     address:string,
      //     simplebirthdate:string,
      //     name:string,
      //     email:string,
      //     phone:string,
      //     city:string,
      //     comment:string,
      //     birthdate:string
      // },
      // privileges:{
      //     role,
      //     rights
      // },
      // traineds,
      // staff,
      // econes,
      // trainings,
      // videos,
      licencied,
      date,
      dateIso,
      uuid,
      update,
      lastconnexion,
      lastcodateIso,
      warning,
      id: entry.id,
    }

    await entry.set(adminObject)

    res.status(200).send({
      status: 'success',
      message: 'entry added successfully',
      data: adminObject
    })
  } catch(error:any) {
      res.status(500).json(error.message)
  }
}



export { addAdmin }
