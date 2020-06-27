import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SHA256, enc } from "crypto-js";
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

import { AlertService } from '../alert.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private userService:UserService,private spinner: NgxSpinnerService,private alertService:AlertService,private global:GlobalDataService,private router:Router) { }

  allowSignup=false;
  form = new FormGroup({
    username : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required),
    firstName : new FormControl('',Validators.required),
    lastName : new FormControl('',Validators.required),
    department : new FormControl('',Validators.required),
  });

  department="COED";
  ngOnInit() {
  }


  setDepartment(v){
    this.department=v;
  }

  checkUsername(){
    let username=this.form.get('username').value;
    this.userService.checkUser({"userId":username}).subscribe((data)=>{
      if(!data.action && username!=" "){
        console.log(data.message);
        this.allowSignup=false;
        this.alertService.error(data.message); 
      }
      else{
        console.log(data.message);
        this.allowSignup=true;
        if(username!=" "){
          this.alertService.info(data.message);
        }
        
      }
    })
  }

  signup(){
    this.spinner.show();
    let username=this.form.get('username').value;
    let firstName=this.form.get('firstName').value;
    let lastName=this.form.get('lastName').value;
    let password=this.form.get('password').value;
    // console.log("Outside");
    if(!username || !password)return;
    const hashedPass = SHA256(password).toString(enc.Hex);
    this.userService.createUser({"userId":username,"firstName":firstName,"lastName":lastName,"password":hashedPass,"department":this.department}).subscribe(data=>{
      if(!data.action){
        console.log(data.message);
        this.alertService.error(data.message);
        this.spinner.hide();
      }
      else{
        console.log(data.message);
        let username=data.message.user.userId;
        localStorage.setItem("user",data.message.user);
        localStorage.setItem("access_token",data.message.token)
        this.router.navigate(['/dashboard/'+username]);
        this.spinner.hide();
        this.alertService.success("you have been registered !!");
      }
    })
  }

}
