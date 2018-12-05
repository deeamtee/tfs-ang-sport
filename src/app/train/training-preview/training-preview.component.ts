import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPurchase} from '../../model/i-purchase';

@Component({
  selector: 'tfs-training-preview',
  templateUrl: './training-preview.component.html',
  styleUrls: ['./training-preview.component.css']
})
export class TrainingPreviewComponent implements OnInit {

  @Input() purchase: IPurchase;
  @Input() isOpen: boolean;
  @Output() previewClick = new EventEmitter<void>();
  @Output() previewDelete = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.previewClick.emit();
  }

  onDeleteClick() {
    this.previewDelete.emit();
  }
}
