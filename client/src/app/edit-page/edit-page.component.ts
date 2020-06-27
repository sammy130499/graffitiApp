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
  this.spinner.show();
  this.userService.getImageUrlForTshirtUser({"userId":localStorage.getItem('tshirtUser')}).subscribe((res)=>{
    if(!res.action){
      this.spinner.hide();
      console.log(res.message);
    }
    else{
      this.imageEditor.loadImageFromURL(res.message.url,'tshirtImg').then(()=>{
        this.spinner.hide();
        let usersAffected=JSON.parse(res.message.user).usersAffected;
        if(usersAffected.indexOf(localStorage.getItem('tshirtUser'))==-1){
          this.enableButton=true;
        }
        else{
          this.enableButton=false;
        }
      })
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
  this.userService.updatePhoto({"tshirtUser":localStorage.getItem('tshirtUser'),"photo":data}).subscribe(ret=>{
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
