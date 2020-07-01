import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import ImageEditor from 'tui-image-editor';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import io from 'socket.io-client';
import { AlertService } from '../alert.service';
import { timer } from 'rxjs';



@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit,OnDestroy,AfterViewInit {

  constructor(private router:Router,private route:ActivatedRoute,private user:UserService,private alert:AlertService,private spinner:NgxSpinnerService,private activeRoute:ActivatedRoute) { }
  socket:any;
  room:string;
  usersAffected;
  notAllowed;
  subscribeTimer;
  timeLeft;
  timerSubscription;
  tshirtUser;
  ngOnInit() {
    this.checkUrl();
    this.observableTimer();
    this.spinner.show("edit")
    this.tshirtUser=localStorage.getItem('tshirtUser');
    this.user.getUsersAffectedAndRoom({"tshirtUser":this.tshirtUser}).subscribe((data:any)=>{
      if(!data.action){
        this.alert.error(data.message);
      }
      else{
        this.usersAffected=JSON.stringify(data.message.arr);
        this.socket=io("ws://localhost:8000/");
        let currentUser=localStorage.getItem('loggedInUsername');
        if(!this.usersAffected.includes(this.tshirtUser)){
          this.socket.emit('ack',{room:data.message.room,user:currentUser});
          this.socket.on('ackback',({num,present})=>{
            this.spinner.hide("edit");
            if(present==currentUser && num==1){
              this.notAllowed=false;
              this.router.navigate(['front'],{relativeTo: this.route});
            }
            else if(num>1 || present!==currentUser){
              this.notAllowed=true;
            }
            else{
              this.notAllowed=false;
              this.router.navigate(['front'],{relativeTo: this.route});
            }
          })
        }
        else{
          this.spinner.hide("edit");
          this.notAllowed=false;
          this.router.navigate(['front'],{relativeTo: this.route});
        }

      }
    })

  }

  ngAfterViewInit()
  {
      // this.checkUrl();
  }
  

  checkUrl()
  {
    let url=this.activeRoute.snapshot.url;
    let loggedInUsername=localStorage.getItem("loggedInUsername");
    let tshirtUser=localStorage.getItem("tshirtUser");
    if(url[1]["path"]!= loggedInUsername||url[2]["path"]!=tshirtUser)
    {
      this.router.navigate(['/']);
    }

    
  }

showHome(){
  let username=localStorage.getItem('loggedInUsername');
  this.router.navigate(['/dashboard/'+username])
}

observableTimer() {
  const source = timer(1000, 1000);
  this.timerSubscription= source.subscribe(val => {
    if(val==0){
    this.alert.info("After 180 seconds you will be automatically redirected to dashboard")
    }
    else if(val==150){
    this.alert.warn("Hurry up! last 30 seconds left")
    }
    else if(val==180){
      this.router.navigate(["/"]);
    }
  });
}


showFront()
{
  if(!this.notAllowed)
  this.router.navigate(['front'],{relativeTo: this.route});
}

showBack()
{
  if(!this.notAllowed)
  this.router.navigate(['back'],{relativeTo: this.route});
}

ngOnDestroy(){
  if(this.socket)
  this.socket.close();
  this.timerSubscription.unsubscribe();
}

         

}
