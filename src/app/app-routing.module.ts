import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeScanComponent } from './barcode-scan/barcode-scan.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: 'barcode-scan', component: BarcodeScanComponent },
  { path: ':barcode', component: HomeComponent },
  { path: '**', component: HomeComponent }
]
@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
