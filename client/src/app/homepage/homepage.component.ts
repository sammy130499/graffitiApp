import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';  
import { SHA256, enc } from "crypto-js";
import { Router } from '@angular/router';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private router : Router, private global:GlobalDataService) { }

  form = new FormGroup({
    username : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required),
  });
  ngOnInit() {

  }

  login(){
    let username=this.form.get('username').value;
    let password=this.form.get('password').value;
    this.global.loggedInUsername=username;
    const hashedPass = SHA256(password).toString(enc.Hex);
    this.router.navigate(['/dashboard/'+username]);

  }

}
