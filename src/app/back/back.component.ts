import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import ImageEditor from 'tui-image-editor';
import { AlertService } from '../alert.service';


@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css']
})
export class BackComponent implements OnInit, AfterViewInit {

  constructor(private userService:UserService,private global:GlobalDataService,private spinner:NgxSpinnerService,private router:Router,private alert:AlertService) { }
  private imageEditor;
  enableButton;
  spinnerMsg;
  flag;
  ngOnInit() {
    this.spinnerMsg="Thank you for creating memories with us :)"
    this.spinner.show();
    this.flag=0;
    this.enableButton=false;
    
  this.userService.getImageUrlForTshirtUserBack({"userId":localStorage.getItem('tshirtUser')}).subscribe(async (res)=>{
    this.spinner.hide();        
    if(!res.action){
      this.alert.error(res.message);
    }
    else{
      this.imageEditor=new ImageEditor('#tui-image-editor-container', {
        includeUI: {
            menu:['text'],
            loadImage: {
                path: res.message.url,
                name: 'SampleImageBack'
            },
            initMenu: 'text',
            menuBarPosition: 'bottom'
        },
        cssMaxWidth:600,
        cssMaxHeight:700,
        usageStatistics: false
    });
      let usersAffected=JSON.parse(res.message.user).usersAffected;
      let tshirtUser=localStorage.getItem('tshirtUser')
        if(usersAffected.includes(tshirtUser)){
          this.enableButton=false;
        }
        else{
          this.enableButton=true;
        }
        this.imageEditor.on('mousedown',(event, originPointer)=> {
          if(this.flag==1){
              this.imageEditor.stopDrawingMode();
          }
        });

        this.imageEditor.ui.resizeEditor({
          uiSize: {width:`${window.innerWidth}px`,height:`${window.innerHeight}px`}
        })
      this.imageEditor.on('objectActivated', (props)=> {
        this.flag=1
      });
    }

  })
  

 
  
}

@HostListener('window:resize', ['$event'])
      onResize(event) {
      if(this.imageEditor)
      this.imageEditor.ui.resizeEditor({
    uiSize: {width:`${event.target.innerWidth}px`,height:`${event.target.innerHeight}px`}
  })
}

ngAfterViewInit(){
  
}

sendPhoto(){
  this.spinnerMsg="Your loved one has so many well wishers <br/> Adding your wishes too<br>Wait for a few moments!"
  this.spinner.show();
  let data=this.imageEditor.toDataURL();
  this.userService.updatePhotoBack({"tshirtUser":localStorage.getItem('tshirtUser'),"photo":data}).subscribe(ret=>{
    this.spinner.hide();
    if(!ret.action){
      this.alert.error(ret.message);
    }
    else{
     localStorage.removeItem('tshirtUser');
     this.router.navigate(['/dashboard/'+localStorage.getItem("loggedInUsername")])
    }
  })
}


}
