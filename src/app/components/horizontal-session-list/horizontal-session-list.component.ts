import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { Reservation } from '../../services/reservation';
import { SessionCardComponent } from '../session-card/session-card.component';

@Component({
  selector: 'app-horizontal-session-list',
  standalone: true,
  imports: [CommonModule, IonicModule, SessionCardComponent],
  templateUrl: './horizontal-session-list.component.html',
  styleUrls: ['./horizontal-session-list.component.scss'],
})
export class HorizontalSessionListComponent {
  @Input() reservations: Reservation[] = [];
  @Input() title: string = 'Mes réservations';
}
