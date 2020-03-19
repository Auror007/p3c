import { Component, OnInit } from '@angular/core';
import {LaunchNavigator,LaunchNavigatorOptions} from '@ionic-native/launch-navigator/ngx';
import {Plugins, GeolocationPluginWeb} from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
const {Geolocation} =Plugins;


@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  locations:Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
  user=null;
  watch: string;
  butext:string='START JOB';
  bucolor:string='primary';
  tasklist:Array<
    { 
      title:string,
      duration:string,
      det:string
    }
    >=[
      {title:'Task1',duration:'1month',det:'External Wash Weekly + 1 Extra interior wash'},
      {title:'Task2',duration:'2month',det:'External Wash Weekly + 1 Extra interior wash'},
      {title:'Task3',duration:'2month',det:'External Wash weekly + 2 Extra interior wash'},

  ];

  constructor(
    private launchnavigator:LaunchNavigator,
    private afAuth:AngularFireAuth,
    private afs:AngularFirestore,
    private http:HttpClient

  ) { 
   // this.anonLogin();
  }

  ngOnInit() {
    this.http.post('https://mywash.herokuapp.com/batch',{email:'meetp6041@gmail.com'}).subscribe((result)=>{
      
      console.log(result);
      
    });
  }

  navme(){
    let options: LaunchNavigatorOptions = {
      app: this.launchnavigator.APP.GOOGLE_MAPS,
               start:"Manchester, UK"
        };
    this.launchnavigator.navigate('London, ON',options)
    .then(success =>{
      console.log(success);
    },error=>{
      console.log(error);
    })
  }



  anonLogin(pos){

    //email auth
  
  if(this.butext=="START JOB"){
    this.butext="REACHED LOCATION";
    this.bucolor="dark";

    this.afAuth.auth.signInWithEmailAndPassword('abcdef@email.com','abcdef' ).then(user=>{
      console.log(user);
      this.user=user;
      this.locationsCollection=this.afs.collection(
        `locations/cleaner1/track`,
        ref=>ref.orderBy('timestamp',"desc")
      );
      
      
      this.watch = Geolocation.watchPosition({enableHighAccuracy:true}, (position) => {
        if (position) {
          console.log(position);
          
          this.addNewLocation(
            position.coords.latitude,
            position.coords.longitude,
            position.timestamp
          );
        }
      });

     
     });}
    else if(this.butext=="REACHED LOCATION")
    {
      Geolocation.clearWatch({id:this.watch});
      this.butext="TASK COMPLETED";
      this.bucolor="danger";

    }
    else if(this.butext=="TASK COMPLETED")
    {
      this.http.post<{message:string}>("https://mywash.herokuapp.com/batch/flag",{email:'meetp6041@gmail.com'}).subscribe((result)=>{
        console.log(result.message);
      });
      this.deleteTask(pos);
    }
  }

  addNewLocation(lat, lng, timestamp) {
    console.log("CALLED ME");

    this.locationsCollection.doc('locat').set({
      lat,
      lng,
      timestamp
    });
    
  }

  deleteTask(pos){
    const num=this.tasklist.indexOf(pos);
    this.tasklist.splice(0,1);
    this.butext="START JOB"
    this.bucolor="primary"
  }

}
