import { Component, OnInit } from '@angular/core';
import {LaunchNavigator,LaunchNavigatorOptions} from '@ionic-native/launch-navigator/ngx';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  constructor(
    private launchnavigator:LaunchNavigator

  ) { }

  ngOnInit() {
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
}
