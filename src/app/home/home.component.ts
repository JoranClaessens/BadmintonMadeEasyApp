import { Component, OnInit, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'bme-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  @ViewChild(Slides) slides: Slides;

  constructor() { }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.keepSliding();
  }

  keepSliding() {
    setTimeout(() => {
      if (!this.slides.isEnd()) {
        this.slides.slideNext(1000);
      } else {
        this.slides.slideTo(0, 1000);
      }
      this.keepSliding();
    }, 4000);
  }
}
