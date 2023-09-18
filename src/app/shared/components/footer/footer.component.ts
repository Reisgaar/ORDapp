import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';

/**
 * Footer of the DAPP
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  email: string;
  emailError = false;
  emailSent = false;
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogService: DialogService
    ) { }

  ngOnInit(): void {
  }

}
