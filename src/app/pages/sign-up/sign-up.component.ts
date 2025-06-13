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
  selector: 'app-register', 
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
})
export class RegisterComponent implements OnInit {
 
  registerForm!: FormGroup;
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

    
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required], 
      lastName: ['', Validators.required], 
      phoneNumber: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

  
  get f() {
    return this.registerForm.controls;
  }

  
  onSubmit() {
   
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true; 
    this.error = ''; 

   
    this.userService.register(this.registerForm.value).subscribe({
      next: () => {
       
        this.success = true;
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
       
        if (error.error && typeof error.error === 'string') {
          this.error = error.error; 
        } else {
          this.error = 'Registration failed. Please try again!'; 
        }
        this.loading = false; 
        console.error('Registration error', error); 
      },
    });
  }
}
