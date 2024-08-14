import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(7)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Forma je validna i podaci su:', this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe(
        resData => {
          console.log('Registracija uspela');
          console.log(resData);
          this.router.navigate(['/auth/login']);
        },
        error => {
          console.error('Greška prilikom registracije:', error);
        }
      );
    } else {
      console.log('Molimo popunite ispravno sva polja.');
    }
  }
}
