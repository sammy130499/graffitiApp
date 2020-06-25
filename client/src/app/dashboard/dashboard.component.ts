import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userService:UserService,private global:GlobalDataService,private router:Router) { }
  photo="";
  ngOnInit() {
    this.userService.getImageUrlForUser({"userId":this.global.loggedInUsername}).subscribe((data)=>{
      if(!data.action){
        console.log(data.message)
      }
      else{
        this.photo=data.message;
      }
    })
  }


  

}
