import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api';

export interface Reservation {
  id: number;
  utilisateur_id: number;
  seance_id: number;
  nb_places: number;
  prix_unitaire: number;
  statut_reservation: string;
  date_creation: string;
  seance: {
    id: number;
    date_seance: string;
    date_heure_debut: string;
    date_heure_fin: string;
    film: {
      id: number;
      titre: string;
      affiche: string;
      duree: number;
    };
    salle: {
      id: number;
      nom_salle: string;
      numero: number;
    };
     cinema?: {
        id: number;
        nom: string;
        ville: string;
      };
  };
}

export interface QRCodeResponse {
  success: boolean;
  qrCode: string;
  reservation: any;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private apiService: ApiService) {}

  getMyReservations(): Observable<Reservation[]> {
    return this.apiService
      .get<{ success: boolean; count: number; data: Reservation[] }>(
        '/user/reservations'
      )
      .pipe(
        map((res) => {
          console.log('Réponse API brute:', res);
          console.log('Données:', res.data);
          return res.data || [];
        })
      );
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.apiService
      .get<{ success: boolean; data: Reservation }>(`/user/reservations/${id}`)
      .pipe(map((res) => res.data));
  }

  getQRCode(reservationId: number): Observable<QRCodeResponse> {
    return this.apiService.get<QRCodeResponse>(
      `/user/reservations/${reservationId}/qrcode`
    );
  }

  private filterUpcomingSessions(reservations: Reservation[]): Reservation[] {
    const now = new Date();
    return reservations
      .filter((reservation) => {
        const seanceDateTime = new Date(
          `${reservation.seance.date_seance}T${reservation.seance.date_heure_debut}`
        );
        return seanceDateTime >= now;
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.seance.date_seance}T${a.seance.date_heure_debut}`
        );
        const dateB = new Date(
          `${b.seance.date_seance}T${b.seance.date_heure_debut}`
        );
        return dateA.getTime() - dateB.getTime();
      });
  }
}
