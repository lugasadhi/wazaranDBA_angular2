import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgForm} from '@angular/forms';

import {Http} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

import { GlobalService } from '../global.service';
@Component({
  selector: 'app-checkdb',
  templateUrl: './checkdb.component.html',
  styleUrls: ['./checkdb.component.css']
})
export class CheckdbComponent implements OnInit {

  constructor(private http:Http, private route:Router, private global:GlobalService) {
    this.server = global.getServerBranch();
    for (let i = 0; i < this.server.length; i++) {
      this.list.push({"server":this.server[i].branch,"checked":true});
    }
    for (let i = 0; i < this.server.length; i++) {
        this.serverlist.push({"server":this.server[i].branch});
    }
  }

  server;
  list = [];
  serverlist = [];
  checkdbresult = [];
  loading;
  checkdbres = "not checked";


  ngOnInit() {
  }


  changed(status, server){
    this.listUpdate(server,status.checked);
  }

  dbccexe(){
    this.checkdbresult = undefined;
    this.checkdbresult = [];

    this.loading = true;
    this.cdbreq(0);
  }






  // function
  listUpdate(server, checked){
    var del = this.searchList(server);
    console.log(del);
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

  cdbreq(count){
    var param = this.global.getSingleServer(this.serverlist[count].server);

    this.http.post(this.global.getApiServer()+"checkdb", param).subscribe(
      (response) => {
        var cdb;
        count ++;
        this.loading = false;
        var cdbmsg  = response.json();
        var ms =  cdbmsg[0].msg;
        var char = 171 + param.brDbName.length;
        var res = ms.substr(ms.length - char);
        if(res == "CHECKDB found 0 allocation errors and 0 consistency errors in database '"+param.brDbName+"'. <br>DBCC execution completed. If DBCC printed error messages, contact your system administrator."){
          this.checkdbres = "Good";
        }else{
          this.checkdbres = "Has Error";
        }
        cdb = this.checkdbres;

        this.checkdbresult.push({"server":param.branch, "status":cdb, "message": cdbmsg});
        if(count == this.serverlist.length){
          this.loading = false;
        }else{
          this.cdbreq(count);
        }
      }
    )

  }

}
