import { Component } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent {
  historyData:any = [];
  constructor(
    private utilsService: UtilsService,
    private router: Router ){}

    ngOnInit(): void {
      this.utilsService._newhistory.subscribe((history:any) =>{

        console.log('HISTORY : ! ',history)
        this.historyData = history;
      });
    }

    seeDetailOfExercice(history:any){
      this.utilsService.sendNewHistoryDetail(history);
      this.router.navigate(['history/history-details']);
    }

}
