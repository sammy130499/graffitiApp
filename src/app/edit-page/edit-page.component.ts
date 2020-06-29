import { Component, OnInit, OnDestroy } from '@angular/core';
import ImageEditor from 'tui-image-editor';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import io from 'socket.io-client';
import { AlertService } from '../alert.service';


@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit,OnDestroy {

  constructor(private router:Router,private route:ActivatedRoute,private user:UserService,private alert:AlertService,private spinner:NgxSpinnerService) { }
  socket:any;
  room:string;
  usersAffected;
  notAllowed;
  ngOnInit() {
    this.spinner.show("edit")
    this.user.getUsersAffectedAndRoom({"tshirtUser":localStorage.getItem('tshirtUser')}).subscribe((data:any)=>{
      if(!data.action){
        this.alert.error(data.message);
      }
      else{
        this.usersAffected=JSON.stringify(data.message.arr);
        this.socket=io('http://localhost:3001');
        let currentUser=localStorage.getItem('loggedInUsername');
        let tshirtUser=localStorage.getItem('tshirtUser');
        if(!this.usersAffected.includes(tshirtUser)){
          this.socket.emit('ack',{room:data.message.room,user:currentUser});
          this.socket.on('ackback',({num,present})=>{
            this.spinner.hide("edit");
            if(present==currentUser){
              this.notAllowed=false;
              this.router.navigate(['front'],{relativeTo: this.route});
            }
            else if(num>1){
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
showHome(){
  let username=localStorage.getItem('loggedInUsername');
  this.router.navigate(['/dashboard/'+username])
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
  this.socket.close();
}

         

}
