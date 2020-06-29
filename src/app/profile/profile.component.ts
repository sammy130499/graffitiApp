import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute,private user:UserService,private alert:AlertService) { }
  userArr;
  ngOnInit() {
    this.userArr=[];
    this.user.getWritingUsers().subscribe((ret:any)=>{
      if(!ret.action){
        this.alert.error(ret.message);
      }
      else{
        console.log(ret.message); 
        this.userArr=ret.message;
      }
    })
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
