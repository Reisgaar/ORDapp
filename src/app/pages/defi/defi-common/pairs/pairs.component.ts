import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Pool } from 'src/app/interfaces/pool';
import { DexService } from 'src/app/shared/services/dex/dex.service';

@Component({
  selector: 'app-pairs',
  templateUrl: './pairs.component.html',
  styleUrls: ['./pairs.component.scss'],
})
export class PairsComponent implements OnInit {
  farms: Pool[] = [];
  displayedColumns: string[] = ['farm'];

  dataSource;

  constructor(
    public dialogRef: MatDialogRef<PairsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string },
    private dexService: DexService
  ) { }
  async ngOnInit(): Promise<void> {
    this.farms = await this.dexService.getPools();
    console.log(this.farms);
    this.dataSource = new MatTableDataSource<Pool>(this.farms);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  closePopUp(): void {
    this.dialogRef.close();
  }

  selectFarm(farm: Pool): void {
    this.dialogRef.close(farm);
  }
}
