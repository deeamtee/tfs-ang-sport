import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IInfo} from '../model/i-info';
import {ITraining} from '../model/i-training';
import {takeUntil} from 'rxjs/operators';
import {InfoService} from './info.service';
import {Observable, Subject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {IUser} from '../model/i-user';

const wordRegex = /^[а-я ,.'-]+$/i;
const basePhoto = 'https://blinmen.ru/wp-content/uploads/2011/09/user-profile.png';

@Component({
  selector: 'tfs-profile',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @Output() addInfo = new EventEmitter<IInfo>();
  form: FormGroup;
  user$: Observable<IUser>;

  private destroy$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder,
              private infoService: InfoService,
              private authService: AuthService) {
  }

  get name(): AbstractControl {
    return this.form.get('name');
  }

  get photoURL(): AbstractControl {
    return this.form.get('photoURL');
  }


  ngOnInit() {
    this.user$ = this.authService.getUser$();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(wordRegex)]],
      photoURL: ['', [Validators.required]],
    });

    this.form.valueChanges
      .subscribe((value) => {
        console.log(value);
      });
  }

  getErrors(control: AbstractControl): string {
    const {errors} = control;

    if (!errors) {
      return '';
    }

    if (errors['required']) {
      return 'поле обязательно для заполнения';
    }

    if (errors['pattern'] && errors['pattern']['requiredPattern'] === wordRegex.toString()) {
      return `Имя может содержать только русские буквы`;
    }
  }

  onSubmit() {
    console.log('Точка 1 ');

    if (this.form.invalid) {
      return;
    }

    const name = this.form.value.name;


    const photoURL = this.form.value.photoURL ? this.form.value.photoURL : basePhoto;

    const info: IInfo = {
      photoURL: photoURL,
      name: name
    };


    this.addInfo.emit(info);

    this.infoService.addInfo(info)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.clearForm();
  }

  private clearForm() {
    this.form.reset();
  }

}
