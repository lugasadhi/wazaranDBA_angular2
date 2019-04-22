import { Component, OnInit } from '@angular/core';
import {FormGroup ,FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {Http} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private http:Http, private route:Router) { }

  //component
    login;
    passErr;
    passErrMsg;
    loginAlert = false;

  ngOnInit() {
    this.login = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }
  keyup(){  }
  onSubmit(logindata){
    var uname = logindata.value.username;
    var pass = logindata.value.password;
    var param ={'name': uname, 'password': pass};

    this.http.post("http://localhost:31618/api/login", param).subscribe(
      (response) => {
        var res = response.json();
        var resp = res[0];
        if(resp == undefined){
          //failed
          this.loginAlert = true;
        }else{
          //success
          this.route.navigate(['/dashboard']);
        }
      }
    )
  }

}
