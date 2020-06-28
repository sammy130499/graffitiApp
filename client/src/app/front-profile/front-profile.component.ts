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
  NgxSpinnerService
} from 'ngx-spinner';
import {
  Router
} from '@angular/router';
import { AlertService } from '../alert.service';


@Component({
  selector: 'app-front-profile',
  templateUrl: './front-profile.component.html',
  styleUrls: ['./front-profile.component.css']
})
export class FrontProfileComponent implements OnInit {

  constructor(private userService: UserService, private global: GlobalDataService, private spinner: NgxSpinnerService, private router: Router,private alert:AlertService) {}
  dataUrl;
  ngOnInit() {
    this.dataUrl='../../assets/images/load.svg'
    this.spinner.show();
    this.userService.getImageUrlForUser({"face":"front"}).subscribe(async (res) => {
      this.spinner.hide();
      if (!res.action) {
        console.log(res.message);
      } else {
        this.dataUrl=res.message;
      }
    })
  }

}
