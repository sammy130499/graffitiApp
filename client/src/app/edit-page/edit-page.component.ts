import { Component, OnInit } from '@angular/core';
import ImageEditor from 'tui-image-editor';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  constructor(private userService:UserService,private global:GlobalDataService,private spinner: NgxSpinnerService,private router:Router) { }
  private imageEditor;
  enableButton;
  ngOnInit() {
    this.spinner.show();
    let flag=0;
    this.enableButton=false;
    this.imageEditor = new ImageEditor('#tui-image-editor-container', {
      includeUI: {
          menu:['text'],
          loadImage: {
              path: '../../assets/images/tshirtFront.png',
              name: 'SampleImage'
          },
          initMenu: 'text',
          menuBarPosition: 'bottom'
      },
      cssMaxWidth:1000,
      cssMaxHeight:1000,
      usageStatistics: false
  });
  this.userService.getImageUrlForTshirtUser({"userId":localStorage.getItem('tshirtUser')}).subscribe((res)=>{
    this.spinner.hide();
    if(!res.action){
      console.log(res.message);
    }
    else{
      this.imageEditor.loadImageFromURL(res.message.url,'tshirtImg').then(()=>{
        console.log('here');
        let user=JSON.parse(res.message.user)
        let usersAffected=user.usersAffected;
        let tshirtUser=localStorage.getItem('tshirtUser');
        console.log(usersAffected,tshirtUser);
        if(!usersAffected.includes(tshirtUser)){
          this.enableButton=true;
        }
        else{
          this.enableButton=false;
        }
      }).catch(e=>{
        console.log(e);
      })
    }

  })
  this.imageEditor.on('mousedown',(event, originPointer)=> {
     if(flag==1){
         this.imageEditor.stopDrawingMode();
     }
 });




 this.imageEditor.on('objectActivated',(props)=> {
     flag=1
 });
  
}

sendPhoto(){
  let data=this.imageEditor.toDataURL();
  this.spinner.show();
  this.userService.updatePhoto({"tshirtUser":localStorage.getItem('tshirtUser'),"photo":data}).subscribe(ret=>{
    this.spinner.hide();
    if(!ret.action){
      console.log(ret.message);
    }
    else{
     localStorage.removeItem('tshirtUser');
     this.router.navigate(['/dashboard/'+localStorage.getItem("loggedInUsername")])
    }
  })
}



         

}
