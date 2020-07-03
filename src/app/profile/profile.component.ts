import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { AlertService } from '../alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SHA256, enc } from 'crypto-js';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from "sweetalert2"; 

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private spinner:NgxSpinnerService,private router:Router,private route:ActivatedRoute,private userService:UserService,private alertService:AlertService,private activeRoute:ActivatedRoute) { }
  userArr;
  username;
  ngOnInit() {
    this.checkUrl();
    this.userArr=[];
    this.username=localStorage.getItem("loggedInUsername").toUpperCase();
    this.userService.getWritingUsers().subscribe((ret:any)=>{
      if(!ret.action){
        this.alertService.error(ret.message);
      }
      else{
        this.userArr=ret.message;
      }
    })
  }

  allowSignupPassword=false;
  allowSignupUsername=false;
  clickedDeleteAccount=false;
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


  deleteAccountToggle()
  {
    if(this.clickedDeleteAccount==false)
    {
      this.clickedDeleteAccount=true;
    }  
    else{
      this.clickedDeleteAccount=false;
    }
  }
  
  deleteAccount()
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
    this.checkPassword();
    if(!this.allowSignupPassword)
    return;
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
    })

    
    
    
  }

  logout()
  {

    this.userService.logout();
  }



  gotoEditDetails()
  {
  
    this.router.navigate(['editdetails'],{relativeTo:this.route});
  }

  checkUrl()
  {
    let urlUser=this.activeRoute.snapshot.url[1].path;
    let loggedInUsername=localStorage.getItem("loggedInUsername");
    if(urlUser!=loggedInUsername)
    {
      this.router.navigate(['/']);
    }
  }
  
  showHome(){
    let username=localStorage.getItem('loggedInUsername');
    this.router.navigate(['/dashboard/'+username])
  }
  
  
  showFront()
  {
    this.router.navigate(['front'],{relativeTo:this.route});
  }
  
  showBack()
  {
    this.router.navigate(['back'],{relativeTo:this.route});
  }

}
