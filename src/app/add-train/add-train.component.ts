import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ITraining} from '../model/i-training';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

const digitRegex = /^\d*-?\d+$/;

@Component({
  selector: 'tfs-add-train',
  templateUrl: './add-train.component.html',
  styleUrls: ['./add-train.component.css']
})
export class AddTrainComponent implements OnInit {
  @Output() addTraining = new EventEmitter<ITraining>();
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  getErrors(control: AbstractControl): string {
    const {errors} = control;

    if (!errors) {
      return '';
    }

    if (errors['required']) {
      return 'поле обязательно для заполнения';
    }

    if (errors['min']) {
      return `минимальное значение – ${errors['min']['min']}`;
    }

    if (errors['max']) {
      return `максимальное значение – ${errors['max']['max']}`;
    }

    if (errors['minlength']) {
      return `минимальная длина — ${errors['minlength']['requiredLength']}`;
    }

    if (errors['maxlength']) {
      return `максимальная длина — ${errors['maxlength']['requiredLength']}`;
    }

    if (errors['pattern'] && errors['pattern']['requiredPattern'] === digitRegex.toString()) {
      return `разрешены лишь цифры`;
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      number: ['', [Validators.min(1), Validators.max(100), Validators.pattern(digitRegex)]],
      repeat: ['',[Validators.min(1), Validators.max(12)]],
      comment: ['']
    });

    this.form.valueChanges
      .subscribe((value) => {
        console.log(value);
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const number = parseInt(this.form.value.number, 10);

    if (isNaN(number) || number <= 0) {
      return;
    }

    const repeat = this.form.value.repeat;
    // const repeat = this.form.value.repeat ? new Date(this.form.value.repeat) : new Date();

    const training: ITraining = {
      title: this.form.value.title,
      number: number,
      repeat: repeat
    };

    if (this.form.value.comment) {
      training.comment = this.form.value.comment;
    }

    this.addTraining.emit(training);
  }
}
