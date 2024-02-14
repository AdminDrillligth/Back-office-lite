// import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'
import { v4 as uuidv4 } from 'uuid';
// var jwt = require("jsonwebtoken");
// // var btoa = require('btoa');
// var DateString = new Date().toLocaleDateString('en-GB');
// var isoDateString = new Date().toISOString();

// createResult
const createResult = async (req: any, res: any) => {
    // let newUuid = uuidv4();
    let newUuid = uuidv4();
    let reqs = req;
    let body = reqs.body;
    let results = body.reports;
    // let arrayOfKeys = ['date', 'time', 'pod_id','pod_index', 'person', 'kind', 'title','id','action','number','step','target','factor' ];
    functions.logger.log("DATA DECODED ERROR: ! ", results)
    let dataBinding :any = [];
    results.forEach((result:any) =>{
      dataBinding.push({coach:result.coach,idExercice: result.events[0].event.id,startTime:'', factor: result.factor ,events:[], title: result.events[0].event.title})

      result.events.forEach((event:any)=>{
      let splitedTime = new Date(Number(event.time)*1000).toLocaleTimeString();
      splitedTime.split(':');
      let hours = Number(splitedTime[0]+splitedTime[1]);
      let mins = Number(splitedTime[3]+splitedTime[4]);
      let scds = Number(splitedTime[6]+splitedTime[7]);
      let mlscs = new Date(Number(event.time)*1000).getMilliseconds();
      let parsedTime =  hours+':'+mins+':'+scds+':'+mlscs;
      dataBinding[dataBinding.length-1].startTime = parsedTime;
      dataBinding[dataBinding.length-1].events.push({
          date:event.date,
          hours:hours,
          mins:mins,
          scds:scds,
          mlscs:mlscs,
          startTime:parsedTime,
          time:event.time,
          pod_id:event.source.id,
          pod_index:event.source.index,
          person:event.person,
          kind:event.event.kind,
          title:event.event.title,
          action:event.event.action,
          step:event.event.step,
          target:event.event.target
       })
      });
    })
    dataBinding.forEach((exercice:any) =>{
      // 
      exercice.events.forEach((event:any, inde:number) =>{
        // This exercise start
        if(event.kind === 'exercise_start'){
          exercice.modeType = 'time';
          exercice.totalOfLoop = 0;
        }
        // this exercise end
        if(event.kind === 'exercise_end' ){
          // if mode time
          if(exercice.modeType === 'time'){
            exercice.totalOfLoop = 1; 
          }
        }
        //each step Start
        if(event.kind === 'step_start' ){
          if(exercice.startTime === event.startTime){
            event.chrono = '00:00:00';
            // event.imgActionWhite = 'loop-white.png';
            functions.logger.log("StartTime chrono  ", exercice)
          }
          // if mode is time_with_jump
          if(exercice.events[inde-1].action === 'jump' ){
            event.chrono = '00:00:00';
            exercice.totalOfLoop = exercice.totalOfLoop + 1;
            exercice.modeType = 'time_with_jump';
          }

        }
        if(event.kind === 'step_end' ){

        }
        if(event.kind === 'action' ){
          if(exercice.events[inde-1].kind === 'step_start'){

          }
          else{

          }
        }
      })
    })
    let data: any  = {results: dataBinding, reports: results }
    // functions.logger.log("DATA DECODED ERROR: resultsS! ", results[0].events)
    // functions.logger.log("DATA DECODED ERROR: dataBinding! ", dataBinding)
    // functions.logger.log("DATA DECODED ERROR: ! ", data)
    try {
      const results_handler = db.collection('results-handler');
      results_handler.doc(newUuid).set(data).then( async (ref:any) => {
        return res.status(200).json({
          response: {
              result:'success',
              message:''
          },
          data:data
        })

      })

    }
    catch(error:any) { return res.status(500).json(error.message) }
  }




  export { createResult }
