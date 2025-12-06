import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← Importer ici
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    IonicModule,
  ],
})
export class RegisterPage {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  telephone: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  async register() {
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      this.showToast(
        'Veuillez remplir tous les champs obligatoires',
        'warning'
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showToast('Les mots de passe ne correspondent pas', 'danger');
      return;
    }

    if (this.password.length < 6) {
      this.showToast(
        'Le mot de passe doit contenir au moins 6 caractères',
        'warning'
      );
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Création du compte...',
      spinner: 'crescent',
    });
    await loading.present();

    const registerData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      telephone: this.telephone,
    };

    this.authService.register(registerData).subscribe({
      next: async (response) => {
        await loading.dismiss();
        this.showToast('Compte créé avec succès !', 'success');
        this.router.navigate(['/login']);
      },
      error: async (error) => {
        await loading.dismiss();
        this.showToast('Erreur lors de la création du compte', 'danger');
        console.error('Register error:', error);
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
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
