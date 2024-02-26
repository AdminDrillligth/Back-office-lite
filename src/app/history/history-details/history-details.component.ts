import { Component } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})


export class HistoryDetailsComponent {
  historyDataDetail:any = [];
  first = [true];
  constructor(
    private utilsService: UtilsService,
    private router: Router ){}

    ngOnInit(): void {
      this.utilsService._newhistoryDetail.subscribe((resultDetail:any) =>{
        console.log('HISTORY : ! ',resultDetail)
        this.historyDataDetail = resultDetail.result;
        let result = document.getElementsByClassName("card-history");
        // set the color of step by done signal
        // red none do
        // orange patial done
        // green great task
        // To do on wednesday
        // let result:any =  document.getElementById("card0");
        setTimeout(() => {
          if(result !== null){

          }
        }, 3000);
       
        
      });
    }
}
