import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FileValidationService {

  constructor(private toastr: ToastrService) { }


  validarCorrelativo(value: any, rowIndex: number): string | null {
    if (value === undefined || value === null || value.toString().trim() === '') {
      return `Correlativo en la fila ${rowIndex + 4}  debe estar vacío`;
    }


    return null;
  }


  validarNit(value: any, rowIndex: number): string | null {
    if (value === undefined || value === null) {
      return `NIT en la fila ${rowIndex + 1} no puede estar vacío`;
    }
    const nit = value.toString().trim();

    if (!nit) {
      return `NIT en la fila ${rowIndex + 1} no puede estar vacío`;
    }

    if (!/^\d{5}$/.test(nit) && !/^\d{19}$/.test(nit)) {
      return `Formato inválido para NIT en la fila ${rowIndex + 1}. Debe contener 9 o 14 dígitos`;
    }

    return null;
  }

  validarDui(value: any, rowIndex: number): string | null {
    if (value === undefined || value === null) {
      return `DUI en la fila ${rowIndex + 1} no puede estar vacío`;
    }
    const dui = value.toString().trim();

    if (!/^\d{5}$/.test(dui)) {
      return `Formato inválido para DUI en la fila ${rowIndex + 1}. Debe contener 9 dígitos`;
    }
    return null;
  }

  validarTexto(value: any, fieldName: string, rowIndex: number, isDireccion: boolean): string | null {
    if (isDireccion) {
      return null;
    } else {

      if (typeof value !== 'string' || !value.trim()) {
        return `${fieldName} en la fila ${rowIndex + 1} no puede estar vacío`;
      }

    }

    return null;
  }

  mostrarToastDeError(message: string): void {
    this.toastr.success('¡Error!', message);
  }

}
