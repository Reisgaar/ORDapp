import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { default as langFile } from 'src/assets/i18n/en.json';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FaqComponent implements OnInit {
  selectedTab = '';
  browserLang: string;
  previousElement: any;
  actualElement: any;
  // Get faq from lang file to set on html view
  faqJson: any = langFile.faq;

  constructor(private translate: TranslateService) {}

  // Change slider on resize
  @HostListener('window:resize', ['$event'])
  async onResize(): Promise<any> {
    this.fixSizeOnChanges();
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe( () => {
      this.fixSizeOnChanges();
    });
  }

  setSelectedTab(newTab: string): void {
    if (this.selectedTab !== newTab) {
      this.selectedTab = newTab;
    } else {
      this.selectedTab = '';
    }
  }

  async fixSizeOnChanges(): Promise<any> {
    try {
      const openedDiv = document.getElementsByClassName('active')[0];
      if (openedDiv && this.actualElement) {
        await this.sleep(10);
        this.actualElement.style.height = 'max-content';
        this.actualElement.style.height = this.actualElement.scrollHeight + 'px';
      }
    } catch (error) {
      console.log(error);
    }

  }

  sleep(ms: any): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showPoint(e: any): void {
    // Only work if head is clicked
    if (e.target.classList.contains('point')) {
      this.changeOpenCloseIcon(e);
      this.changeDivHeight(e);
    }
  }

  changeDivHeight(e: any): void {
    // Get actual element
    this.actualElement = e.target.getElementsByClassName('steps')[0];
    // Set previous element to height 0
    if (this.previousElement) {
      this.previousElement.style.height = '0px';
    }
    // Set actual elements height
    if (this.previousElement !== this.actualElement) {
      this.actualElement.style.height = this.actualElement.scrollHeight + 'px';
      this.previousElement = this.actualElement;
    } else {
      this.previousElement = null;
    }
  }

  changeOpenCloseIcon(e: any): void {
    // Get active element and set class if neccesary
    const activeElement = document.getElementsByClassName('active')[0];
    if (activeElement) {
      activeElement.classList.remove('active');
      if (activeElement !== e.target) {
        e.target.classList.toggle('active');
      }
    } else {
      e.target.classList.toggle('active');
    }
  }
}
