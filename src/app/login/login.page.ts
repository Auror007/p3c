import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {Storage} from '@ionic/storage';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email:string;

  constructor(
    private router:Router,
    private http:HttpClient,
    private storage:Storage
  ) { }

  ngOnInit() {
    this.storage.get('activity').then((res)=>{
if(res=='loggedin'){
  this.router.navigateByUrl('/task');
}    

    });
  }

  login(){

    const data={email:this.email }
    console.log(data);
    
    this.http.post('https://mywash.herokuapp.com/cleaner/loginotp',data).subscribe((result)=>{
    console.log(result);
    this.storage.set('email',this.email).then((res)=>{
      console.log(res);
      // this.router.navigateByUrl('/loginotp',{skipLocationChange:true});
      this.router.navigate(['/loginotp'],{replaceUrl:true});
    });


    
    })
    
  }

}
