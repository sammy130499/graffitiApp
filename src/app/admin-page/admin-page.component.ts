import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SHA256, enc } from "crypto-js";
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { HostListener } from '@angular/core';

import { AlertService } from '../alert.service';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  constructor(private router : Router,private spinner: NgxSpinnerService,private alertService:AlertService, private global:GlobalDataService,private userService:UserService) { }

  form = new FormGroup({
    username : new FormControl('',Validators.required),
    firstname : new FormControl('',Validators.required),
    lastname : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  });

  ngOnInit() {
  }

  deleteUserFromAdmin()
  {
    let username=this.form.get('username').value;
  let firstname=this.form.get('firstname').value;
  let lastname=this.form.get('lastname').value;
  console.log("test0");
  if(!username ){
    console.log("test1");
    return;
  }
 
  username=username.trim();
  username=username.toLowerCase();

  this.userService.deleteUserfromAdmin({"userId":username}).subscribe((data)=>{
    if(!data.action)
      {
        this.spinner.hide("delete");
        this.alertService.error(data.message);
      }
      else
      {
        this.spinner.hide("delete");
        this.alertService.success(data.message)
      
      }
  })

  

  }

  changepass(){
    let username=this.form.get('username').value;
    let password=this.form.get('password').value;
    if(!username ){
      console.log("test1");
      return;
    }
    username=username.trim();
  username=username.toLowerCase();
  password=password.trim();

  const hashedPass = SHA256(password).toString(enc.Hex);
  console.log("outside",hashedPass,password);
    this.userService.updateUserpass({"userId":username,"password":hashedPass}).subscribe((data)=>{
      console.log("inside");
      if(!data.action)
        {
          this.spinner.hide("delete");
          this.alertService.error(data.message);
        }
        else
        {
          this.spinner.hide("delete");
          this.alertService.success(data.message)
        
        }
    })

  }

  logoutall()
  {
    this.userService.logoutall();
  }

  logout(){
    this.userService.logoutadmin();
    // localStorage.removeItem("access_token");
    // localStorage.removeItem("loggedInUsername")
    // this.router.navigate(['/adminlogin']);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    localStorage.setItem("isBackBtnPressed","true");
  }
}
