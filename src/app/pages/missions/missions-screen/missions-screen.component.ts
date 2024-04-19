import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

@Component({
  selector: 'app-missions-screen',
  templateUrl: './missions-screen.component.html',
  styleUrls: ['./missions-screen.component.scss']
})
export class MissionsScreenComponent  implements OnInit {
  walletIsConnected: boolean= false;
  userAddress: string = '';
  actualRoute: string = '';
  showQuickMenu: boolean;

  constructor(
    private connectionService: ConnectionService,
    private router: Router
  ) { }

  ngOnInit(): void {    
    this.connectionService.userAccount.subscribe( (userAccount: any) => {
      this.walletIsConnected = userAccount.isConnected;
      if (this.walletIsConnected) {
        this.userAddress = this.connectionService.getWalletAddress().toLowerCase();
      } else {
        this.userAddress = "";
      }
    });
    this.router.events.subscribe(() => {
      this.showQuickMenu = this.router.url === '/missions' ? false : true;
    });
  }

}
