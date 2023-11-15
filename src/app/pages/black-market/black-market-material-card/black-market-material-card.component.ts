import { Component, Input } from '@angular/core';
import { BlackMarketService } from 'src/app/shared/services/black-market/black-market.service';
import { MaterialsService } from 'src/app/shared/services/materials.service';

@Component({
  selector: 'app-black-market-material-card',
  templateUrl: './black-market-material-card.component.html',
  styleUrls: ['./black-market-material-card.component.scss']
})
export class BlackMarketMaterialCardComponent {
  @Input() sale: any;
  @Input() owner: string;

  constructor(
    private blackMarketService: BlackMarketService,
    private materialsService: MaterialsService
  ) {}

  /**
   * Removes the sale
   */
  async removeSale(): Promise<any> {
    this.blackMarketService.removeSale(this.sale.id);
  }

  /**
   * Buy the material sale
   */
  async buyMaterials(): Promise<any> {
    const materialName = this.materialsService.materialToTicker(this.sale.material);
    this.blackMarketService.buyMaterials(this.sale.id, this.sale.price, materialName, this.sale.quantity);
  }

}
