import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.loginForm = this.formBuilder.group({
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.userService
      .login({
        phoneNumber: this.f['phoneNumber'].value,
        password: this.f['password'].value,
      })
      .subscribe({
        next: (response) => {
          console.log('Login response:', response);

          this.success = true;

          this.userService.fetchUserDetails().subscribe({
            next: (userDetails) => {
              console.log('Full user details:', userDetails);
              this.loading = false;

              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1000);
            },
            error: (err) => {
              console.error('Failed to fetch user details:', err);
              this.loading = false;

              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1000);
            },
          });
        },
        error: (error) => {
          this.error =
            'Login failed. Please check your phone number and password.';
          this.loading = false;
          console.error('Login error', error);
        },
      });
  }
   
}
