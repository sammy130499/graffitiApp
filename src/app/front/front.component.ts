import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import ImageEditor from 'tui-image-editor';
import { ThrowStmt } from '@angular/compiler';
import { AlertService } from '../alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit, AfterViewInit {

  constructor(private userService:UserService,private global:GlobalDataService,private spinner:NgxSpinnerService,private router:Router,private alert:AlertService,private activeRoute:ActivatedRoute) { }
  private imageEditor;
  enableButton;
  spinnerMsg;
  flag;
  ngOnInit() {
    this.spinnerMsg="Thank you for creating memories with us :)"
    this.spinner.show();
    this.flag=0;
    this.enableButton=false;
    
  this.userService.getImageUrlForTshirtUser({"userId":localStorage.getItem('tshirtUser')}).subscribe( async (res)=>{
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
                name: 'SampleImage'
            },
            initMenu: 'text',
            menuBarPosition: 'bottom',
            uiSize:{width:`${window.innerWidth}px`,height:`${window.innerHeight}px`}
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

  Swal.fire({
    title: 'Are you sure?',
    text: "You have a single chance to edit a shirt. Make it your best!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, edit it!'
  }).then((result) => {
    if (result.value) {
      this.spinnerMsg="Sending your love to your loved one <br/> It might take a few moments"
      this.spinner.show();
      let data=this.imageEditor.toDataURL();
      this.userService.updatePhoto({"tshirtUser":localStorage.getItem('tshirtUser'),"photo":data}).subscribe(ret=>{
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
  })
  
}

}
  




  