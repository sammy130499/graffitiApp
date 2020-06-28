import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import ImageEditor from 'tui-image-editor';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {

  constructor(private userService:UserService,private global:GlobalDataService,private spinner:NgxSpinnerService,private router:Router) { }
  private imageEditor;
  enableButton;
  spinnerMsg;
  ngOnInit() {
    this.spinnerMsg="Thank you for creating memories with us :)"
    this.spinner.show();
    let flag=0;
    this.enableButton=false;
    this.imageEditor=new ImageEditor('#tui-image-editor-container', {
      includeUI: {
          menu:['text'],
          loadImage: {
              path: '../../assets/images/load.svg',
              name: 'SampleImage'
          },
          initMenu: 'text',
          menuBarPosition: 'bottom'
      },
      cssMaxWidth:600,
      cssMaxHeight:700,
      usageStatistics: false
  });
  this.userService.getImageUrlForTshirtUser({"userId":localStorage.getItem('tshirtUser')}).subscribe( async (res)=>{
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
  this.spinnerMsg="Sending your love to your loved one <br/> It might take a few moments"
  this.spinner.show();
  let data=this.imageEditor.toDataURL();
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
  




  