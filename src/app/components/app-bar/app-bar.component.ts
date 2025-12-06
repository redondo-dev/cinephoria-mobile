import { IonicModule } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-app-bar',
  standalone:true,
  imports: [IonicModule,CommonModule],
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss'],
})
export class AppBarComponent {
  @Input() title: string = 'Cinephoria';
  @Input() showBack: boolean = false;
  @Input() showLogout: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goBack() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
  }
}
