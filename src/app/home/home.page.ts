import { Component, OnInit } from '@angular/core';
import {
  IonicModule,
  LoadingController,
  ToastController,
  IonRefresher,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { Reservation, ReservationService } from '../services/reservation';

// Import des composants standalone que tu as créés
import { AppBarComponent } from '../components/app-bar/app-bar.component';
import { HorizontalSessionListComponent } from '../components/horizontal-session-list/horizontal-session-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppBarComponent,
    HorizontalSessionListComponent,
   
  ],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  reservations: Reservation[] = [];
  isLoading: boolean = true;
  currentUser: any;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadReservations();
  }

  async loadReservations() {
    const loading = await this.loadingController.create({
      message: 'Chargement de vos réservations...',
      spinner: 'crescent',
    });
    await loading.present();

    this.reservationService.getMyReservations().subscribe({
      next: async (data) => {
        this.reservations = data;
        this.isLoading = false;
        await loading.dismiss();
      },
      error: async (error) => {
        this.isLoading = false;
        await loading.dismiss();
        this.showToast('Erreur lors du chargement des réservations', 'danger');
        console.error('Error loading reservations:', error);
      },
    });
  }

  async doRefresh(event: any) {
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        event.target.complete();
      },
      error: (error) => {
        console.error('Refresh error:', error);
        event.target.complete();
      },
    });
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
