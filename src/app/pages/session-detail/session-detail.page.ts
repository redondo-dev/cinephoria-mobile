import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonSpinner,
  IonChip,
  IonLabel,
  ModalController,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendar,
  time,
  location,
  people,
  cash,
  checkmarkCircle,
  qrCode,
} from 'ionicons/icons';
import { Reservation, ReservationService } from '../../services/reservation';
import { QrcodeModalComponent } from '../../components/qrcode-modal/qrcode-modal.component';
import { AppBarComponent } from '../../components/app-bar/app-bar.component';

@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.page.html',
  styleUrls: ['./session-detail.page.scss'],
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
    IonChip,
    IonLabel,
    AppBarComponent,
  ],
})
export class SessionDetailPage implements OnInit {
  reservation!: Reservation;
  reservationId!: number;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    addIcons({
      calendar,
      time,
      location,
      people,
      cash,
      checkmarkCircle,
      qrCode,
    });
  }

  ngOnInit() {
    this.reservationId = parseInt(
      this.route.snapshot.paramMap.get('id') || '0'
    );
    this.loadReservationDetail();
  }

  loadReservationDetail() {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (data) => {
        console.log('Détail réservation:', data);
        this.reservation = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement détail:', error);
        this.isLoading = false;
        this.showToast('Erreur lors du chargement', 'danger');
      },
    });
  }

  async showQRCode() {
    const loading = await this.loadingController.create({
      message: 'Génération du QR Code...',
      spinner: 'crescent',
    });
    await loading.present();

    this.reservationService.getQRCode(this.reservationId).subscribe({
      next: async (response) => {
        await loading.dismiss();

        if (response.success) {
          const modal = await this.modalController.create({
            component: QrcodeModalComponent,
            componentProps: {
              qrCodeData: response.qrCode,
              reservationInfo: {
                film: this.reservation.seance.film.titre,
                date: this.formatDate(this.reservation.seance.date_seance),
                time: `${this.formatTime(
                  this.reservation.seance.date_heure_debut
                )} - ${this.formatTime(
                  this.reservation.seance.date_heure_fin
                )}`,
                salle: this.reservation.seance.salle.nom_salle,
                places: this.reservation.nb_places,
              },
            },
            cssClass: 'qr-modal',
          });
          await modal.present();
        }
      },
      error: async (error) => {
        await loading.dismiss();
        this.showToast('Erreur lors de la génération du QR Code', 'danger');
        console.error('QR Code error:', error);
      },
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
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
