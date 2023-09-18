import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { userSpecie } from './constants/inventory';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'or-dapp';
  userSpecieImage = userSpecie;

  constructor(
    public translate: TranslateService
  ){
    // Register translation languages
    translate.addLangs(['en', 'es']);
    localStorage.setItem('slipTolerance', '2');
    localStorage.setItem('transDeadLine', '20');
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (selectedLanguage) {
      // Set default language
      translate.setDefaultLang(selectedLanguage);
    } else {
      // Set default language
      translate.setDefaultLang('en');
    }
  }
}
