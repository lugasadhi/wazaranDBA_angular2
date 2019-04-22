import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {NgForm} from '@angular/forms';

import {Http} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-wazclosing',
  templateUrl: './wazclosing.component.html',
  styleUrls: ['./wazclosing.component.css']
})
export class WazclosingComponent implements OnInit {

  constructor(private http:Http, private route:Router, private global:GlobalService, private actroute:ActivatedRoute) { }
  loading = true;
  result = [];
  dateNow;
  dateClosing;
  dateClosing2;
  day;

  ngOnInit() {
    // date
    var now = new Date();
    this.dateNow = now;
    this.day = now.getDay();
    var date = new Date();
    var date2 = new Date();

    // if saturday read closing on thursday
    if(this.day == 6){
       date = new Date(date.setDate(date.getDate() - 2));
       date2 = new Date(date2.setDate(date2.getDate() - 1));
    }else{
       date = new Date(date.setDate(date.getDate() - 1));
    }
    this.dateClosing = date;
    this.dateClosing2 = date2;

    this.checkClosing(0);
  }


  checkClosing(count){
    var now =this.dateNow.getDate()+"/"+(this.dateNow.getMonth()+1)+"/"+this.dateNow.getFullYear();

    var day = this.dateClosing.getDate();
    var month = this.dateClosing.getMonth()+1;
    var year = this.dateClosing.getFullYear();
    var branch = this.global.getServerBranch()[count];
    var param = { 'branch':branch.branch, 'master':branch.master, 'brDbName':branch.brDbName, 'many':'20','lastDate':'24'};

    this.http.post(this.global.getApiServer()+"bkmonitor",param ).subscribe(
      (response) => {
        count++;
        var res = response.json();
        var sets =[];
        var status = "NOT CLOSING";

        for (let i = 0; i < res.length; i++) {
            var bklist = res[i];
            var dt1 = new Date(bklist.bkdate);
            var date1 = dt1.getDate()+"/"+(dt1.getMonth()+1)+"/"+dt1.getFullYear();
            var path = bklist.path.split("/").reverse();
            var path = bklist.path.split("\\").reverse();
            if(path[0].substring(0,2) == "AF" || path[0].substring(0,2) == "BF"){
              var nm  = path[0].replace(".bak", "").replace("AF","").replace("BF","");
              sets.push({"name":nm , "date":date1});
            }
        }
        var closedate = ""+day+month+year;

        for (let i = 0; i < sets.length; i++) {
            if(sets[i].name == closedate && sets[i].date == now){
              status = "CLOSING";
            }else{
              status = "NOT CLOSING";
            }
        }


        this.result.push({"branch":branch.branch, "dbdet":res, "status":status});
        if(count == this.global.getServerBranch().length){
          this.loading = false;
        }else{
          this.checkClosing(count);
        }
      }
    )
  }
}
