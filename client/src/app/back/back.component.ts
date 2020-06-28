import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import ImageEditor from 'tui-image-editor';


@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css']
})
export class BackComponent implements OnInit {

  constructor(private userService:UserService,private global:GlobalDataService,private spinner:NgxSpinnerService,private router:Router) { }
  private imageEditor;
  enableButton;
  ngOnInit() {
    this.spinner.show();
    let flag=0;
    this.enableButton=false;
    this.imageEditor=new ImageEditor('#tui-image-editor-container', {
      includeUI: {
          menu:['text'],
          loadImage: {
              path: '../../assets/images/load.svg',
              name: 'SampleImageBack'
          },
          initMenu: 'text',
          menuBarPosition: 'bottom'
      },
      cssMaxWidth:600,
      cssMaxHeight:700,
      usageStatistics: false
  });
  this.spinner.show();
  this.userService.getImageUrlForTshirtUserBack({"userId":localStorage.getItem('tshirtUser')}).subscribe(async (res)=>{
    this.spinner.hide();    
    if(!res.action){
      console.log(res.message);
    }
    else{
      let usersAffected=JSON.parse(res.message.user).usersAffected;
      let tshirtUser=localStorage.getItem('tshirtUser')
        if(usersAffected.includes(tshirtUser)){
          this.enableButton=false;
        }
        else{
          this.enableButton=true;
        }
      await this.imageEditor.loadImageFromURL(res.message.url,'tshirtImg')

    }

  })
  this.imageEditor.on('mousedown',(event, originPointer)=> {
     if(flag==1){
         this.imageEditor.stopDrawingMode();
     }
 });

 this.imageEditor.on('objectActivated', function(props) {
     flag=1
 });
  
}

sendPhoto(){
  let data=this.imageEditor.toDataURL();
  this.userService.updatePhotoBack({"tshirtUser":localStorage.getItem('tshirtUser'),"photo":data}).subscribe(ret=>{
    console.log(ret);
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
