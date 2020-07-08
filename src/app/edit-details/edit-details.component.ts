import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../alert.service';
import { GlobalDataService } from '../global-data.service';
import { Router } from '@angular/router';
import { SHA256, enc } from 'crypto-js';




@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css']
})
export class EditDetailsComponent implements OnInit {

  constructor(private userService:UserService,private spinner:NgxSpinnerService,private alertService:AlertService,private global:GlobalDataService,private router:Router) { }


  allowSignupPassword=false;
  allowSignupUsername=false;
  form = new FormGroup({
    username : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required),
    department : new FormControl('',Validators.required),
  });

  checkPassword()
  {
  
    let password=this.form.get('password').value;
    if(password.length==0)
    {
      this.allowSignupPassword=false;
      return;
    }
    const hashedPass = SHA256(password).toString(enc.Hex);
    let user= JSON.parse(localStorage.getItem("user"));
    if(hashedPass!=user.password)
    {
      this.alertService.error("Incorrect Password!");
      this.allowSignupPassword=false;
      return;
    }
    this.allowSignupPassword=true;

  }



  
  deleteAccount()
  {
    let username=localStorage.getItem("loggedInUsername");
    this.userService.deleteUser({"userId":username}).subscribe((data)=>{
      if(!data.action)
        {
          this.spinner.hide();
          this.alertService.error(data.message);
        }
        else
        {
          this.spinner.hide();
          this.alertService.success(data.message)
          this.logout();
        }
    })
  }

  logout()
  {

    this.userService.logout();
  }


  

  





  ngOnInit() {
  }

}
