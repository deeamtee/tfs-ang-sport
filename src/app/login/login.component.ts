import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {ILogin} from '../model/i-login';
import {FirebaseError} from 'firebase';
import {Router} from '@angular/router';

const WRONG_PASSWORD_ERROR = 'auth/wrong-password';
const ERROR_MESSAGE = {
  DEFAULT: 'Неизвестная ошибка. Попробуйте позже',
  [WRONG_PASSWORD_ERROR]: 'Неверные имя пользователя и пароль'
};

@Component({
  selector: 'tfs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMessage = '';

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['test@test.test', [Validators.required, Validators.email]],
      password: ['test123', [Validators.required, Validators.minLength(6)]]
    });

  }

  submit() {
    this.handleAuth(this.authService.login.bind(this.authService));
    this.router.navigateByUrl('')
  }

  private handleAuth(authMethod: (data: ILogin) => Observable<any>) {
    if (this.form.invalid) {
      return;
    }

    this.errorMessage = '';

    authMethod(this.form.value)
      .subscribe(() => {
        this.clearForm();
      }, error => {
        this.handleError(error);
      });
  }
  private handleError(error: FirebaseError) {
    this.errorMessage = ERROR_MESSAGE[error.code] || ERROR_MESSAGE.DEFAULT;
  }
  private clearForm() {
    this.form.reset();
  }
}
