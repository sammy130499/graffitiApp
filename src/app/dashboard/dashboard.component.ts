import {
  NgxSpinnerService
} from 'ngx-spinner';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HostListener } from '@angular/core';
import { AlertService } from '../alert.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [],
  
})
export class DashboardComponent implements OnInit, AfterViewInit {

  constructor(private userService:UserService,private alertService:AlertService,private global:GlobalDataService,private router:Router,private sanitizer: DomSanitizer,private spinner:NgxSpinnerService,private activeRoute: ActivatedRoute) { }
  photo="";
  userArr:User[];
  userArrPermanent:User[];
  page: number = 1;
  currentUser;
  fetchedUsers;
  spinnerMsg;
  bgColors;
  ngOnInit() {
    this.checkUrl();
    this.spinnerMsg="Experience magic! <br/> Setting up your dashboard";
    this.fetchedUsers=false;
    this.bgColors=["bg-green-600","bg-red-600","bg-blue-600","bg-yellow-600","bg-teal-600","bg-orange-600","bg-indigo-600","bg-pink-600","bg-purple-600","bg-gray-600"]
    this.spinner.show("spinner-2");
    this.userArr=[];
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.getDepartmentUsers(this.currentUser.department);    
    this.userService.getImageUrlForUser({"face":"front"}).subscribe((data) => {
      if (!data.action) {
        this.alertService.error(data.message)
      } else {
        this.photo = data.message;
      }
    })
  }

  @ViewChild("department", {static:true}) department: ElementRef;
  ngAfterViewInit(){
    this.department.nativeElement.value=this.currentUser.department;
    
  }

  checkUrl()
  {
    let urlUser=this.activeRoute.snapshot.url[1].path;
    if(urlUser!=localStorage.getItem("loggedInUsername"))
    {
      this.router.navigate(['/']);
    }
    
  }

  showModal(){
    Swal.fire({
      title: '<strong>Guide to use the application</strong>',
      icon: 'info',
      html:
        `<ul>
        <li>1. Life is short, but not your love for your friends. Use this app to let them know!</li>
        <li>2. Find your friend from the list of users available on the right hand side. You can also search for his name.</li>
        <li>3. We know you have so much to say but we can only allow you a <b> single chance</b> to edit a Tee. Pre-think what you gonna send</li>
        <li>4. If you click on your photo you can also download em. We dont want to keep everything to ourselves, obviously.</li>
      </ul>`,
      showCloseButton: true,
      focusConfirm: true,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Great!',
      confirmButtonAriaLabel: 'Thumbs up, great!'
    })
  }

  getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getDepartmentUsers(department: string) {
    this.userService.getDataForDashboard({
      "department": department
    }).subscribe((data) => {
      if (!data.action) {
        this.userArr = [];
        this.userArrPermanent = [];
        this.alertService.info("Call more of your friends oboard!")
      } else {
        this.userArr = JSON.parse(data.message);
        this.userArr = this.userArr.filter(obj=>obj.userId!=this.currentUser.userId);
        this.userArrPermanent = this.userArr;
        this.spinner.hide("spinner-2");
        if(this.userArrPermanent.length>0){
          this.page=1;
        this.fetchedUsers=true;
        }
        else{
        this.fetchedUsers=false;
        }
      }
    })
  }

  callEdit(tshirtUser,currentUser){
    localStorage.setItem('tshirtUser',tshirtUser);
    this.router.navigate(['/edit/'+currentUser+'/'+tshirtUser])
  }

  callProfile(){
    let user=localStorage.getItem('loggedInUsername');
    this.router.navigate(['/profile/'+user+'/front'])
  }

  searchWord(word: string) {
    this.userArr = this.userArrPermanent;
    if (word == "")
      return;
    var userArrLen = this.userArr.length;
    var tempUser: User[];
    tempUser = [];
    this.page=1;
    for (var i = 0; i < userArrLen; i++) {
      var tempString=this.userArr[i].firstName+" "+this.userArr[i].lastName;
      if ((this.userArr[i].userId).toLowerCase().indexOf(word.toLowerCase()) >= 0) {
        tempUser.push(this.userArr[i]);
        continue;
      }
      if ((this.userArr[i].firstName).toLowerCase().indexOf(word.toLowerCase()) >= 0) {
        tempUser.push(this.userArr[i]);
        continue;
      }
      if ((this.userArr[i].lastName).toLowerCase().indexOf(word.toLowerCase()) >= 0) {
        tempUser.push(this.userArr[i]);
        continue;
      }

      if ((tempString).toLowerCase().indexOf(word.toLowerCase()) >= 0) {
        tempUser.push(this.userArr[i]);
        continue;
      }

    }
    this.userArr = tempUser;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    localStorage.setItem("isBackBtnPressed","true");
  }

  logout(){
    this.spinnerMsg="We will be waiting for you.<br/> Come back soon :)"
    this.userService.logout();
  }

}
