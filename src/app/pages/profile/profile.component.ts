import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserProfileService } from '../../service/user-profile.service';
import { AuthResponse } from '../../models';
import { UserProfile } from '../../models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
})
export class ProfileComponent implements OnInit {
  user: AuthResponse | null = null;
  profile: UserProfile | null = null;
  editMode = false;
  loading = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = this.authService.currentUser;

    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.userProfileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        this.profile = {};
        this.loading = false;
      },
    });
  }

  saveProfile(): void {
    if (!this.profile) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.userProfileService.updateProfile(this.profile).subscribe({
      next: (data) => {
        this.profile = data;
        this.editMode = false;
        this.success = 'Profile updated successfully.';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update profile. Please try again.';
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}