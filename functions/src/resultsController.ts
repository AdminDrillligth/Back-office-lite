// import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'
import { v4 as uuidv4 } from 'uuid';
var jwt = require("jsonwebtoken");
// // var btoa = require('btoa');
// var DateString = new Date().toLocaleDateString('en-GB');
// var isoDateString = new Date().toISOString();

db.settings({ ignoreUndefinedProperties: true })

let saveIndataBase = async (result:any,coach:any)=>{
  functions.logger.log("DATA DECODED RESULT TO SAVE : ! ", result)
  const results_handler = db.collection('results-handler');
  let newUuidResult = uuidv4();
  results_handler.doc(newUuidResult).set({result:result, idExercice:result.infos.idExercise, idResult:newUuidResult, idAccount:coach.id }).then( async (ref:any) => {
            functions.logger.log("DATA DECODED ERROR: resultsS! ",ref)
  })
}

let saveDataReports = async (report:any)=>{
  functions.logger.log("DATA DECODED REPORT TO SAVE : ! ", report)
  const reports_handler = db.collection('reports-handler');
  let newUuidReport = uuidv4();
  reports_handler.doc(newUuidReport).set({report:report}).then( async (ref:any) => {
            functions.logger.log("DATA DECODED ERROR: Report! ",ref)
  })
}

// createResult



const createResult = async (req: any, res: any) => {
  let reqs = req;
  let body = reqs.body;
  let results = body.data;
  let headers = reqs.headers;
  let token = headers.token;
  functions.logger.log("LOG body RESULT ", body );
  functions.logger.log("LOG body RESULT ", results );
  saveDataReports(body.data);
  results.forEach((result:any) =>{
    functions.logger.log("LOG body RESULT ", result );
    functions.logger.log("LOG body RESULT ", result.results );
    saveIndataBase(result.results, result.coach)
  })

  try {
    // sign token
    jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:'Votre token a expiré'
            },
          });
        }else {

            return res.status(200).json({
                response: {
                    result:'success',
                    message:''
                },
                resultBodyData:results
            })
        }
    })
  }
  catch(error:any) { return res.status(500).json(error.message) }
}

const createResultOld = async (req: any, res: any) => {
    let reqs = req;
    let body = reqs.body;
    let results = body.data;
    // let countPass360;
    // let countPass360i;
    // let countTouch;
    // let countJump;
    // let arrayOfKeys = ['date', 'time', 'pod_id','pod_index', 'person', 'kind', 'title','id','action','number','step','target','factor' ];
    let dataBinding :any = [];
 

    // export class EventToDisplay {
    //     index: number;
    //     chronoTime: string;
    //     participants: Account[];
    //     startTime: string;
    //     endTime: string;
    //     totalTime: number;
    //     actions: Action[]
    //   }


    // export class Action {
    //     deltaLastAction: string;
    //     chrono: string;
    //     icon: string;
    //     econe: string;
    //     timeInStep: string;
    //     time: number;
    //   }

    // export class KPI {
    //     start: string;
    //     time1: string;
    //     time2: string;
    //     loop: number;
    //     detections: number;
    //     touchs: number;
    //     right: number
    //     left: number;
    //     name: string;
    //     factor: number;
    //   }




    let DataBind :any = []
    functions.logger.log("LOG body ", body)
    functions.logger.log("LOG body ", body.data );
    saveDataReports(body.data);
    results.forEach((result:any) =>{
        // 
      functions.logger.log("LOG body RESULT ", result );
      // pour chaque exercice l'on insere dans le tableau dataBinding
      dataBinding.push({coach:result.coach,idExercise: result.events[0].event.id,startDate:result.events[0].date, factor: result.factor ,events:[], title: result.events[0].event.title})
      // pour chaque evenements de l'exercice l'on rajout dans le dataBinding
      result.events.forEach((event:any)=>{
      let splitedTime = new Date(Number(event.time)*1000).toLocaleTimeString();
      let split:any = splitedTime.split(':');
      let hours = Number(split[0]);
      let mins = Number(split[1]);
      let splitScds = split[2];
      let splitScdsNumber = splitScds.split(' ');
      // functions.logger.log("splitedTime chrono 3  ", splitScdsNumber)
      let scds = Number(splitScdsNumber[0]);
      let mlscs = new Date(Number(event.time)*1000).getMilliseconds();
      let parsedTime =  hours+':'+mins+':'+scds+':'+mlscs;


      // for each start of exercise
      if(event.event.kind === 'exercise_start'){
        dataBinding[dataBinding.length-1].startTime = parsedTime;
        dataBinding[dataBinding.length-1].hours = hours;
        dataBinding[dataBinding.length-1].mins = mins;
        dataBinding[dataBinding.length-1].scds = scds;
        dataBinding[dataBinding.length-1].mlscs = mlscs;
      }


    //   Pour chaque events on peuple le tableau events des champs importants à parser
      dataBinding[dataBinding.length-1].events.push({
          date:event.date,
          hours:hours,
          mins:mins,
          scds:scds,
          mlscs:mlscs,
          parsedTime:parsedTime,
          time:event.time,
          pod_id:event.source.id,
          pod_index:event.source.index,
          person:event.person,
          kind:event.event.kind,
          title:event.event.title,
          action:event.event.action,
          number:event.event.number,
          step:event.event.step,
          target:event.event.target
       })
      });
    })


    // Une fois chaque parti de l'exercice l'on va commecer les calculs et générer les resultats
    dataBinding.forEach((exercise:any,  lastDataBindIndex:number) =>{
      let passleft =  exercise.events.filter((element:any) => element.action === 'passleft');
      let passright = exercise.events.filter((element:any) => element.action === 'passright');
      let touch =  exercise.events.filter((element:any) => element.action === 'touch');
      // let passright = exercise.events.filter((element:any) => element.action === 'passright');

    // let countTouch;
    // let countJump;
    functions.logger.log("Find how many pass left ", passleft.length )
    functions.logger.log("Find how many pass right ", passright.length )
    let detections = passleft.length+passright.length;
      DataBind.push({
        account:{id:exercise.coach.id, email:exercise.coach.email},
        infos:{ idExercise: exercise.idExercise, name: exercise.title, startDate: exercise.startDate},
        kpi : {factor: exercise.factor , name: exercise.title , loop:0, detections:detections, touchs:touch.length, right:passright.length, left: passleft.length, start:exercise.startDate},
        eventToDisplay:[]
      })
      exercise.loopEnd = [];
      exercise.DataBinding = [];
      exercise.events.forEach((event:any, inde:number) =>{

        // This exercise start
        if(event.kind === 'exercise_start'){
          exercise.modeType = 'time';
          exercise.totalOfLoop = 0;
          exercise.loopEnd.push(inde)
        }
        // if we find a loop
        if(event.kind === 'loop_start'){
          exercise.modeType = 'loop';
        }
        // if mode loop, we increase total number of loop
        if(exercise.modeType === 'loop'){
          if(event.kind === 'loop_start'){
               if(exercise.totalOfLoop !== undefined){
                exercise.totalOfLoop = exercise.totalOfLoop + 1;
               }else{
                exercise.totalOfLoop = 1;
               }
           }
        }
        // this exercise end
        if(event.kind === 'exercise_end' ){
          // if mode time
          if(exercise.modeType === 'time'){
            exercise.totalOfLoop = 1;
          }

          // if the Exercise hours time is the same of event
          if(exercise.hours === event.hours){
            
            // let newhours =0;
            let newmins =  event.mins - exercise.mins;
            let newscds = (event.scds +(newmins *60)) - exercise.scds;
            let newmlscds;
            if(newscds < 60 ){
              newmins = 0;
              // newhours =0;
          }
          if(newscds >59){
              newmins = Math.floor(newscds/60)
              newscds = newscds-(Math.floor(newscds/60)*60)
          }
          if(exercise.mlscs > event.mlscs){
              newmlscds = event.mlscs+1000;
              newscds = newscds-1;
          }else{
              newmlscds = event.mlscs;
          }
          // console.log('TOTAL TIME 1', newmins+':'+newscds+':'+event.mlscs-ex.mlscs);
          if(newmins < 10){
              if(newscds < 10){
                exercise.totalTime = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.mlscs).toString()
              }else{
                exercise.totalTime = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.mlscs).toString()
              }
          }else{
              if(newscds < 10){
                exercise.totalTime = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.mlscs).toString()
              }else{
                exercise.totalTime = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.mlscs).toString()
              }
          }
          exercise.totalTime = exercise.totalTime.slice(0, exercise.totalTime.length - 1);

          }
          // if the exercise hours time is under the event
          if(exercise.hours < event.hours){

            // functions.logger.log("exercise.hours < event.hours ", exercise.hours,event.hours )
            let newhours= event.hours - exercise.hours;
            let newmins =  (event.mins+(newhours*60)) - exercise.mins;
            let newscds = (event.scds +(newmins *60)) - exercise.scds;
            let newmlscds;
            if(newscds <60 ){
              newmins = 0;
              newhours =0;
          }
          if(newscds >59){
              newmins = Math.floor(newscds/60)
              newscds = newscds-(Math.floor(newscds/60)*60)
          }
          if(exercise.mlscs > event.mlscs){
              newmlscds = event.mlscs+1000;
              newscds = newscds-1;
          }else{
              newmlscds = event.mlscs;
          }
          //  console.log('TOTAL TIME 2', newmins);
          if(newmins < 10){
              if(newscds < 10){
                exercise.totalTime = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.mlscs).toString()
              }else{
                exercise.totalTime = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.mlscs).toString()
              }
          }else{
              if(newscds < 10){
                exercise.totalTime = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.mlscs).toString()
              }else{
                exercise.totalTime = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.mlscs).toString()
              }
          }
          exercise.totalTime = exercise.totalTime.slice(0, exercise.totalTime.length - 1);

          }
          DataBind[DataBind.length-1].kpi.loop =   exercise.totalOfLoop;
          DataBind[DataBind.length-1].infos.totalTime =  exercise.totalTime;
          functions.logger.log("Exercice END ",event.hours,':',event.mins,':',event.scds,':',event.mlscs ,' //previous event:',exercise.events[inde-1])
          
          // let data: any  = { DataBind:DataBind }
          // saveIndataBase(DataBind[DataBind.length -1])

          
          functions.logger.log("DATA DECODED ERROR: resultsS! ",DataBind[DataBind.length -1])
          
        }
        //each step Start
        if(event.kind === 'step_start' ){
          // functions.logger.log("STEP START EVENT : ", event ,'//next event:',exercise.events[inde+1] )
          if(exercise.events[inde-1].kind === 'exercise_start'){
            event.chrono = '00:00:00';
          }
          if(exercise.events[inde-1].kind === 'loop_start'){
            event.chrono = '00:00:00';
          }
          if(exercise.startTime === event.parsedTime){
            event.chrono = '00:00:00';
            // functions.logger.log("DataBind STEP START 2:", DataBind[DataBind.length-1])
            // DataBind[DataBind.length-1].
            // event.imgActionWhite = 'loop-white.png';
            // functions.logger.log("StartTime chrono  ", exercise)
          }
          // L'action de ce step n'a pas été effectuée
          // L'action de ce step n'a pas été effectuée
          if(exercise.events[inde+1].kind === 'step_end'){
            // L'action de ce step n'a pas été effectuée


          }
          // if mode is time_with_jump


          // Lorsque un Jump est détecté dans une action précédente
          if(exercise.events[inde-1].action === 'jump' ){
            // functions.logger.log("exercise.events[inde-1].action ", exercise.events[inde-1].action, inde)
            event.chrono = '00:00:00';
            exercise.loopEnd.push(inde)
            exercise.totalOfLoop = exercise.totalOfLoop + 1;
            exercise.modeType = 'time_with_jump';

            // SI l'action précédente est jump ..
          }
          // if the time of the first step start is egal to the event parsed time ?
          if(exercise.events[1].parsedTime !== event.parsedTime){
            // if the mode is not undefined
            if(exercise.modeType !== undefined){
                let indexOflast;
                // if the mode is time_with_jump and the chrono is egal to 00:00:00;
                if(exercise.modeType === 'time_with_jump' && event.chrono !== '00:00:00'){
                  // Find the last index with the chrono at '00:00:00'
                  const isLastNumb = (element:any) => element.chrono === '00:00:00';
                  // functions.logger.log("const isLastNumb = (element) => element.chrono === '00:00:00' ",isLastNumb)
                  indexOflast = exercise.events.findLastIndex(isLastNumb);
                  // functions.logger.log("indexOflast = exercise.events.findLastIndex(isLastNumb); ",indexOflast)
                  if(exercise.events[indexOflast].hours === event.hours){
                    // let newhours = event.hours - exercise.events[indexOflast].hours;
                    let newmins =  event.mins - exercise.events[indexOflast].mins;
                    let newscds = (event.scds +(newmins *60)) - exercise.events[indexOflast].scds;
                    let newmlscds;
                    if(newscds < 60 ){
                      newmins = 0;
                      // newhours = 0;
                   }
                    if(newscds >59){
                        newmins = Math.floor(newscds/60)
                        newscds = newscds-(Math.floor(newscds/60)*60)
                    }
                    if(exercise.events[indexOflast].mlscs > event.mlscs){
                        newmlscds = event.mlscs+1000;
                        newscds = newscds-1;
                    }else{
                        newmlscds = event.mlscs;
                    }
                    if(newmins < 10){
                        if(newscds < 10){
                            event.chrono = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[indexOflast].mlscs).toString()
                        }else{
                            event.chrono = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[indexOflast].mlscs).toString()
                        }
                    }else{
                        if(newscds < 10){
                            event.chrono = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[indexOflast].mlscs).toString()
                        }else{
                            event.chrono = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[indexOflast].mlscs).toString()
                        }
                    }
                    if(event.chrono.length - 1 > 7){
                        event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                    }
                  }
                  if(exercise.events[indexOflast].hours < event.hours){
                    let newhours= event.hours - exercise.events[indexOflast].hours;
                    let newmins =  (event.mins+(newhours*60)) - exercise.events[indexOflast].mins;
                    let newscds = (event.scds +(newmins *60)) - exercise.events[indexOflast].scds;
                    let newmlscds;
                    if(newscds <60 ){
                      newmins = 0;
                      newhours =0;
                    }
                    if(newscds >59){
                        newmins = Math.floor(newscds/60)
                        newscds = newscds-(Math.floor(newscds/60)*60)
                    }
                    if(exercise.events[indexOflast].mlscs > event.mlscs){
                        newmlscds = event.mlscs+1000;
                        newscds = newscds-1;
                    }else{
                        newmlscds = event.mlscs;
                    }
                    if(newmins < 10){
                        if(newscds < 10){
                            event.chrono = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[indexOflast].mlscs).toString()
                        }else{
                            event.chrono = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[indexOflast].mlscs).toString()
                        }
                    }else{
                        if(newscds < 10){
                            event.chrono = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[indexOflast].mlscs).toString()
                        }else{
                            event.chrono = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[indexOflast].mlscs).toString()
                        }
                    }
                    if(event.chrono.length - 1 > 7){
                        event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                    }
                  }
                }
            }
            // if the mode type is undefined
            else{
              if(exercise.events[1].hours === event.hours){
                // let newhours = event.hours - exercise.events[1].hours;
                let newmins =  event.mins - exercise.events[1].mins;
                let newscds = (event.scds +(newmins *60)) - exercise.events[1].scds;
                let newmlscds;
                if(newscds < 60 ){
                  newmins = 0;
                  // newhours = 0;
                }
                if(newscds >59){
                    newmins = Math.floor(newscds/60)
                    newscds = newscds-(Math.floor(newscds/60)*60)
                }
                if(exercise.events[1].mlscs > event.mlscs){
                    newmlscds = event.mlscs+1000;
                    newscds = newscds-1;
                }else{
                    newmlscds = event.mlscs;
                }
                if(newmins < 10){
                    if(newscds < 10){
                        event.chrono = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[1].mlscs).toString()
                    }else{
                        event.chrono = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[1].mlscs).toString()
                    }
                }else{
                    if(newscds < 10){
                        event.chrono = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[1].mlscs).toString()
                    }else{
                        event.chrono = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[1].mlscs).toString()
                    }
                }
                if(event.chrono.length - 1 > 7){
                    event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                }

              }
              if(exercise.events[1].hours < event.hours){
                let newhours= event.hours - exercise.events[1].hours;
                let newmins =  (event.mins+(newhours*60)) - exercise.events[1].mins;
                let newscds = (event.scds +(newmins *60)) - exercise.events[1].scds;
                let newmlscds;
                if(newscds <60 ){
                  newmins = 0;
                  newhours =0;
                }
                if(newscds >59){
                    newmins = Math.floor(newscds/60)
                    newscds = newscds-(Math.floor(newscds/60)*60)
                }
                if(exercise.events[1].mlscs > event.mlscs){
                    newmlscds = event.mlscs+1000;
                    newscds = newscds-1;
                }else{
                    newmlscds = event.mlscs;
                }
                if(newmins < 10){
                    if(newscds < 10){
                        event.chrono = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[1].mlscs).toString()
                    }else{
                        event.chrono = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[1].mlscs).toString()
                    }
                }else{
                    if(newscds < 10){
                        event.chrono = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[1].mlscs).toString()
                    }else{
                        event.chrono = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[1].mlscs).toString()
                    }
                }
                if(event.chrono.length - 1 > 7){
                    event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                }
              }
            }
          }


        }
        if(event.kind === 'step_end' ){
          //  lorsque le step se termine

            // functions.logger.log("Event of step End",  event)
            const isLastNumb = (element:any) => element.chrono === '00:00:00';
            // on recupere  le dernier indice ou le chrono est  à 00:00:00;
            let indexOflast = exercise.events.findLastIndex(isLastNumb);
            // functions.logger.log("STEP END  exercise.hours and event.hours Details", exercise.events[indexOflast],'EVENT', event ,inde)
            if(exercise.modeType !== undefined){
              // Si le type d'exercice est temps avec un Jump :
              if(exercise.modeType === 'time_with_jump'){
                if(exercise.events[inde+1].action === 'jump'){
                  // functions.logger.log("Reelle fin d'un step time_with_jump ", exercise.events[indexOflast] ,'LE EVENT ',event ,inde)
                  functions.logger.log("Reelle fin d'un step time_with_jump", event.hours,':',event.mins,':',event.scds,':',event.mlscs, event)
                  functions.logger.log("Reelle fin d'un step time_with_jump", exercise.events[indexOflast].hours,':',exercise.events[indexOflast].mins,':',exercise.events[indexOflast].scds,':',exercise.events[indexOflast].mlscs)
                  if(exercise.events[indexOflast].hours === event.hours){
                    let newminsChrono =  event.mins - exercise.events[indexOflast].mins;
                    let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[indexOflast].scds;
                    let newmlscdsChrono;
                    if(newscdsChrono < 60 ){
                      newminsChrono = 0;
                      // newhoursChrono = 0;
                    }
                    if(newscdsChrono >59){
                        newminsChrono = Math.floor(newscdsChrono/60)
                        newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                    }
                    if(exercise.events[indexOflast].mlscs > event.mlscs){
                        newmlscdsChrono = event.mlscs+1000;
                        newscdsChrono = newscdsChrono-1;
                    }else{
                        newmlscdsChrono = event.mlscs;
                    }
                    if(newminsChrono < 10){
                        if(newscdsChrono < 10){
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }else{
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }
                    }else{
                        if(newscdsChrono < 10){
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }else{
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }
                    }
  
  
                    if(event.chrono.length - 1 > 7){
                        event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                    }

                  }

                  if(exercise.events[indexOflast].hours < event.hours){
                    let newhoursChrono = event.hours - exercise.events[indexOflast].hours;
                    let newminsChrono =  (event.mins+(newhoursChrono*60)) - exercise.events[indexOflast].mins;
                    let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[indexOflast].scds;
                    let newmlscdsChrono;
                    if(newscdsChrono <60 ){
                      newminsChrono = 0;
                      newhoursChrono =0;
                    }
                    if(newscdsChrono >59){
                        newminsChrono = Math.floor(newscdsChrono/60)
                        newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                    }
                    if(exercise.events[indexOflast].mlscs > event.mlscs){
                        newmlscdsChrono = event.mlscs+1000;
                        newscdsChrono = newscdsChrono-1;
                    }else{
                        newmlscdsChrono = event.mlscs;
                    }
                    if(newminsChrono < 10){
                        if(newscdsChrono < 10){
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }else{
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }
                    }else{
                        if(newscdsChrono < 10){
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }else{
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }
                    }
                    if(event.chrono.length - 1 > 7){
                        event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                    }
                  }
                  DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].endTime = new Date(event.date).toLocaleTimeString('fr-FR');
                  DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].totalTime =  event.chrono;

                  // functions.logger.log("LOG TIME IN LOCAL TIME", new Date(event.date).toLocaleTimeString('fr-FR') )
                }
              }else{
                  if( exercise.events[inde+1] !== undefined){
                    // functions.logger.log("Reelle fin d'un step mode time_with_jump ou loop", )
                    if(exercise.events[inde+1].action === 'jump'){
                      // functions.logger.log("Reelle fin d'un step mode time_with_jump ou loop ", exercise.events[inde+1] ,'LE EVENT ',event ,inde)
                      // functions.logger.log("Reelle fin d'un step  mode time_with_jump ou loop ", exercise.events[indexOflast] ,'LE EVENT ',event ,inde)
                      functions.logger.log("Reelle fin d'un step mode time_with_jump ou loop", event.hours,':',event.mins,':',event.scds,':',event.mlscs)
                      functions.logger.log("Reelle fin d'un step mode time_with_jump ou loop ", exercise.events[indexOflast].hours,':',exercise.events[indexOflast].mins,':',exercise.events[indexOflast].scds,':',exercise.events[indexOflast].mlscs)
                      if(exercise.events[indexOflast].hours === event.hours){
                        let newminsChrono =  event.mins - exercise.events[indexOflast].mins;
                        let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[indexOflast].scds;
                        let newmlscdsChrono;
                        if(newscdsChrono < 60 ){
                          newminsChrono = 0;
                          // newhoursChrono = 0;
                        }
                        if(newscdsChrono >59){
                            newminsChrono = Math.floor(newscdsChrono/60)
                            newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                        }
                        if(exercise.events[indexOflast].mlscs > event.mlscs){
                            newmlscdsChrono = event.mlscs+1000;
                            newscdsChrono = newscdsChrono-1;
                        }else{
                            newmlscdsChrono = event.mlscs;
                        }
                        if(newminsChrono < 10){
                            if(newscdsChrono < 10){
                                if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                    event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }else{
                                    event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }
                            }else{
                                if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                    event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }else{
                                    event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }
                            }
                        }else{
                            if(newscdsChrono < 10){
                                if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                    event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }else{
                                    event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }
                            }else{
                                if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                    event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }else{
                                    event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }
                            }
                        }
      
      
                        if(event.chrono.length - 1 > 7){
                            event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                        }
    
                      }
    
                      if(exercise.events[indexOflast].hours < event.hours){
                        let newhoursChrono = event.hours - exercise.events[indexOflast].hours;
                        let newminsChrono =  (event.mins+(newhoursChrono*60)) - exercise.events[indexOflast].mins;
                        let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[indexOflast].scds;
                        let newmlscdsChrono;
                        if(newscdsChrono <60 ){
                          newminsChrono = 0;
                          newhoursChrono =0;
                        }
                        if(newscdsChrono >59){
                            newminsChrono = Math.floor(newscdsChrono/60)
                            newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                        }
                        if(exercise.events[indexOflast].mlscs > event.mlscs){
                            newmlscdsChrono = event.mlscs+1000;
                            newscdsChrono = newscdsChrono-1;
                        }else{
                            newmlscdsChrono = event.mlscs;
                        }
                        if(newminsChrono < 10){
                            if(newscdsChrono < 10){
                                if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                    event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }else{
                                    event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }
                            }else{
                                if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                    event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }else{
                                    event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }
                            }
                        }else{
                            if(newscdsChrono < 10){
                                if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                    event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }else{
                                    event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }
                            }else{
                                if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                    event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }else{
                                    event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                                }
                            }
                        }
                        if(event.chrono.length - 1 > 7){
                            event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                        }
                      }
                      if(DataBind[DataBind.length-1] !== undefined){
                        functions.logger.log("Reelle fin d'un step mode time_with_jump ou loop DATABIND DATABIND DATABIND",DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1])
                        functions.logger.log("Reelle fin d'un step mode time_with_jump ou loop ",event.chrono)
                        if(DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1] !==  undefined){
                          DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].endTime = new Date(event.date).toLocaleTimeString('fr-FR');
                          DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].totalTime =  event.chrono;
                        }

                      }
                    
                      // }
                    }else{
                      // functions.logger.log("Reelle fin d'un exo ? ", exercise.events[inde+1] ,'LE EVENT ',event ,inde)
                      // functions.logger.log("Reelle fin d'un exo ? ", event.hours,':',event.mins,':',event.scds,':',event.mlscs)
                      // functions.logger.log("Reelle fin d'un exo ? ", exercise.events[inde+1].hours,':',exercise.events[inde+1].mins,':',exercise.events[inde+1].scds,':',exercise.events[inde+1].mlscs)
                    }
                  }
              }
            }
            // if(exercise.events[indexOflast].parsedTime !== undefined && event.parsedTime !== undefined){
            //   // functions.logger.log("STEP START exercise.hours and event.hours ", exercise.events[indexOflast].parsedTime, event.parsedTime )
            // }

            //
        }

        // Lors de chaque action
        if(event.kind === 'action' ){
          functions.logger.log("START OF ACTION WITH TOUCH ?? ", event.action, exercise.modeType )
          if(exercise.events[inde-1].kind === 'step_start'){
            functions.logger.log("START OF ACTION WITH TOUCH ?? 2", event.action, exercise )
            // functions.logger.log("eexercise.events[inde-1].kind 2 ", exercise.events[inde-1].kind )
            // Si nous avons déja le mode de l'exo
            if(exercise.modeType !== undefined){
              let indexOflast;
              if(exercise.modeType === 'loop'){
                functions.logger.log("START OF ACTION WITH TOUCH ?? 2", event )
                // const isLastNumb = (element:any) => element.chrono === '00:00:00';
                // indexOflast = exercise.events.findLastIndex(isLastNumb);
                // functions.logger.log("START OF ACTION WITH TOUCH ?? INDEX OF LAST 00", exercise.events[indexOflast] )
                if( event.chrono !== '00:00:00'){
                

                  const isLastNumb = (element:any) => element.chrono === '00:00:00';
                  // on recupere  le dernier indice ou le chrono est  à 00:00:00;
  
  
                  indexOflast = exercise.events.findLastIndex(isLastNumb);
  
                  // Si l'heure est la même que celle de départ du step
                  if(exercise.events[inde-1].hours === event.hours){
                    // let newhoursChrono = event.hours - exercise.events[indexOflast].hours;
  
                    // Nous calculons, le temps écoulé depuis le depart du step
                    let newminsChrono =  event.mins - exercise.events[indexOflast].mins;
                    let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[indexOflast].scds;
                    let newmlscdsChrono;
                    if(newscdsChrono < 60 ){
                      newminsChrono = 0;
                      // newhoursChrono = 0;
                    }
                    if(newscdsChrono >59){
                        newminsChrono = Math.floor(newscdsChrono/60)
                        newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                    }
                    if(exercise.events[indexOflast].mlscs > event.mlscs){
                        newmlscdsChrono = event.mlscs+1000;
                        newscdsChrono = newscdsChrono-1;
                    }else{
                        newmlscdsChrono = event.mlscs;
                    }
                    if(newminsChrono < 10){
                        if(newscdsChrono < 10){
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }else{
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }
                    }else{
                        if(newscdsChrono < 10){
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }else{
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }
                    }
  
  
                    if(event.chrono.length - 1 > 7){
                        event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                    }
  
                    // Calcul du temps écoulé depuis le lancement de la nouvelle action avant réaction = actionTotalTime
                    let newmins =  event.mins - exercise.events[inde-1].mins;
                    let newscds = (event.scds +(newmins *60)) - exercise.events[inde-1].scds;
                    let newmlscds;
  
                    if(newscds < 60 ){
                      newmins = 0;
                      // newhours =0;
                    }
                    if(newscds >59){
                        newmins = Math.floor(newscds/60)
                        newscds = newscds-(Math.floor(newscds/60)*60)
                    }
                    if(exercise.events[inde-1].mlscs > event.mlscs){
                        newmlscds = event.mlscs+1000;
                        newscds = newscds-1;
                    }else{
                        newmlscds = event.mlscs;
                    }
                    // console.log('LE RESULT EN MLLSCDS ',newmlscds-exercise.events[inde-1].mlscs)
  
                    // console.log('TOTAL TIME after the previous start', newmins,':'+newscds,':',newmlscds-ex.events[inde-1].mlscs);
                    if(newmins < 10){
                        if(newscds < 10){
                            if(newmlscds-exercise.events[inde-1].mlscs < 10){
                                event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }else{
                                event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }
  
                        }else{
                            if(newmlscds-exercise.events[inde-1].mlscs < 10){
                                event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }else{
                                event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }
                        }
                    }else{
                        if(newscds < 10){
                            if(newmlscds-exercise.events[inde-1].mlscs < 10){
                                event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }else{
                                event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }
  
                        }else{
                            if(newmlscds-exercise.events[inde-1].mlscs < 10){
                                event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }else{
                                event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }
                        }
                    }
                    if(event.actionTotalTime.length - 1 > 7){
                        event.actionTotalTime = event.actionTotalTime.slice(0, event.actionTotalTime.length - 1);
                    }
  
                    //
                    let newArray = exercise.events.filter((el:any,i:any)=> i < inde )
                    const isLastNumbBefore = (element:any) => element.kind === 'action' && element.action !== 'jump';
                    // Ici l'on recherche la durée de l'etape ou de la répétition
                    let result = newArray.findLastIndex(isLastNumbBefore)
  
                    if(event.chrono === event.actionTotalTime){
                      // console.log('meme timing !! ')
                      event.timePreviousLastAction = '00:00:00';
                    }else{
                      if(exercise.events[result] !== undefined){
  
                        if(exercise.events[result].timePreviousLastAction !== undefined){
                          if(exercise.events[result].number === event.number){
                            let previoustime = exercise.events[result].chrono.split(':')
                            let time = event.chrono.split(':')
                            // console.log('SPLIT : ! ',time, previoustime);
                            // let hoursPreviousTotalTime
                            // let minsPreviousTotalTime
                            let scdsPreviousTotalTime  =  Number(time[1])  -Number(previoustime[1]);
                            let mlscdsPreviousTotalTime =  Number(time[2]) -Number(previoustime[2]);
  
                            // console.log(Math.sign(mlscdsPreviousTotalTime));
                                if(Math.sign(mlscdsPreviousTotalTime) == -1){
                                    // console.log('SPLIT : UNDER ! ',scdsPreviousTotalTime, mlscdsPreviousTotalTime);
                                    // console.log(Math.sign(mlscdsPreviousTotalTime));
                                    mlscdsPreviousTotalTime = (Number(time[2])+100) -Number(previoustime[2]);
                                    scdsPreviousTotalTime = scdsPreviousTotalTime-1;
                                }
                                // console.log('SPLIT : ! ',scdsPreviousTotalTime, mlscdsPreviousTotalTime);
                                if(scdsPreviousTotalTime< 10){
                                    if(mlscdsPreviousTotalTime < 10){
                                        event.timePreviousLastAction =  '00:0'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                    }else{
                                        event.timePreviousLastAction = '00:0'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                    }
  
                                }else{
                                    if(mlscdsPreviousTotalTime < 10){
                                        event.timePreviousLastAction =  '00:'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                    }else{
                                        event.timePreviousLastAction = '00:'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                    }
                                }
  
                                // on insere dans ce cas le temps la durée de l'etape ou de la répétition avec la variable, timePreviousLastAction
                            }
                          }else{
  
                          }
                        }
                      }
                    }
                  }
                  if(exercise.events[inde-1].hours < event.hours){
  
                    // Chronometre depuis le lancement de l'exercice, pour le début de chaque étapes
                    let newhoursChrono = event.hours - exercise.events[indexOflast].hours;
                    let newminsChrono =  (event.mins+(newhoursChrono*60)) - exercise.events[indexOflast].mins;
                    let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[indexOflast].scds;
                    let newmlscdsChrono;
                    if(newscdsChrono <60 ){
                      newminsChrono = 0;
                      newhoursChrono =0;
                    }
                    if(newscdsChrono >59){
                        newminsChrono = Math.floor(newscdsChrono/60)
                        newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                    }
                    if(exercise.events[indexOflast].mlscs > event.mlscs){
                        newmlscdsChrono = event.mlscs+1000;
                        newscdsChrono = newscdsChrono-1;
                    }else{
                        newmlscdsChrono = event.mlscs;
                    }
                    if(newminsChrono < 10){
                        if(newscdsChrono < 10){
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }else{
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }
                    }else{
                        if(newscdsChrono < 10){
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }else{
                            if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                                event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }else{
                                event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                            }
                        }
                    }
                    if(event.chrono.length - 1 > 7){
                        event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                    }
  
                    // le temps de l\'action depius le début le début de  l\'étape
                    let newhours= event.hours - exercise.events[inde-1].hours;
                    let newmins =  (event.mins+(newhours*60)) - exercise.events[inde-1].mins;
                    let newscds = (event.scds +(newmins *60)) - exercise.events[inde-1].scds;
                    let newmlscds;
  
                    if(newscds <60 ){
                      newmins = 0;
                      newhours =0;
                    }
                    if(newscds >59){
                        newmins = Math.floor(newscds/60)
                        newscds = newscds-(Math.floor(newscds/60)*60)
                    }
                    if(exercise.mlscs > event.mlscs){
                        newmlscds = event.mlscs+1000;
                        newscds = newscds-1;
                    }else{
                        newmlscds = event.mlscs;
                    }
                    // console.log('LE RESULT EN MLLSCDS ',newmlscds-ex.events[inde-1].mlscs)
                    if(newmins < 10){
                        if(newscds < 10){
                            if(newmlscds-exercise.events[inde-1].mlscs < 10){
                                event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }else{
                                event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }
  
                        }else{
                            if(newmlscds-exercise.events[inde-1].mlscs < 10){
                                event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }else{
                                event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }
                        }
                    }else{
                        if(newscds < 10){
                            if(newmlscds-exercise.events[inde-1].mlscs < 10){
                                event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }else{
                                event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }
  
                        }else{
                            if(newmlscds-exercise.events[inde-1].mlscs < 10){
                                event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }else{
                                event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                            }
                        }
                    }
                    if(event.actionTotalTime.length - 1 > 7){
                        event.actionTotalTime = event.actionTotalTime.slice(0, event.actionTotalTime.length - 1);
                    }
  
                    // Ici l'on recherche la durée de l'etape ou de la répétition
                    let newArray = exercise.events.filter((el:any,i:any)=> i < inde )
                    const isLastNumbBefore = (element:any) => element.kind === 'action' && element.action !== 'jump';
                    let result = newArray.findLastIndex(isLastNumbBefore)
  
                    if(event.chrono === event.actionTotalTime){
                            // console.log('meme timing !! ')
                            event.timePreviousLastAction = '00:00:00';
                    }else{
                        if(exercise.events[result] !== undefined){
                            if(exercise.events[result].timePreviousLastAction !== undefined){
                                if(exercise.events[result].number === event.number){
                                    let previoustime = exercise.events[result].chrono.split(':')
                                    let time = event.chrono.split(':')
                                    let scdsPreviousTotalTime  =  Number(time[1])  -Number(previoustime[1]);
                                    let mlscdsPreviousTotalTime =  Number(time[2]) -Number(previoustime[2]);
                                    if(Math.sign(mlscdsPreviousTotalTime) == -1){
                                        // console.log('SPLIT : UNDER ! ',scdsPreviousTotalTime, mlscdsPreviousTotalTime);
                                        // console.log(Math.sign(mlscdsPreviousTotalTime));
                                        mlscdsPreviousTotalTime = (Number(time[2])+100) -Number(previoustime[2]);
                                        scdsPreviousTotalTime = scdsPreviousTotalTime-1;
                                    }
                                    if(scdsPreviousTotalTime< 10){
                                        if(mlscdsPreviousTotalTime < 10){
                                            event.timePreviousLastAction =  '00:0'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                        }else{
                                            event.timePreviousLastAction = '00:0'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                        }
  
                                    }else{
                                        if(mlscdsPreviousTotalTime < 10){
                                            event.timePreviousLastAction =  '00:'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                        }else{
                                            event.timePreviousLastAction = '00:'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                        }
                                    }
                                    // console.log('SPLIT : ! ',scdsPreviousTotalTime, mlscdsPreviousTotalTime);
                                }
                            }else{
                                // console.log('pas le meme timing !! ',event.chrono,event.actionTotalTime,ex.events[result].event.number,event.event.number )
                                // console.log('LAST ACTION JUMP',ex.events[result]);
                                // console.log('EX EVENTS START JUMP : ',ex.events[indexOflast], 'EVENT', event)
                            }
                            }
                            }
  
                  }
  
                  // end of <
                  // img:event.imgActionWhite,
                  // person:event.person,
                  // totaltime:event.actionTotalTime,
                  // DataBind.push({index:event.index,step:event.step,action:event.action, loop:exercise.totalOfLoop, chrono:event.chrono, totaltime:event.actionTotalTime, timeprevious: event.timePreviousLastAction})  
                  // functions.logger.log("Reelle fin d'un step ", exercise.events[indexOflast] ,'LE EVENT ',event ,inde)
                  // functions.logger.log("Reelle fin d'un step ", event.hours,':',event.mins,':',event.scds,':',event.mlscs)
                
                  // if(event.chrono !== undefined){
                  //   functions.logger.log("Time previous last action loop :: ",event.timePreviousLastAction, event) 
                  //   if(event.timePreviousLastAction === "00:00:00" || event.timePreviousLastAction === undefined){
                  //     functions.logger.log("DataBind Action START loop: In action loop", DataBind[DataBind.length-1].eventToDisplay ,'LAST EVENT',exercise.events[inde-1],'THIS EVENT',event) 
                      
                  //     // functions.logger.log("LOG TIME IN LOCAL TIME", new Date(exercise.events[inde-1].date).toLocaleTimeString('fr-FR') )
                  //     let STARTTIME = new Date(exercise.events[inde-1].date).toLocaleTimeString('fr-FR')
                  //     DataBind[DataBind.length-1].eventToDisplay.push({
                  //         index: exercise.events[inde-1].number,
                  //         chronoTime: exercise.events[inde-1].chrono,
                  //         participants: exercise.events[inde-1].person,
                  //         startTime: STARTTIME,
                  //         endTime: "",
                  //         totalTime: "",
                  //         actions:[]
                  //     })
                  //     DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].actions.push({
                  //           deltaLastAction: event.timePreviousLastAction,
                  //           chrono: event.chrono,
                  //           icon: event.action,
                  //           econe: event.pod_index,
                  //           timeInStep: event.actionTotalTime
                  //     })
                  //   }else{
                  //     functions.logger.log("DataBind Action START loop 2: In action loop", event) 
                  //     DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].actions.push({
                  //       deltaLastAction: event.timePreviousLastAction,
                  //       chrono: event.chrono,
                  //       icon: event.action,
                  //       econe: event.pod_index,
                  //       timeInStep: event.actionTotalTime
                  //     })
                  //   }
                 
                  //   functions.logger.log("End of action type loop : index: ", event.pod_index ,'action ',event.action, 'loop:',exercise.totalOfLoop,'chrono:',event.chrono, 'totaltime:',event.actionTotalTime,'timeprevious',event.timePreviousLastAction )
                  // }else{
  
                  //   // functions.logger.log("End of action type 1 Undefined ? ", event )
                  //   // functions.logger.log("End of action type 1 : index: ", event.pod_index ,'action ',event.action, 'loop:',exercise.totalOfLoop,'chrono:',event.chrono, 'totaltime:',event.actionTotalTime,'timeprevious',event.timePreviousLastAction )
                  // }
              }
              // functions.logger.log("LE EVENT ACTION ", event )
              if(exercise.modeType === 'time_with_jump' && event.chrono !== '00:00:00'){
                

                const isLastNumb = (element:any) => element.chrono === '00:00:00';
                // on recupere  le dernier indice ou le chrono est  à 00:00:00;


                indexOflast = exercise.events.findLastIndex(isLastNumb);

                // Si l'heure est la même que celle de départ du step
                if(exercise.events[inde-1].hours === event.hours){
                  // let newhoursChrono = event.hours - exercise.events[indexOflast].hours;

                  // Nous calculons, le temps écoulé depuis le depart du step
                  let newminsChrono =  event.mins - exercise.events[indexOflast].mins;
                  let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[indexOflast].scds;
                  let newmlscdsChrono;
                  if(newscdsChrono < 60 ){
                    newminsChrono = 0;
                    // newhoursChrono = 0;
                  }
                  if(newscdsChrono >59){
                      newminsChrono = Math.floor(newscdsChrono/60)
                      newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                  }
                  if(exercise.events[indexOflast].mlscs > event.mlscs){
                      newmlscdsChrono = event.mlscs+1000;
                      newscdsChrono = newscdsChrono-1;
                  }else{
                      newmlscdsChrono = event.mlscs;
                  }
                  if(newminsChrono < 10){
                      if(newscdsChrono < 10){
                          if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                              event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }else{
                              event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }
                      }else{
                          if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                              event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }else{
                              event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }
                      }
                  }else{
                      if(newscdsChrono < 10){
                          if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                              event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }else{
                              event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }
                      }else{
                          if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                              event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }else{
                              event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }
                      }
                  }


                  if(event.chrono.length - 1 > 7){
                      event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                  }

                  // Calcul du temps écoulé depuis le lancement de la nouvelle action avant réaction = actionTotalTime
                  let newmins =  event.mins - exercise.events[inde-1].mins;
                  let newscds = (event.scds +(newmins *60)) - exercise.events[inde-1].scds;
                  let newmlscds;

                  if(newscds < 60 ){
                    newmins = 0;
                    // newhours =0;
                  }
                  if(newscds >59){
                      newmins = Math.floor(newscds/60)
                      newscds = newscds-(Math.floor(newscds/60)*60)
                  }
                  if(exercise.events[inde-1].mlscs > event.mlscs){
                      newmlscds = event.mlscs+1000;
                      newscds = newscds-1;
                  }else{
                      newmlscds = event.mlscs;
                  }
                  // console.log('LE RESULT EN MLLSCDS ',newmlscds-exercise.events[inde-1].mlscs)

                  // console.log('TOTAL TIME after the previous start', newmins,':'+newscds,':',newmlscds-ex.events[inde-1].mlscs);
                  if(newmins < 10){
                      if(newscds < 10){
                          if(newmlscds-exercise.events[inde-1].mlscs < 10){
                              event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }else{
                              event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }

                      }else{
                          if(newmlscds-exercise.events[inde-1].mlscs < 10){
                              event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }else{
                              event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }
                      }
                  }else{
                      if(newscds < 10){
                          if(newmlscds-exercise.events[inde-1].mlscs < 10){
                              event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }else{
                              event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }

                      }else{
                          if(newmlscds-exercise.events[inde-1].mlscs < 10){
                              event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }else{
                              event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }
                      }
                  }
                  if(event.actionTotalTime.length - 1 > 7){
                      event.actionTotalTime = event.actionTotalTime.slice(0, event.actionTotalTime.length - 1);
                  }

                  //
                  let newArray = exercise.events.filter((el:any,i:any)=> i < inde )
                  const isLastNumbBefore = (element:any) => element.kind === 'action' && element.action !== 'jump';
                  // Ici l'on recherche la durée de l'etape ou de la répétition
                  let result = newArray.findLastIndex(isLastNumbBefore)

                  if(event.chrono === event.actionTotalTime){
                    // console.log('meme timing !! ')
                    event.timePreviousLastAction = '00:00:00';
                  }else{
                    if(exercise.events[result] !== undefined){

                      if(exercise.events[result].timePreviousLastAction !== undefined){
                        if(exercise.events[result].number === event.number){
                          let previoustime = exercise.events[result].chrono.split(':')
                          let time = event.chrono.split(':')
                          // console.log('SPLIT : ! ',time, previoustime);
                          // let hoursPreviousTotalTime
                          // let minsPreviousTotalTime
                          let scdsPreviousTotalTime  =  Number(time[1])  -Number(previoustime[1]);
                          let mlscdsPreviousTotalTime =  Number(time[2]) -Number(previoustime[2]);

                          // console.log(Math.sign(mlscdsPreviousTotalTime));
                              if(Math.sign(mlscdsPreviousTotalTime) == -1){
                                  // console.log('SPLIT : UNDER ! ',scdsPreviousTotalTime, mlscdsPreviousTotalTime);
                                  // console.log(Math.sign(mlscdsPreviousTotalTime));
                                  mlscdsPreviousTotalTime = (Number(time[2])+100) -Number(previoustime[2]);
                                  scdsPreviousTotalTime = scdsPreviousTotalTime-1;
                              }
                              // console.log('SPLIT : ! ',scdsPreviousTotalTime, mlscdsPreviousTotalTime);
                              if(scdsPreviousTotalTime< 10){
                                  if(mlscdsPreviousTotalTime < 10){
                                      event.timePreviousLastAction =  '00:0'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                  }else{
                                      event.timePreviousLastAction = '00:0'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                  }

                              }else{
                                  if(mlscdsPreviousTotalTime < 10){
                                      event.timePreviousLastAction =  '00:'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                  }else{
                                      event.timePreviousLastAction = '00:'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                  }
                              }

                              // on insere dans ce cas le temps la durée de l'etape ou de la répétition avec la variable, timePreviousLastAction
                          }
                        }else{

                        }
                      }
                    }
                  }
                }
                if(exercise.events[inde-1].hours < event.hours){

                  // Chronometre depuis le lancement de l'exercice, pour le début de chaque étapes
                  let newhoursChrono = event.hours - exercise.events[indexOflast].hours;
                  let newminsChrono =  (event.mins+(newhoursChrono*60)) - exercise.events[indexOflast].mins;
                  let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[indexOflast].scds;
                  let newmlscdsChrono;
                  if(newscdsChrono <60 ){
                    newminsChrono = 0;
                    newhoursChrono =0;
                  }
                  if(newscdsChrono >59){
                      newminsChrono = Math.floor(newscdsChrono/60)
                      newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                  }
                  if(exercise.events[indexOflast].mlscs > event.mlscs){
                      newmlscdsChrono = event.mlscs+1000;
                      newscdsChrono = newscdsChrono-1;
                  }else{
                      newmlscdsChrono = event.mlscs;
                  }
                  if(newminsChrono < 10){
                      if(newscdsChrono < 10){
                          if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                              event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }else{
                              event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }
                      }else{
                          if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                              event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }else{
                              event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }
                      }
                  }else{
                      if(newscdsChrono < 10){
                          if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                              event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }else{
                              event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }
                      }else{
                          if(newmlscdsChrono-exercise.events[indexOflast].mlscs < 10){
                              event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':0'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }else{
                              event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[indexOflast].mlscs).toString()
                          }
                      }
                  }
                  if(event.chrono.length - 1 > 7){
                      event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                  }

                  // le temps de l\'action depius le début le début de  l\'étape
                  let newhours= event.hours - exercise.events[inde-1].hours;
                  let newmins =  (event.mins+(newhours*60)) - exercise.events[inde-1].mins;
                  let newscds = (event.scds +(newmins *60)) - exercise.events[inde-1].scds;
                  let newmlscds;

                  if(newscds <60 ){
                    newmins = 0;
                    newhours =0;
                  }
                  if(newscds >59){
                      newmins = Math.floor(newscds/60)
                      newscds = newscds-(Math.floor(newscds/60)*60)
                  }
                  if(exercise.mlscs > event.mlscs){
                      newmlscds = event.mlscs+1000;
                      newscds = newscds-1;
                  }else{
                      newmlscds = event.mlscs;
                  }
                  // console.log('LE RESULT EN MLLSCDS ',newmlscds-ex.events[inde-1].mlscs)
                  if(newmins < 10){
                      if(newscds < 10){
                          if(newmlscds-exercise.events[inde-1].mlscs < 10){
                              event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }else{
                              event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }

                      }else{
                          if(newmlscds-exercise.events[inde-1].mlscs < 10){
                              event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }else{
                              event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }
                      }
                  }else{
                      if(newscds < 10){
                          if(newmlscds-exercise.events[inde-1].mlscs < 10){
                              event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }else{
                              event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }

                      }else{
                          if(newmlscds-exercise.events[inde-1].mlscs < 10){
                              event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }else{
                              event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                          }
                      }
                  }
                  if(event.actionTotalTime.length - 1 > 7){
                      event.actionTotalTime = event.actionTotalTime.slice(0, event.actionTotalTime.length - 1);
                  }

                  // Ici l'on recherche la durée de l'etape ou de la répétition
                  let newArray = exercise.events.filter((el:any,i:any)=> i < inde )
                  const isLastNumbBefore = (element:any) => element.kind === 'action' && element.action !== 'jump';
                  let result = newArray.findLastIndex(isLastNumbBefore)

                  if(event.chrono === event.actionTotalTime){
                          // console.log('meme timing !! ')
                          event.timePreviousLastAction = '00:00:00';
                  }else{
                      if(exercise.events[result] !== undefined){
                          if(exercise.events[result].timePreviousLastAction !== undefined){
                              if(exercise.events[result].number === event.number){
                                  let previoustime = exercise.events[result].chrono.split(':')
                                  let time = event.chrono.split(':')
                                  let scdsPreviousTotalTime  =  Number(time[1])  -Number(previoustime[1]);
                                  let mlscdsPreviousTotalTime =  Number(time[2]) -Number(previoustime[2]);
                                  if(Math.sign(mlscdsPreviousTotalTime) == -1){
                                      // console.log('SPLIT : UNDER ! ',scdsPreviousTotalTime, mlscdsPreviousTotalTime);
                                      // console.log(Math.sign(mlscdsPreviousTotalTime));
                                      mlscdsPreviousTotalTime = (Number(time[2])+100) -Number(previoustime[2]);
                                      scdsPreviousTotalTime = scdsPreviousTotalTime-1;
                                  }
                                  if(scdsPreviousTotalTime< 10){
                                      if(mlscdsPreviousTotalTime < 10){
                                          event.timePreviousLastAction =  '00:0'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                      }else{
                                          event.timePreviousLastAction = '00:0'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                      }

                                  }else{
                                      if(mlscdsPreviousTotalTime < 10){
                                          event.timePreviousLastAction =  '00:'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                      }else{
                                          event.timePreviousLastAction = '00:'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                      }
                                  }
                                  // console.log('SPLIT : ! ',scdsPreviousTotalTime, mlscdsPreviousTotalTime);
                              }
                          }else{
                              // console.log('pas le meme timing !! ',event.chrono,event.actionTotalTime,ex.events[result].event.number,event.event.number )
                              // console.log('LAST ACTION JUMP',ex.events[result]);
                              // console.log('EX EVENTS START JUMP : ',ex.events[indexOflast], 'EVENT', event)
                          }
                          }
                          }

                }

                // end of <
                // img:event.imgActionWhite,
                // person:event.person,
                // totaltime:event.actionTotalTime,
                // DataBind.push({index:event.index,step:event.step,action:event.action, loop:exercise.totalOfLoop, chrono:event.chrono, totaltime:event.actionTotalTime, timeprevious: event.timePreviousLastAction})  
                // functions.logger.log("Reelle fin d'un step ", exercise.events[indexOflast] ,'LE EVENT ',event ,inde)
                // functions.logger.log("Reelle fin d'un step ", event.hours,':',event.mins,':',event.scds,':',event.mlscs)
              
                if(event.chrono !== undefined){
                  if(event.timePreviousLastAction === "00:00:00" || event.timePreviousLastAction === undefined){
                    functions.logger.log("DataBind Action START time_with_jump: In action", DataBind[DataBind.length-1].eventToDisplay ,'LAST EVENT',exercise.events[inde-1],'THIS EVENT',event) 
                    
                    // functions.logger.log("LOG TIME IN LOCAL TIME", new Date(exercise.events[inde-1].date).toLocaleTimeString('fr-FR') )
                    let STARTTIME = new Date(exercise.events[inde-1].date).toLocaleTimeString('fr-FR')
                    DataBind[DataBind.length-1].eventToDisplay.push({
                        index: exercise.events[inde-1].number,
                        chronoTime: exercise.events[inde-1].chrono,
                        participants: exercise.events[inde-1].person,
                        startTime: STARTTIME,
                        endTime: "",
                        totalTime: "",
                        actions:[]
                    })
                    DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].actions.push({
                          deltaLastAction: event.timePreviousLastAction,
                          chrono: event.chrono,
                          icon: event.action,
                          econe: event.pod_index,
                          timeInStep: event.actionTotalTime
                    })
                  }else{
                    functions.logger.log("DataBind Action START time_with_jump 2: In action", event) 
                    DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].actions.push({
                      deltaLastAction: event.timePreviousLastAction,
                      chrono: event.chrono,
                      icon: event.action,
                      econe: event.pod_index,
                      timeInStep: event.actionTotalTime
                    })
                  }
               
                  functions.logger.log("End of action type 1 : index: ", event.pod_index ,'action ',event.action, 'loop:',exercise.totalOfLoop,'chrono:',event.chrono, 'totaltime:',event.actionTotalTime,'timeprevious',event.timePreviousLastAction )
                }else{

                  // functions.logger.log("End of action type 1 Undefined ? ", event )
                  // functions.logger.log("End of action type 1 : index: ", event.pod_index ,'action ',event.action, 'loop:',exercise.totalOfLoop,'chrono:',event.chrono, 'totaltime:',event.actionTotalTime,'timeprevious',event.timePreviousLastAction )
                }
               
            }
              if(exercise.modeType === 'time'){
                
              if(exercise.events[inde-1].hours === event.hours){

                // Chrono de l'etape en cours
                // let newhoursChrono = event.hours - exercise.events[1].hours;
                let newminsChrono =  event.mins - exercise.events[1].mins;
                let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[1].scds;
                let newmlscdsChrono;
                if(newscdsChrono < 60 ){
                  newminsChrono = 0;
                  // newhoursChrono = 0;
                }
                if(newscdsChrono >59){
                    newminsChrono = Math.floor(newscdsChrono/60)
                    newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                }
                if(exercise.events[1].mlscs > event.mlscs){
                    newmlscdsChrono = event.mlscs+1000;
                    newscdsChrono = newscdsChrono-1;
                }else{
                    newmlscdsChrono = event.mlscs;
                }
                if(newminsChrono < 10){
                    if(newscdsChrono < 10){
                        event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[1].mlscs).toString()
                    }else{
                        event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[1].mlscs).toString()
                    }
                }else{
                    if(newscdsChrono < 10){
                        event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[1].mlscs).toString()
                    }else{
                        event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[1].mlscs).toString()
                    }
                }
                if(event.chrono.length - 1 > 7){
                    event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                }

                // Temps total de l'action depuis le depart de l'etape
                let newmins =  event.mins - exercise.events[inde-1].mins;
                let newscds = (event.scds +(newmins *60)) - exercise.events[inde-1].scds;
                let newmlscds;
                if(newscds < 60 ){
                  newmins = 0;
                  // newhours =0;
                }
                if(newscds >59){
                    newmins = Math.floor(newscds/60)
                    newscds = newscds-(Math.floor(newscds/60)*60)
                }
                if(exercise.events[inde-1].mlscs > event.mlscs){
                    newmlscds = event.mlscs+1000;
                    newscds = newscds-1;
                }else{
                    newmlscds = event.mlscs;
                }
                // console.log('TOTAL TIME after the previous start', newmins,':'+newscds,':',newmlscds-ex.events[inde-1].mlscs);
                if(newmins < 10){
                    if(newscds < 10){
                        if(newmlscds-exercise.events[inde-1].mlscs < 10){
                            event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }else{
                            event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }

                    }else{
                        if(newmlscds-exercise.events[inde-1].mlscs < 10){
                            event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }else{exercise
                            event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }
                    }
                }else{
                    if(newscds < 10){
                        if(newmlscds-exercise.events[inde-1].mlscs < 10){
                            event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }else{
                            event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }

                    }else{
                        if(newmlscds-exercise.events[inde-1].mlscs < 10){
                            event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }else{
                            event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }
                    }
                }
                event.actionTotalTime = event.actionTotalTime.slice(0, event.actionTotalTime.length - 1);

                let newArray = exercise.events.filter((el:any,i:number)=> i < inde )
                const isLastNumbBefore = (element:any) => element.kind === 'action';
                let result = newArray.findLastIndex(isLastNumbBefore)
                // functions.logger.log("Find the last element kind action ", result )
                // functions.logger.log("SAME START TIME IN MODE TIME 1:event.chrono === event.actionTotalTime ", event.chrono, event.actionTotalTime )
                if(event.chrono === event.actionTotalTime){
                    //console.log('meme timing !! WITHOUT JUMP')
                    // functions.logger.log("SAME START TIME IN MODE TIME 1:event.chrono === event.actionTotalTime ", event.chrono, event.actionTotalTime )
                    event.timePreviousLastAction = '00:00:00';
                }else{
                    if(exercise.events[result] !== undefined){
                      // functions.logger.log("exercise.events[result].timePreviousLastAction !== undefined ", exercise.events[result],exercise.events[result].timePreviousLastAction )
                        // console.log(ex.events[result])
                        if(exercise.events[result].timePreviousLastAction !== undefined){
                            if(exercise.events[result].number === event.number){
                                    let previoustime = exercise.events[result].chrono.split(':')
                                    let time = event.chrono.split(':')
                                    let scdsPreviousTotalTime  =  Number(time[1])  -Number(previoustime[1]);
                                    let mlscdsPreviousTotalTime =  Number(time[2]) -Number(previoustime[2]);
                                    if(Math.sign(mlscdsPreviousTotalTime) == -1){
                                        mlscdsPreviousTotalTime = (Number(time[2])+100) -Number(previoustime[2]);
                                        scdsPreviousTotalTime = scdsPreviousTotalTime-1;
                                    }
                                    if(scdsPreviousTotalTime< 10){
                                        if(mlscdsPreviousTotalTime < 10){
                                            event.timePreviousLastAction =  '00:0'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                        }else{
                                            event.timePreviousLastAction = '00:0'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                        }

                                    }else{
                                        if(mlscdsPreviousTotalTime < 10){
                                            event.timePreviousLastAction =  '00:'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                        }else{
                                            event.timePreviousLastAction = '00:'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                        }
                                    }
                            }
                        }
                    }
                }
                // DataBind.push({index:event.index,step:event.step,action:event.action,loop:exercise.totalOfLoop, chrono:event.chrono,totaltime:event.actionTotalTime,  timeprevious: event.timePreviousLastAction})
                // functions.logger.log("End of action type 2 : index: ", event.pod_index ,'action ',event.action, 'loop:',exercise.totalOfLoop,'chrono:',event.chrono, 'totaltime:',event.actionTotalTime,'timeprevious',event.timePreviousLastAction )
              }
                // img:event.imgActionWhite,
                // person:event.person,
                // totaltime:event.actionTotalTime,
              
              if(exercise.events[inde-1].hours < event.hours){
                let newhoursChrono = event.hours - exercise.events[1].hours;
                let newminsChrono =  (event.mins+(newhoursChrono*60)) - exercise.events[1].mins;
                let newscdsChrono = (event.scds +(newminsChrono *60)) - exercise.events[1].scds;
                let newmlscdsChrono;
                // let newscds;

                if(newscdsChrono <60 ){
                  newminsChrono = 0;
                  newhoursChrono =0;
                }
                if(newscdsChrono >59){
                    newminsChrono = Math.floor(newscdsChrono/60)
                    newscdsChrono = newscdsChrono-(Math.floor(newscdsChrono/60)*60)
                }
                if(exercise.events[1].mlscs > event.mlscs){
                    newmlscdsChrono = event.mlscs+1000;
                    newscdsChrono = newscdsChrono-1;
                }else{
                    newmlscdsChrono = event.mlscs;
                }
                if(newminsChrono < 10){
                    if(newscdsChrono < 10){
                        event.chrono = '0'+newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[1].mlscs).toString()
                    }else{
                        event.chrono = '0'+newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[1].mlscs).toString()
                    }
                }else{
                    if(newscdsChrono < 10){
                        event.chrono = newminsChrono.toString()+':0'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[1].mlscs).toString()
                    }else{
                        event.chrono = newminsChrono.toString()+':'+newscdsChrono.toString()+':'+(newmlscdsChrono-exercise.events[1].mlscs).toString()
                    }
                }
                if(event.chrono.length - 1 > 7){
                    event.chrono = event.chrono.slice(0, event.chrono.length - 1);
                }

                let newhours= event.hours - exercise.events[inde-1].hours;
                let newmins =  (event.mins+(newhours*60)) - exercise.events[inde-1].mins;
                let newscds = (event.scds +(newmins *60)) - exercise.events[inde-1].scds;
                let newmlscds;

                if(newscds <60 ){
                  newmins = 0;
                  newhours =0;
                }
                if(newscds >59){
                    newmins = Math.floor(newscds/60)
                    newscds = newscds-(Math.floor(newscds/60)*60)
                }
                if(exercise.mlscs > event.mlscs){
                    newmlscds = event.mlscs+1000;
                    newscds = newscds-1;
                }else{
                    newmlscds = event.mlscs;
                }
                if(newmins < 10){
                    if(newscds < 10){
                        if(newmlscds-exercise.events[inde-1].mlscs < 10){
                            event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }else{
                            event.actionTotalTime = '0'+newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }

                    }else{
                        if(newmlscds-exercise.events[inde-1].mlscs < 10){
                            event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }else{
                            event.actionTotalTime = '0'+newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }
                    }
                }else{
                    if(newscds < 10){
                        if(newmlscds-exercise.events[inde-1].mlscs < 10){
                            event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }else{
                            event.actionTotalTime = newmins.toString()+':0'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }

                    }else{
                        if(newmlscds-exercise.events[inde-1].mlscs < 10){
                            event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':0'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }else{
                            event.actionTotalTime = newmins.toString()+':'+newscds.toString()+':'+(newmlscds-exercise.events[inde-1].mlscs).toString()
                        }
                    }
                }



                event.actionTotalTime = event.actionTotalTime.slice(0, event.actionTotalTime.length - 1);
                let newArray = exercise.events.filter((el:any,i:number)=> i < inde )
                const isLastNumbBefore = (element:any) => element.kind === 'action';
                let result = newArray.findLastIndex(isLastNumbBefore)
                // functions.logger.log("Find the last element kind action ", result )
                // functions.logger.log("SAME START TIME IN MODE TIME 1:event.chrono === event.actionTotalTime ", event.chrono, event.actionTotalTime )
                if(event.chrono === event.actionTotalTime){
                    //console.log('meme timing !! WITHOUT JUMP')
                    event.timePreviousLastAction = '00:00:00';
                }else{
                    if(exercise.events[result] !== undefined){
                      // functions.logger.log("exercise.events[result].timePreviousLastAction !== undefined ", exercise.events[result],exercise.events[result].timePreviousLastAction )
                        if(exercise.events[result].timePreviousLastAction !== undefined){
                             if(exercise.events[result].number === event.number){
                                    console.log('EX EVENTS START JUMP : EVENT', event.chrono)
                                    let previoustime = exercise.events[result].chrono.split(':')
                                    let time = event.chrono.split(':')
                                    let scdsPreviousTotalTime  =  Number(time[1])  -Number(previoustime[1]);
                                    let mlscdsPreviousTotalTime =  Number(time[2]) -Number(previoustime[2]);
                                    if(Math.sign(mlscdsPreviousTotalTime) == -1){
                                        mlscdsPreviousTotalTime = (Number(time[2])+100) -Number(previoustime[2]);
                                        scdsPreviousTotalTime = scdsPreviousTotalTime-1;
                                    }
                                    if(scdsPreviousTotalTime< 10){
                                        if(mlscdsPreviousTotalTime < 10){
                                            event.timePreviousLastAction =  '00:0'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                        }else{
                                            event.timePreviousLastAction = '00:0'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                        }

                                    }else{
                                        if(mlscdsPreviousTotalTime < 10){
                                            event.timePreviousLastAction =  '00:'+scdsPreviousTotalTime.toString()+':0'+mlscdsPreviousTotalTime.toString()
                                        }else{
                                            event.timePreviousLastAction = '00:'+scdsPreviousTotalTime.toString()+':'+mlscdsPreviousTotalTime.toString()
                                        }
                                    }
                                    //console.log('SPLIT : ! ',event.timePreviousLastAction);
                            }
                        }
                    }
                }
                // img:event.imgActionWhite,
                // person:event.person,
                // totaltime:event.actionTotalTime,
                // DataBind.push({index:event.index,step:event.step,action:event.action,loop:exercise.totalOfLoop, chrono:event.chrono,totaltime:event.actionTotalTime, timeprevious: event.timePreviousLastAction})
                functions.logger.log("End of action type 3 : index: ", event.pod_index ,'action ',event.action, 'loop:',exercise.totalOfLoop,'chrono:',event.chrono, 'totaltime:',event.actionTotalTime,'timeprevious',event.timePreviousLastAction )
           
              }
              if(event.timePreviousLastAction === "00:00:00" || event.timePreviousLastAction === undefined){
                functions.logger.log("DataBind Action START time: In action", DataBind[DataBind.length-1].eventToDisplay ,'LAST EVENT',exercise.events[inde-1],'THIS EVENT',event) 
                
                // functions.logger.log("LOG TIME IN LOCAL TIME", new Date(exercise.events[inde-1].date).toLocaleTimeString('fr-FR') )
                      let STARTTIME = new Date(exercise.events[inde-1].date).toLocaleTimeString('fr-FR');
                DataBind[DataBind.length-1].eventToDisplay.push({
                    index: exercise.events[inde-1].number,
                    chronoTime: exercise.events[inde-1].chrono,
                    participants: exercise.events[inde-1].person,
                    startTime: STARTTIME,
                    endTime: "",
                    totalTime: "",
                    actions:[]
                })
                DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].actions.push({
                      deltaLastAction: event.timePreviousLastAction,
                      chrono: event.chrono,
                      icon: event.action,
                      econe: event.pod_index,
                      timeInStep: event.actionTotalTime
                })
              }else{
                functions.logger.log("DataBind STEP START time 2: In action",  event) 
                DataBind[DataBind.length-1].eventToDisplay[DataBind[DataBind.length-1].eventToDisplay.length-1].actions.push({
                  deltaLastAction: event.timePreviousLastAction,
                  chrono: event.chrono,
                  icon: event.action,
                  econe: event.pod_index,
                  timeInStep: event.actionTotalTime
                })
              }
                functions.logger.log("End of action type 2 : index: ", event.pod_index ,'action ',event.action, 'loop:',exercise.totalOfLoop,'chrono:',event.chrono, 'totaltime:',event.actionTotalTime,'timeprevious',event.timePreviousLastAction )
              }
          }
          else{
              functions.logger.log("MODE LOOP ")
          }
          // functions.logger.log("End of action type 3 : index: ", event.index ,'action ',event.action, 'loop:',exercise.totalOfLoop,'chrono:',event.chrono, 'totaltime:',event.actionTotalTime,'timeprevious',event.timePreviousLastAction )
        }
      })

    


    })
    // let dataReport: any  = {results: dataBinding, reports: results }
    // results: dataBinding, reports: results,

    // functions.logger.log("DATA DECODED ERROR: dataBinding! ", dataBinding)
    // functions.logger.log("DATA DECODED ERROR: ! ", data)
    try {

      
      // const results_handler = db.collection('results-handler');
      // DataBind.forEach((exercise:any)=>{
      //   let newUuidExercise = uuidv4();
      //   functions.logger.log("DATA DECODED ERROR: resultsS INSERT ! EXERCISE :: !  ",exercise)
      //   results_handler.doc(newUuidExercise).set(data).then( async (ref:any) => {
      //     functions.logger.log("Push With REf! ",exercise)
      //     // return res.status(200).json({
      //     //   response: {
      //     //       result:'success',
      //     //       message:''
      //     //   },
      //     //   result:DataBind
      //     // })
  
      //   })
      // })
      // results_handler.doc(newUuid).set(data).then( async (ref:any) => {
        return res.status(200).json({
          response: {
              result:'success',
              message:''
          },
          result:DataBind
        })

      // })

    }
    catch(error:any) { return res.status(500).json(error.message) }
  }



  // Exercise details
const getResultsList = async (req: any, res: any) => {
  //
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  let idUser = headers.id;
  // let resultNumber =  headers.resultnumber;
  let results: any = [];
  try {
    // sign token
    jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:'Votre token a expiré'
            },
          });
        }else {
            let resultsHandler = await db.collection('results-handler').where('idAccount', '==', idUser).get();
            // functions.logger.log("Result handler resp with Iduser ", resultsHandler)
            if(resultsHandler.size !== 0){
            resultsHandler.forEach(async (doc:any) =>{
                // functions.logger.log("Result handler resp with Iduser ", doc);
                results.push(doc.data());
            });
            functions.logger.log("Result NOT SORT ", results);
            // results = results.sort(function(a:any,b:any){
            //   // Turn your strings into dates, and then subtract them
            //   // to get a value that is either negative, positive, or zero.
            //   return new Date(b.result.infos.startDate) - new Date(a.result.infos.startDate);
            // });
            functions.logger.log("Result SORT ", results[0].result);
            }

  //   let decodeds: any;
  //   let Exercise: any = [];
  //   let ExerciseDetails : {header:any, steps:any} = {header:"", steps:""};
  //   jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
  //       if(err) {
  //         decodeds = 'err';
          // return res.status(200).json({
          //   response: {
          //     result:'expiredTokenError',
          //     message:'Votre token a expiré'
          //   }
          //   token:token,
          //   decoded:decodeds
          // });
  //       } else {
  //         decodeds = 'no error';
  //         const querySnapshot = await db.collection('exercise-handler').doc(idExercise).get();
  //         Exercise = querySnapshot.data();
  //         // ExerciseDetail.header = Exercise.header;
  //         // ExerciseDetail.steps = Exercise.steps;
  //         ExerciseDetails.header = Exercise.header;
  //         ExerciseDetails.steps = Exercise.steps;
  //         return res.status(200).json({
  //           response: {
  //             result:'success',
  //             message:'Requête effectuée avec succès'
  //           },
  //           ExerciseDetails:ExerciseDetails,
  //           token: token,
  //           username:username,
  //           decoded: decodeds
  //         });
  //       }
  //   });
        return res.status(200).json({
            response: {
                result:'success',
                message:''
            },
            idUser:idUser,
            // resultsHandlerSize:resultsHandler.size,
            // resultsHandler:resultsHandler,
            results:results
            // data:data
        })
        }
    })
  } catch(error:any) { return res.status(500).json(error.message) }
}



  export { createResult, getResultsList, createResultOld }
