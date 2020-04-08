import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Storage} from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginotp',
  templateUrl: './loginotp.page.html',
  styleUrls: ['./loginotp.page.scss'],
})
export class LoginotpPage implements OnInit {

  public email:string;
  public otp:any;
  constructor(
    private http:HttpClient,
    private storage:Storage,
    private router:Router

  ) { }

  ngOnInit() {
    this.storage.get('email').then((data)=>{
      this.email=data;

    })
  }

  verify(){
    
    const data={email:this.email,otp:this.otp}
    console.log(data);
    
    this.http.post('https://mywash.herokuapp.com/cleaner/verifylogin',data).subscribe((result)=>{

    console.log(result);
    this.storage.set('activity','loggedin').then((res)=>{
      console.log(res);
      this.router.navigate(['/task'],{replaceUrl:true});

    });

  })
  }
}
