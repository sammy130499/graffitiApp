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

  ngOnInit() {
    let flag=0;

    let imageEditor = new ImageEditor('#tui-image-editor-container', {
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

  imageEditor.on('mousedown', function(event, originPointer) {
     if(flag==1){
         imageEditor.stopDrawingMode();
     }
 });

 imageEditor.on('objectActivated', function(props) {
     flag=1
 });

  window.onresize = function(e) {
    console.log(e);
      // imageEditor.ui.resizeEditor();
  }
  $('#btn').click(()=>{
     let data=imageEditor.toDataURL();
     console.log(data);
  })
  }

         

}
