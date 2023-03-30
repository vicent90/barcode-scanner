import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { PricesService } from '../services/prices.service';
import { ActivatedRoute } from '@angular/router';

type Product = {
  prices: {
    offertPrice: number;
    listPrice: number;
    listDate: string;
  }
  name: string;
  listDate: string;
  barcode: string;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChild('input') inputBarcode: ElementRef | undefined;
  title = 'casa-mazzaro';
  products: Product[] = [];
  showSpinner = false;
  barcode = '';
  name = '';
  isMobile = false;

  constructor(private pricesService: PricesService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.isMobile = ((window.innerWidth <= 1080) && (window.innerHeight <= 600));
    if (!this.isMobile) {
      setTimeout(() => {
        this.inputBarcode!.nativeElement.focus();
      }, 0);
    }
    if (this.activatedRoute.snapshot.paramMap.get('barcode')) {
      this.barcode = this.activatedRoute.snapshot.paramMap.get('barcode')!;
      this.onGetPrices();
    }
  }


  onGetPrices() {
    if (this.barcode.length > 2 || this.name.length > 2) {
      this.showSpinner = true;
      this.products = [];
      this.pricesService.getPrices(this.barcode, this.name)
        .subscribe((result: any) => {
          this.products = result.products;
          this.clearForm();
        });
    }
  }

  clearForm() {
    this.showSpinner = false;
    this.barcode = '';
    this.name = '';
    if (this.isMobile) {
      setTimeout(() => {
        this.inputBarcode!.nativeElement.blur();
      }, 0);
    }
  }
}
