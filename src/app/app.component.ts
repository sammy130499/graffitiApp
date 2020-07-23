import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit {
  constructor(private spinner:NgxSpinnerService){}
  ngOnInit(){
    this.spinner.show("firstS");
  }
  ngAfterViewInit(){
    this.spinner.hide("firstS");
  }
}
