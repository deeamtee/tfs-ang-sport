import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IPurchase} from '../model/i-purchase';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

const digitRegex = /^\d*\.?\d+$/;

@Component({
  selector: 'tfs-add-train',
  templateUrl: './add-train.component.html',
  styleUrls: ['./add-train.component.css']
})
export class AddTrainComponent implements OnInit {
  @Output() addPurchase = new EventEmitter<IPurchase>();
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
      title: ['test', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      price: ['100', [Validators.min(10), Validators.max(10000), Validators.pattern(digitRegex)]],
      date: [''],
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

    const price = parseInt(this.form.value.price, 10);

    if (isNaN(price) || price <= 0) {
      return;
    }

    const date = this.form.value.date ? new Date(this.form.value.date) : new Date();

    const purchase: IPurchase = {
      title: this.form.value.title,
      price,
      date
    };

    if (this.form.value.comment) {
      purchase.comment = this.form.value.comment;
    }

    this.addPurchase.emit(purchase);
  }
}
