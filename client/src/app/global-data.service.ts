import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  loggedInUsername:string;

  editingUsername:string;

  constructor() { }

  
  public get loggedUsername() : string {
    return this.loggedInUsername;
  }

  
  public set loggedUsername(v : string) {
    this.loggedInUsername = v;
  }

  
  public get beingEditUsername() : string {
    return this.editingUsername;
  }

  
  public set beingEditUsername(v : string) {
    this.editingUsername = v;
  }
  
  
  
  
}
