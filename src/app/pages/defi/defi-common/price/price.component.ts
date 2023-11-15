import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Pool } from 'src/app/interfaces/pool';
import { DexService } from 'src/app/shared/services/dex/dex.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnInit, OnChanges {
  @Input() pool: Pool;
  @Input() staked: string;
  @Input() token: string;
  @Input() type: string;
  priceBusd: number;
  price: number;

  constructor(private dexService: DexService) {}
  ngOnChanges(changes: SimpleChanges): void {
    changes ? this.setPriceBUSD() : null;
  }

  async ngOnInit(): Promise<void> {
    await this.setPriceBUSD();
  }

  async setPriceBUSD(): Promise<void> {
    this.priceBusd = await this.dexService.tokenPrice(this.pool, this.token, this.type);
    console.log('price', this.priceBusd, parseInt(this.staked), this.type);
    this.price = this.priceBusd * parseInt(this.staked);
  }
}
