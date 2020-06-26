import { Component, OnInit } from '@angular/core';
import ImageEditor from 'tui-image-editor';
import $ from 'jquery';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  constructor(private userService:UserService,private global:GlobalDataService) { }
  private imageEditor;
  ngOnInit() {
    let flag=0;

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
      cssMaxWidth: 700,
      cssMaxHeight: 500,
      usageStatistics: false
  });
  // this.userService.getImageUrlForUser(this.global.editingUsername).subscribe((res)=>{
  //   if(!res.data){
  //     console.log(res.message);
  //   }
  //   else{
  //     this.imageEditor.loadImageFromURL(res.message,'tshirtImg').then(ret=>{
  //       console.log(ret);
  //     })

  //   }

  // })
  this.imageEditor.on('mousedown', function(event, originPointer) {
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
  console.log(data);
  // send this data to backend using userservice
}



         

}
