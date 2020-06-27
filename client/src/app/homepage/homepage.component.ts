import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';  
import { SHA256, enc } from "crypto-js";
import { Router } from '@angular/router';
import { GlobalDataService } from '../global-data.service';
import { UserService } from '../user.service';
import { AlertService } from '../alert.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private router : Router,private spinner: NgxSpinnerService,private alertService:AlertService, private global:GlobalDataService,private user:UserService) { }

  form = new FormGroup({
    username : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required),
  });
  ngOnInit() {

  }

  login(){
    this.spinner.show();
    let username=this.form.get('username').value;
    let password=this.form.get('password').value;
    if(!username || !password){
      return;
    }
    this.global.loggedInUsername=username;
    localStorage.setItem("loggedInUsername",username);
    const hashedPass = SHA256(password).toString(enc.Hex);
    this.user.loginUser({"userId":username,"password":hashedPass}).subscribe((data)=>{
      if(!data.action){
        console.log(data.message);
        this.alertService.error(data.message);
        this.spinner.hide();
      }
      
      else{
        
        let username=data.message.user.userId;
        localStorage.setItem("user",JSON.stringify(data.message.user));
        localStorage.setItem("access_token",data.message.token)
        this.router.navigate(['/dashboard/'+username]);
        this.spinner.hide();
      }
    })

  }

}
