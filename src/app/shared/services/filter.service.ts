import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AllFilter, OrArmorFilter, OrClanFilter, OrCosmeticFilter, OrVehicleFilter, OrWeaponFilter } from 'src/app/constants/filters';

/**
 * Service to manage filtering functions
 */
@Injectable({
  providedIn: 'root'
})
export class FilterService {
  landFilters = new BehaviorSubject<any>({
    zone: { ring: '', sector: '', district: ''},
    sizes: { nano: true, micro: true, standard: true, macro: true, mega: true }
  });
  landFilters$ = this.landFilters.asObservable();

  constructor() { }

  /**
   * Get the filters by given category
   * @param category : OR NFT category
   * @returns : filter of the category
   */
  getFilters(category: string): any {
    switch (category.toLowerCase()) {
      case 'all':       return AllFilter;
      case 'weapons':   return OrWeaponFilter;
      case 'armors':    return OrArmorFilter;
      case 'vehicles':  return OrVehicleFilter;
      case 'cosmetics': return OrCosmeticFilter;
      case 'clan':      return OrClanFilter;
    }
  }

  landFilterChanges(zone: any, sizes: any): any {
    this.landFilters.value.zone = zone;
    this.landFilters.value.sizes = sizes;
    this.landFilters.next(this.landFilters.getValue());
  }
}
