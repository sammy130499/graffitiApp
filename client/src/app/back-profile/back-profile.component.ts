import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import ImageEditor from 'tui-image-editor';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-back-profile',
  templateUrl: './back-profile.component.html',
  styleUrls: ['./back-profile.component.css']
})
export class BackProfileComponent implements OnInit {
  

  constructor(private userService: UserService, private global: GlobalDataService, private spinner: NgxSpinnerService, private router: Router,private alert:AlertService) {}
  private imageEditor;
  dataUrl;
  ngOnInit() {
    
    this.dataUrl='../../assets/images/load.svg'
    this.spinner.show();
    this.userService.getImageUrlForUser().subscribe(async (res) => {
      this.spinner.hide();
      if (!res.action) {
        console.log(res.message);
      } else {
        this.dataUrl=res.message;
      }
    })
  }

    
  }


