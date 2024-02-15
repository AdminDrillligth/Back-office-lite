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
    // functions.logger.log("DATA DECODED ERROR: ! ", results)
    let dataBinding :any = [];
    results.forEach((result:any) =>{
      dataBinding.push({coach:result.coach,idExercise: result.events[0].event.id,startTime:'', factor: result.factor ,events:[], title: result.events[0].event.title})

      result.events.forEach((event:any)=>{
      let splitedTime = new Date(Number(event.time)*1000).toLocaleTimeString();
      let split:any = splitedTime.split(':');
      // functions.logger.log("splitedTime chrono  ", splitedTime)
      
      // functions.logger.log("splitedTime chrono 2  ", split)
      let hours = Number(split[0]);
      let mins = Number(split[1]);
      let splitScds = split[2];
      let splitScdsNumber = splitScds.split(' ');
      // functions.logger.log("splitedTime chrono 3  ", splitScdsNumber)
      let scds = Number(splitScdsNumber[0]);
      let mlscs = new Date(Number(event.time)*1000).getMilliseconds();
      let parsedTime =  hours+':'+mins+':'+scds+':'+mlscs;

      if(event.event.kind === 'exercise_start'){
        dataBinding[dataBinding.length-1].startTime = parsedTime;
        dataBinding[dataBinding.length-1].hours = hours;
        dataBinding[dataBinding.length-1].mins = mins;
        dataBinding[dataBinding.length-1].scds = scds;
        dataBinding[dataBinding.length-1].mlscs = mlscs;
      }
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
    dataBinding.forEach((exercise:any) =>{
      // 
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
            // functions.logger.log("END exercise.hours === event.hours ", exercise.hours,event.hours )
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

        }
        //each step Start
        if(event.kind === 'step_start' ){
           functions.logger.log("STEP START exercise.hours === event.hours ", exercise.startTime, event.parsedTime )
          if(exercise.startTime === event.parsedTime){
            event.chrono = '00:00:00';
            // event.imgActionWhite = 'loop-white.png';
            // functions.logger.log("StartTime chrono  ", exercise)
          }
          // if mode is time_with_jump
          
           
          if(exercise.events[inde-1].action === 'jump' ){
            // functions.logger.log("exercise.events[inde-1].action ", exercise.events[inde-1].action, inde)
            event.chrono = '00:00:00';
            exercise.loopEnd.push(inde)
            exercise.totalOfLoop = exercise.totalOfLoop + 1;
            exercise.modeType = 'time_with_jump';
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

        }
        if(event.kind === 'action' ){
          // functions.logger.log("exercise.events[inde-1].kind ", exercise.events[inde-1].kind )
          if(exercise.events[inde-1].kind === 'step_start'){
            // functions.logger.log("eexercise.events[inde-1].kind 2 ", exercise.events[inde-1].kind )
            if(exercise.modeType !== undefined){
              let indexOflast;
             
              if(exercise.modeType === 'time_with_jump' && event.chrono !== '00:00:00'){


                const isLastNumb = (element:any) => element.chrono === '00:00:00';

                indexOflast = exercise.events.findLastIndex(isLastNumb);
                if(exercise.events[inde-1].hours === event.hours){
                  // let newhoursChrono = event.hours - exercise.events[indexOflast].hours;
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
                  console.log('LE RESULT EN MLLSCDS ',newmlscds-exercise.events[inde-1].mlscs)
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
                  // let newArray = exercise.events.filter((el,i)=> i < inde )
                  // const isLastNumbBefore = (element) => element.event.kind === 'action' && element.event.action !== 'jump';
                  // let result = newArray.findLastIndex(isLastNumbBefore)
                  // if(event.chrono === event.actionTotalTime){
                  //   // console.log('meme timing !! ')
                  //   event.timePreviousLastAction = '00:00:00';
                  // }else{
                  //   if(exercise.events[result] !== undefined){
                                                                  
                  //     if(exercise.events[result].timePreviousLastAction !== undefined){
                  //       // if(exercise.events[result].event.number === event.event.number){
  
                  //       // }
                  //     }
                  //   }
                  // }
                }
                if(exercise.events[inde-1].hours < event.hours){
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
  
                  
                }
                // end of <
              }
              if(exercise.modeType === 'time'){

              }

            }
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
