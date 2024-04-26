import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  constructor(private renderer: Renderer2) {}

  @Input() bgColor: string = 'bg-principal';
  @Input() leyenda: string = '';
  @Input() form: string = '';
  @Input() type: string = 'button';
  @Input() icon: string = 'assets/svg/filter-icon.svg';
  @Input() disabled = false;
  @Output() buttonClick = new EventEmitter<void>();

  handleAddButtonClick() {
    this.buttonClick.emit();
  }
}
