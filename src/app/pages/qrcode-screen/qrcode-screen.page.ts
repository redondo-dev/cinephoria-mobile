import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonSpinner,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, close, checkmarkCircle } from 'ionicons/icons';
import { ReservationService, QRCodeResponse } from '../../services/reservation';

@Component({
  selector: 'app-qrcode-screen',
  templateUrl: './qrcode-screen.page.html',
  styleUrls: ['./qrcode-screen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class QrcodeScreenPage implements OnInit {
  qrCodeData: string = '';
  reservationInfo: any;
  isLoading: boolean = true;
  reservationId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    addIcons({ arrowBack, close, checkmarkCircle });
  }

  ngOnInit() {
    this.reservationId = parseInt(
      this.route.snapshot.paramMap.get('id') || '0'
    );
    this.loadQRCode();
  }

  async loadQRCode() {
    const loading = await this.loadingController.create({
      message: 'Génération du QR Code...',
      spinner: 'crescent',
    });
    await loading.present();

    this.reservationService.getQRCode(this.reservationId).subscribe({
      next: async (response: QRCodeResponse) => {
        console.log('QR Code reçu:', response);
        await loading.dismiss();

        if (response.success) {
          this.qrCodeData = response.qrCode;
          this.reservationInfo = response.reservation;
          this.isLoading = false;
        } else {
          this.showToast('Impossible de générer le QR Code', 'danger');
          this.goBack();
        }
      },
      error: async (error) => {
        console.error('Erreur génération QR Code:', error);
        await loading.dismiss();
        this.isLoading = false;
        this.showToast('Erreur lors de la génération du QR Code', 'danger');
      },
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    toast.present();
  }
}
