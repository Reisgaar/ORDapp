import { Component } from '@angular/core';
import packageInfo from 'package.json';


@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent {
  data = {
    name: packageInfo.name,
    version: packageInfo.version
  };
}
