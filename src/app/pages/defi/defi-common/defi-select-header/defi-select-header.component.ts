import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

@Component({
  selector: 'app-defi-select-header',
  templateUrl: './defi-select-header.component.html',
  styleUrls: ['./defi-select-header.component.scss']
})
export class DefiSelectHeaderComponent implements OnInit {

  @Input() type: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit(): void {
  }

  goTo(link){
    this.router.navigate([link]);
  }

}
