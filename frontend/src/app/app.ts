import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template:`
    @if(headerVisible){
      <app-header/>
    }
    <router-outlet/>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  router = inject(Router);
  headerVisible: boolean = true;
  ngOnInit(){
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        if(val.url == '/auth'){
          this.headerVisible = false;
        } else {
          this.headerVisible = true;
        }
      }
    })
  }
}
