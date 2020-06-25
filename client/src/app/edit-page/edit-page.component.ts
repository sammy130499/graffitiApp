import { Component, OnInit } from '@angular/core';
import ImageEditor from 'tui-image-editor';
import $ from 'jquery';
@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  constructor() { }
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
  // send this data to backend using userservice
}



         

}
