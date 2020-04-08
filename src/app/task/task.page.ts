import { Component, OnInit } from '@angular/core';
import {LaunchNavigator,LaunchNavigatorOptions} from '@ionic-native/launch-navigator/ngx';
import {Plugins, GeolocationPluginWeb} from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import { ToastController, NavController } from '@ionic/angular';



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
  public email:string;
  fla:number=0;
  tasklist:Array<
    { 
      title:string,
      vehicleType:string,
      brandName:string,
      vehicleModel:string,
      vehicleCatagory:string,
      number:string,
      parkingarea:string,
      address:string,
      lat:string,
      lng:string,
      name:string,
      details:string,
      description:string
    }
    >=[];

  constructor(
    private launchnavigator:LaunchNavigator,
    private afAuth:AngularFireAuth,
    private afs:AngularFirestore,
    private http:HttpClient,
    private storage:Storage,
    public toastController: ToastController,
    private nav: NavController


  ) { 
  // this.anonLogin();
  }

 ngOnInit() {
    this.storage.get('email').then((res)=>{
      this.email=res;
      console.log(res);
     
     
    }).then(()=>{
      this.batch();
    })
    
   }
  batch(){
    console.log(this.email);
    this.http.post<{list:Array<{vehicle:Array<{
      vehicleType:string,
      brandName:string,
      vehicleModel:string,
      vehicleCatagory:string,
      number:string,
      parkingarea:string,
      address:string,
      lat:string,
      lng:string,
     
    }>,package:Array<{
      name:string,
      details:string,
      description:string
    }>}>,message:boolean,err:string}>('https://mywash.herokuapp.com/batch',{email:this.email}).subscribe(async (result)=>{
      console.log(result);
      if(result.message==false){
console.log("FALSSSE");
const toast = await this.toastController.create({
  message: 'No service pending right now',
  duration: 1500,
  position:'top'
});
toast.present();

        this.fla=0;
      }
      else if(result.list.length==0){
console.log("ERROR");
const toast = await this.toastController.create({
  message: 'No service available right now,check later',
  duration: 1500,
  position:'top'
});
toast.present();

this.fla=0;


      }
      else{
        this.fla=1;
        const ab={
         title:'Task',
         vehicleType:result.list[0].vehicle[0].vehicleType,
         brandName:result.list[0].vehicle[0].brandName,
         vehicleModel:result.list[0].vehicle[0].vehicleModel,
         vehicleCatagory:result.list[0].vehicle[0].vehicleCatagory,
         number:result.list[0].vehicle[0].number,
         parkingarea:result.list[0].vehicle[0].parkingarea,
         address:result.list[0].vehicle[0].address,
         lat:result.list[0].vehicle[0].lat,
         lng:result.list[0].vehicle[0].lng,
         name:result.list[0].package[0].name,
         details:result.list[0].package[0].details,
         description:result.list[0].package[0].description,



      }
      this.tasklist.push(ab);
      this.getLoc();

      console.log(this.tasklist);
      
      //false=No service pending right now
      //error=No service available right now,check later
      //False : no cleaner available or not any service pending
      //Error : No service at this time
      //else push in task list


      }
    }
      );
  }

  navme(){
    let options: LaunchNavigatorOptions = {
      app: this.launchnavigator.APP.GOOGLE_MAPS,
               start:""+this.tasklist[0].lat+","+this.tasklist[0].lng+""
        };
    this.launchnavigator.navigate([Number(this.tasklist[0].lat),Number(this.tasklist[0].lng)],options)
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
      console.log(this.email);
      
      this.http.post<{message:string}>("https://mywash.herokuapp.com/batch/flag",{email:this.email}).subscribe((result)=>{
        console.log(result.message);
        this.batch();
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


  flag(){
    this.batch();

  }


  async getLoc(){

    const resp = await Geolocation.getCurrentPosition();
    this.tasklist[0].lat=String(resp.coords.latitude); 
    this.tasklist[0].lng=String(resp.coords.longitude); 
  //  const options= {maximumAge: 1000, timeout: 5000,
  //     enableHighAccuracy: true }
  //   Geolocation.getCurrentPosition(options).then((resp) => {
            
  //           const templat=resp.coords.latitude;
  //           const templng=resp.coords.longitude;
  //           const loc={
  //             lat:templat,
  //             long:templng
  //           }
  //           console.log(loc);
            
  //           },(er)=>{
  //             console.log(er);
  //             alert('Can not retrieve Location')
  //           }).catch((error) => {
  //           alert('Error getting location - '+JSON.stringify(error))
  //           });
            
           
  }

}
