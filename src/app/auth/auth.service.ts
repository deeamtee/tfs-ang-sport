import { Injectable } from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {ILogin} from '../model/i-login';
import {tap} from 'rxjs/operators';
import {IUser} from '../model/i-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<IUser>(null);
  redirectUrl: string;

  constructor(private afAuth: AngularFireAuth,
              private router: Router) {
    this.afAuth.authState
      .subscribe(user => {
        console.log('--- user', user);

        if (user) {
          this.user$.next({
            uid: user.uid,
            email: user.email
          });

          return;
        }

        this.user$.next(null);
      });
  }

  isLoggedIn(): boolean {
    return !!this.user$.getValue();
  }

  getUser$(): Observable<IUser> {
    return this.user$.asObservable();
  }

  login({email, password}: ILogin): Observable<any> {
    return from(this.afAuth
      .auth
      .signInWithEmailAndPassword(email, password)
    )
      .pipe(
        tap(() => {
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
            this.redirectUrl = '';
          }
        }),
      )
  }

  signUp({email, password}: ILogin): Observable<any> {
    return from(this.afAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
    )
      .pipe(
        tap(() => {
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
            this.redirectUrl = '';
          }
        }),
      );
  }

  logout() {
    this.afAuth
      .auth
      .signOut()
      .then(() => {
        if (this.router.url.startsWith('/wallets')) {
          this.router.navigate(['/']);
        }
      });
  }
}
