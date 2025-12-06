import { IonicModule } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation } from '../../services/reservation';

@Component({
  selector: 'app-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss'],
  imports: [IonicModule],
})
export class SessionCardComponent {
  @Input() reservation!: Reservation;

  constructor(private router: Router) {}

  viewDetails() {
    this.router.navigate(['/session-detail', this.reservation.id]);
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return d.toLocaleDateString('fr-FR', options);
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }
}
