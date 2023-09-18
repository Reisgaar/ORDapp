import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MedalsService } from 'src/app/shared/services/nft/medals.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit, OnChanges, OnDestroy {
  medals: any;
  userHasMedals: boolean = false;
  loadingMedalsData: boolean = true;
  interval: any;
  @Input() wallet: string;

  constructor(
    private medalsService: MedalsService
  ) {}

  /**
   * Sets interval to get wallet info
   */
  ngOnInit(): void {
    this.getMedals();
    this.interval = setInterval(() => {
      this.getMedals();
    }, 20000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes && changes.wallet.currentValue) {
      this.getMedals();
    }
  }

  /**
   * Clear interval and unsubscribe all subscriptions if exist
   */
  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Gets medals of the profile
   */
  async getMedals(): Promise<any> {
    if (this.wallet && this.wallet !== '') {
      this.medals = await this.medalsService.getAchievements(this.wallet);
      this.userHasMedals = Object.values(this.medals).includes(true);
      this.loadingMedalsData = false;
    }
  }

}
