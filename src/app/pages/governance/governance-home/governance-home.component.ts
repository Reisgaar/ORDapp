import { Component, OnInit } from '@angular/core';
import { GovernanceDialogService } from 'src/app/shared/services/governance-dialog.service';

/**
 * Home page of governance
 */
@Component({
  selector: 'app-governance-home',
  templateUrl: './governance-home.component.html',
  styleUrls: ['./governance-home.component.scss']
})
export class GovernanceHomeComponent implements OnInit {

  constructor(
    private governanceDialogService: GovernanceDialogService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Opens pop up to buy GQ
   */
  buyGqPopUp(): void {
    this.governanceDialogService.openBuyGqDialog();
  }

}
