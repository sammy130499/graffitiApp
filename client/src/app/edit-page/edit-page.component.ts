import { Component, OnInit } from '@angular/core';
import ImageEditor from 'tui-image-editor';
import { UserService } from '../user.service';
import { GlobalDataService } from '../global-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute) { }
  
  ngOnInit() {

  
}


showFront()
{
  this.router.navigate(['front'],{relativeTo:this.route});
}

showBack()
{
  this.router.navigate(['back'],{relativeTo:this.route});
}


         

}
