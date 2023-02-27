import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public users:any =[];
  public fullName:string ="";
  public role:string="";
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private api : ApiService,
    private userStore:UserStoreService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.api.getUsers().subscribe(res=>{
      this.users=res;
    })

    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      let funnNameFromToken =this.auth.getFullNameFromToken();
      this.fullName=val || funnNameFromToken
    });

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      let roleFromToken =this.auth.getRoleFromStore();
      this.role=val || roleFromToken
    });

  }

  logOut(){
    this.auth.signOut();
  }

}
