import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService
} from '../user.service';
import {
  GlobalDataService
} from '../global-data.service';
import {
  Router
} from '@angular/router';
import {
  User
} from '../user.model';
import {
  DomSanitizer
} from '@angular/platform-browser';
import {
  NgxSpinnerService
} from 'ngx-spinner';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: []
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UserService, private global: GlobalDataService, private router: Router, private sanitizer: DomSanitizer, private spinner: NgxSpinnerService) {}
  photo = "";
  userArr: User[];
  userArrPermanent: User[];
  currentUser: string;

  ngOnInit() {
    this.getDepartmentUsers("COED");
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.userService.getImageUrlForUser({
      "userId": localStorage.getItem("loggedInUsername")
    }).subscribe((data) => {
      if (!data.action) {
        console.log(data.message)
      } else {
        this.photo = data.message;
      }
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
        console.log(data.message);
      } else {
        this.userArr = JSON.parse(data.message);
        this.userArrPermanent = this.userArr;
        console.log("this is department " + this.userArr[0].department);
      }
    })
  }

  callEdit(tshirtUser,currentUser){
    localStorage.setItem('tshirtUser',tshirtUser);
    this.spinner.show();
    this.router.navigate(['/edit/'+currentUser+'/'+tshirtUser])
  }

  searchWord(word: string) {
    this.userArr = this.userArrPermanent;
    if (word == "")
      return;
    var userArrLen = this.userArr.length;
    var tempUser: User[];
    tempUser = [];
    for (var i = 0; i < userArrLen; i++) {
      if ((this.userArr[i].userId).toLowerCase().indexOf(word.toLowerCase()) >= 0) {

        tempUser.push(this.userArr[i]);
      }
    }
    this.userArr = tempUser;
  }



}
