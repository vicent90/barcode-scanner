import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BeepService } from './beep.service';
import Quagga from '@ericblade/quagga2';

@Component({
  selector: 'app-barcode-scan',
  templateUrl: './barcode-scan.component.html',
  styleUrls: ['./barcode-scan.component.css']
})
export class BarcodeScanComponent implements AfterViewInit, OnDestroy {
  errorMessage: string | undefined;
  private lastScannedCode: string | undefined;
  private lastScannedCodeDate: number | undefined;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private beepService: BeepService,
    private router: Router) {
  }
  ngOnDestroy(): void {
    Quagga.stop();
  }

  ngAfterViewInit(): void {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported';
      return;
    }

    Quagga.init({
      inputStream: {
        constraints: {
          facingMode: 'environment'
        },
        area: { // defines rectangle of the detection/localization area
          top: '40%',    // top offset
          right: '0%',  // right offset
          left: '0%',   // left offset
          bottom: '40%'  // bottom offset
        },
      },
      decoder: {
        readers: ['ean_reader']
      },
    },
      (err) => {
        if (err) {
          this.errorMessage = `QuaggaJS could not be initialized, err: ${err}`;
        } else {
          Quagga.start();
          Quagga.onDetected((res) => {
            this.onBarcodeScanned(res?.codeResult?.code as string);
          });
        }
      });
  }



  onBarcodeScanned(code: string) {
    // ignore duplicates for an interval of 3 seconds
    const now = new Date().getTime();
    if (this.lastScannedCodeDate && code === this.lastScannedCode && now < this.lastScannedCodeDate + 3000) {
      return;
    }
    this.lastScannedCode = code;
    this.lastScannedCodeDate = now;
    this.beepService.beep();
    this.changeDetectorRef.detectChanges();

    this.router.navigate(['/', code]);
  }

}
