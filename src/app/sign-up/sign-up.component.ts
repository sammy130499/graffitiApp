import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SHA256, enc } from "crypto-js";
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

import { AlertService } from '../alert.service';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private userService:UserService,private spinner: NgxSpinnerService,private alertService:AlertService,private global:GlobalDataService,private router:Router) { }

  allowSignup=false;
  allowSignupPassword=false;
  allowSignupFirstName=false;
  allowSignupLastName=false;
  allowSignupUsername=false;
  allowSignupConfPassword=false;
  
  form = new FormGroup({
    username : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required),
    confpassword: new FormControl('',Validators.required),
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




  checkPassword()
  {
    let password=this.form.get('password').value;
    password=password.trim();
    if(password.length==0)return;
    
    if(password.length<7||password.length>20)
    {
      this.alertService.error("Enter a password with length between 7 and 20.");
      this.allowSignupPassword=false;
      return;
    }
    this.alertService.info("good password bruh!")
    this.allowSignupPassword=true;
  }

  checkConfPassword()
  {
      let confpassword=this.form.get('confpassword').value;
      confpassword=confpassword.trim();
      if(confpassword.length==0)return;
      
      let password=this.form.get('password').value;
      if(password!=confpassword)
      {
        this.alertService.error("Told you to type it out. Passwords should match!");
        this.allowSignupConfPassword=false;
        return;
      }
      this.alertService.info("Cool! Passwords match. Please don't forget it though :')");
      this.allowSignupConfPassword=true;
  }

  checkFirstName()
  { 
    let firstName=this.form.get('firstName').value;
    firstName=firstName.trim();
    if(firstName.length==0)return;
    
    if(firstName.length<3||firstName.length>15)
    {
      this.alertService.error("Sorry for your unfortunate first name :( But we only accept ones with length between 3 and 15! :)");
      this.allowSignupFirstName=false;
      return;
    }
    let firstNameLen=firstName.length;
    for(let i=0;i<firstNameLen;i++)
    {
      if((firstName[i]>='a'&&firstName[i]<='z')||(firstName[i]>='A'&&firstName[i]<='Z'))
      {
        continue;
      }
      this.alertService.error("Unless you are Elon Musk's son, you are only allowed to have alphabets in your name");
      this.allowSignupFirstName=false;
      return;
    }

    this.allowSignupFirstName=true;
  }

  checkLastName()
  { 
    let lastName=this.form.get('lastName').value;
    lastName=lastName.trim();
    if(lastName.length==0)return;
    if(lastName.length<3||lastName.length>15)
    {
      this.alertService.error("Sorry for your unfortunate last name :( But we only accept ones with length between 3 and 15! :)");
      this.allowSignupLastName=false;
      return;
    }
    let lastNameLen=lastName.length;
    for(let i=0;i<lastNameLen;i++)
    {
      if((lastName[i]>='a'&&lastName[i]<='z')||(lastName[i]>='A'&&lastName[i]<='Z'))
      {
        continue;
      }
      this.alertService.error("Unless you are Elon Musk's son, you are only allowed to have alphabets in your name");
      this.allowSignupLastName=false;      
      return;
    }

    this.allowSignupLastName=true;
  }


  checkUsername(){
    let username=this.form.get('username').value;
    username=username.trim();
    username=username.toLowerCase();
    if(username.length==0)return;
    
    let reg="\^u1[56](co||me||ce||ee||ec||ch)[0-2][0-9][0-9]$";
    
    const regex=RegExp(reg);
    console.log("this is the truth value",regex.test(username));
    if(!regex.test(username) )
    {
      this.alertService.error("Bahut tez ho rahe hain? Enter your admission number");
      this.allowSignup=false;
      return;
    }


    this.allowSignupUsername=true;
    this.userService.checkUser({"userId":username}).subscribe((data)=>{
        if(!data.action && username!=" "){
          this.allowSignup=false;
          this.alertService.error(data.message); 
        }
        else{
          this.allowSignup=true;
          if(username!=" "){
            this.alertService.info(data.message);
          }
          
        }
      })
    
  }

  signup(){
    this.checkFirstName();
    this.checkLastName();
    this.checkPassword();
    this.checkConfPassword();
    this.checkUsername();
    if(!this.allowSignupFirstName || !this.allowSignupLastName
      || !this.allowSignupPassword || !this.allowSignupUsername ){
        this.spinner.hide();
        this.alertService.error("please enter valid values");
        return;
      }
    let username=this.form.get('username').value;
    let firstName=this.form.get('firstName').value;
    let lastName=this.form.get('lastName').value;
    let password=this.form.get('password').value;
    let confpassword=this.form.get('confpassword').value;
    
    username=username.trim();
    username=username.toLowerCase();
    password=password.trim();
    confpassword=confpassword.trim();
    firstName=firstName.trim();
    lastName=lastName.trim();

    if(!username || !password || !lastName || !firstName|| !confpassword ){
      this.spinner.hide();
      this.alertService.error("please enter valid values");
      return;
    }
    const hashedPass = SHA256(password).toString(enc.Hex);
    Swal.fire({
      title: 'Do you remember your password?',
      text: "We wont be able to retrieve it later. Hashing n all!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I Do!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.userService.createUser({"userId":username,"firstName":firstName,"lastName":lastName,"password":hashedPass,"department":this.department}).subscribe(data=>{
          if(!data.action){
            this.spinner.hide();
            this.alertService.error(data.message);
          }
          else{
            let username=data.message.user.userId;
            localStorage.setItem("user",JSON.stringify(data.message.user));
            localStorage.setItem("loggedInUsername",username);        
            localStorage.setItem("access_token",data.message.token);
            this.router.navigate(['/dashboard/'+username]);
            this.spinner.hide();
            this.alertService.success("you have been registered !!");
          }
        })
      }
    })
  }

}
