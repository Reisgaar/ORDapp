import { Component } from '@angular/core';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

@Component({
  selector: 'app-missions-connect-wallet',
  templateUrl: './missions-connect-wallet.component.html',
  styleUrls: ['./missions-connect-wallet.component.scss']
})
export class MissionsConnectWalletComponent {

  constructor(
    private connectionService: ConnectionService
  ) { }

  connect(): void {
    this.connectionService.openModal();
  }

}
