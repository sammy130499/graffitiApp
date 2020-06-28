import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute) { }

  ngOnInit() {
  }

  showHome(){
    let username=localStorage.getItem('loggedInUsername');
    this.router.navigate(['/dashboard/'+username])
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
