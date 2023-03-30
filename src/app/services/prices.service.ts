import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PricesService {

  constructor(private http: HttpClient) { }

  getPrices(barcode: string, name?: string) {
    const options = {
      params:
        new HttpParams()
          .set('barcode', barcode)
          .set('name', name!)
    };
    return this.http.get("https://inventory-chas.herokuapp.com/products", options);
  }
}
