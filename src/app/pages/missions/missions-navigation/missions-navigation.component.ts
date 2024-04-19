import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-missions-navigation',
  templateUrl: './missions-navigation.component.html',
  styleUrls: ['./missions-navigation.component.scss']
})
export class MissionsNavigationComponent implements OnInit {
  showHomeLink: boolean = false;
  actualRoute: string = '';
  showResponsiveMenu: boolean = false;

  constructor(
    private router: Router
  ) { }
  
  /**
   * Gets url to set actual route
   */
  ngOnInit(): void {
    this.actualRoute = this.router.url;
    this.router.events.subscribe((val: any) => {
      if (val.url) {
        this.actualRoute = val.url;
      }
    });
  }

  toggleMenuOnResponsive(): void {
    this.showResponsiveMenu = !this.showResponsiveMenu;
  }

  closeResponsiveMenu(): void {
    this.showResponsiveMenu = false;
  }
}
