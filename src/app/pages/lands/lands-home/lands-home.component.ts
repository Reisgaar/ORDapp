import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

/**
 * Home page of the lands
 */
@Component({
  selector: 'app-lands-home',
  templateUrl: './lands-home.component.html',
  styleUrls: ['./lands-home.component.scss']
})
export class LandsHomeComponent implements OnInit {
  selectedLang: any;

  constructor(
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.selectedLang = this.translate.defaultLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = event.lang;
    });
  }
}
