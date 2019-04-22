import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgForm} from '@angular/forms';

import {Http} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-shrink',
  templateUrl: './shrink.component.html',
  styleUrls: ['./shrink.component.css']
})
export class ShrinkComponent implements OnInit {

  constructor(private http:Http, private route:Router, private global:GlobalService, private actroute:ActivatedRoute) {
      actroute.params.subscribe(params => {
        this.type = params['type'];
     });

     this.server = global.getServerBranch();
     for (let i = 0; i < this.server.length; i++) {
       this.list.push({"server":this.server[i].branch,"dbname":this.server[i].brDbName,"checked":true});
     }
     for (let i = 0; i < this.server.length; i++) {
         this.serverlist.push({"server":this.server[i].branch});
     }
  }

  type;
  server;
  list = [];
  listlog = [];
  serverlist = [];
  shrinkRes = [];
  loading;


  ngOnInit() {
    if(this.type == "log"){
      this.logsize(0);
    }else{
      this.listlog = this.list;
    }
  }

  logsize(count){
    this.loading = true;
    var param = {'dbName': this.list[count].dbname ,'branch': this.list[count].server};
    count++;
    this.http.post(this.global.getApiServer()+"logsize", param).subscribe(
      (response) => {
        var res = response.json();
        var size = Math.round(parseInt(res[0].size) * 100) / 100;
        var maxsize = Math.round(parseInt(res[0].maxsize) * 100) / 100;
        var s = count - 1;
        var status = 'save';
        if(size >= 2000){
          status = 'danger';
        }else if(size > 750 && size < 2000){
          status = 'warning';
        }
        this.listlog.push({"server":this.list[s].server,"dbname":this.list[s].dbname,"checked":true, 'size':size, 'maxsize':maxsize, 'status':status});

        if(count == this.list.length){
          this.loading = false;
        }else{
          this.logsize(count);
        }
      },
      (err) => {
        console.log('Something went wrong!');
      }
    )
  }

  changed(status, server){
    this.listUpdate(server,status.checked);
  }

  execute(){
    if(this.type == "log"){
      this.loading = true;
      this.shrinkRes = undefined;
      this.shrinkRes = [];
      console.log(this.serverlist);
      this.exeshrink(0);
    }else{

    }
  }

  // function
  listUpdate(server, checked){
    var del = this.searchList(server);
    if(checked){
      this.serverlist.push({"server":server});
    }else{
      this.serverlist.splice(del, 1);
    }
  }

  searchList(branch){
    var d = -1;
    for (let i = 0; i < this.serverlist.length; i++) {
      if(this.serverlist[i].server == branch){
        d = i;
      }
    }
    return d;
  }

  exeshrink(count){
    var param = this.global.getSingleServer(this.serverlist[count].server);
    this.http.post(this.global.getApiServer()+"shrinklog", param).subscribe(
      (response) => {
        count++;
        var shrnkLog  = response.json()[0];

        var msg = '<div class="table-overflow-x" > <table class="table table-hover"> <thead> <tr>';
        msg += '<th scope="col">Current Size</th>';
        msg += '<th scope="col">Minimal Size</th>';
        msg += '<th scope="col">Estimation Page</th>';
        msg += '<th scope="col">Used Page</th>';
        msg += '</tr></thead> <tbody> <tr>';
        msg += '<td>'+shrnkLog.currentSize+'</td>';
        msg += '<td>'+shrnkLog.minSize+'</td>';
        msg += '<td>'+shrnkLog.estPage+'</td>';
        msg += '<td>'+shrnkLog.usedPage+'</td>';
        msg += '</tr></tbody></table></div>';


        this.shrinkRes.push({"server":param.branch, "result":"Success", "msg":msg});
        if(count == this.serverlist.length){
          this.loading = false;
        }else{
          this.exeshrink(count);
        }
      }
    )
  }

}
