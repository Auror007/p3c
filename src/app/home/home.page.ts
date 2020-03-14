import { Component, ViewChild, ElementRef } from '@angular/core';
import {Plugins, GeolocationPluginWeb} from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

const {Geolocation} =Plugins;

 declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  locations:Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
  user=null;

  @ViewChild('map',{static:false}) mapElement:ElementRef;
  map:any;
  markers=[];
  isTracking = false;
  watch: string;
  constructor(private afAuth:AngularFireAuth,private afs:AngularFirestore) {
    this.anonLogin();
  }

  ionViewWillEnter(){
    this.loadMap();
  }
  loadMap(){
    let latlng=new google.maps.LatLng(51.9090902,7,6673267);

    let mapOptions={
      center:latlng,
      zoom:5,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    this.map=new google.maps.Map(this.mapElement.nativeElement,mapOptions);
  }
  
  anonLogin(){

    //email auth
    this.afAuth.auth.signInWithEmailAndPassword('abcdef@email.com','abcdef' ).then(user=>{
      console.log(user);
      this.user=user;
      this.locationsCollection=this.afs.collection(
        `locations/cleaner1/track`,
        ref=>ref.orderBy('timestamp',"desc")
      );
      
      this.locations = this.locationsCollection.snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
 
      // Update Map marker on every change
      this.locations.subscribe(locations => {
        this.updateMap(locations);
      });
    });
  }

  startTracking() {
    this.isTracking = true;
    this.watch = Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        this.addNewLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.timestamp
        );
      }
    });

  }
   
  // Unsubscribe from the geolocation watch using the initial ID
  stopTracking() {
    Geolocation.clearWatch({ id: this.watch }).then(() => {
      this.isTracking = false;
    });
  }
   
  // Save a new location to Firebase and center the map
  addNewLocation(lat, lng, timestamp) {

    this.locationsCollection.add({
      lat,
      lng,
      timestamp
    });
   
    let position = new google.maps.LatLng(lat, lng);
    this.map.setCenter(position);
    this.map.setZoom(14);

    this.locations.subscribe(locations => {
      this.updateMap(locations);
      console.log(locations);
    });
  }
   
  // Delete a location from Firebase
  deleteLocation(pos) {
      this.locationsCollection.doc(pos.id).delete();
  }
   
  // Redraw all markers on the map
  updateMap(locations) {
    // Remove all current marker
    this.markers.map(marker => marker.setMap(null));
    this.markers = [];
    // for (let loc of locations) {
      let latLng = new google.maps.LatLng(locations[0].lat, locations[0].lng);
   
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
      this.markers.push(marker);
      this.map.center=latLng;
    // }
  }
}
