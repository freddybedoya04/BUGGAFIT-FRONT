import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ILogin } from 'src/app/Interfaces/ilogin';
import { LoginService } from 'src/app/Servicios/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private loginService: LoginService,
  ) {
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      pass: ['', Validators.required]
    })
  }

  Login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      for (const key in this.loginForm.controls) {
        if (this.loginForm.controls[key].invalid)
          this.loginForm.controls[key].markAsDirty();
      }
      return
    }
    const credencialesDeAcceso: ILogin = {
      Cedula: this.loginForm.controls["user"].value,
      Contraseña: this.loginForm.controls["pass"].value,
    }
    this.loginService.Login(credencialesDeAcceso).subscribe((result: any) => {
      if (result.StatusCode === 200) {
        this.route.navigate(['principal'])
      }
    });
  }
}
