import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-qrcode-modal',
  imports: [CommonModule, IonicModule],
  standalone: true,
  templateUrl: './qrcode-modal.component.html',
  styleUrls: ['./qrcode-modal.component.scss'],
})
export class QrcodeModalComponent {
  @Input() qrCodeData!: string;
  @Input() reservationInfo: any;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
}
