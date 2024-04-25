import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tramite',
  templateUrl: './tramite.component.html',
  styleUrls: ['./tramite.component.scss']
})
export class TramiteComponent implements OnInit {

  constructor(private toastr: ToastrService) {}
  showSuccess() {
    this.toastr.success('¡Éxito!', 'Mensaje de éxito');
  }

  ngOnInit(): void {
  }

}
