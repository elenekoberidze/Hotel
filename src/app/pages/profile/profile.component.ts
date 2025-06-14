import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../modules/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
   
    this.user = this.userService.currentUserValue;

    
    console.log('Profile data:', this.user);

  
    if (!this.user || !this.userService.isLoggedIn()) {
      console.log('User is not authorized, redirecting to login page');
      this.router.navigate(['/login']);
      return;
    }

    
    if (this.isMissingDetails()) {
      console.log('User details are incomplete, attempting to refresh...');
      this.refreshUserDetails();
    }
  }

  
  isMissingDetails(): boolean {
    if (!this.user) return true;

  
    return (
      !this.user.firstName ||
      !this.user.lastName ||
      !this.user.email ||
      !this.user.role
    );
  }

    refreshUserDetails(): void {
    this.userService.fetchUserDetails().subscribe({
      next: (updatedUser) => {
        console.log('User details updated:', updatedUser);
        this.user = updatedUser;
      },
      error: (err) => {
        console.error('Error updating user details:', err);
      },
    });
  }

  
  hasValue(field: string): boolean {
    return !!(this.user && (this.user as any)[field]);
  }

  
  logout(): void {
    this.userService.logout();
    this.router.navigate(['/home']);
  }
}
