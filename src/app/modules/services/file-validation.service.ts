import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FileValidationService {

  constructor(private toastr: ToastrService) { }


  validarCorrelativo(value: any, rowIndex: number): string | null {
    if (value === undefined || value === null || value.toString().trim() === '') {
      return `Correlativo en la fila ${rowIndex + 1} no debe estar vacío`;
    }

    if (!value || isNaN(value)) {
      return `Correlativo en la fila ${rowIndex + 1} debe contener solo números`;
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

    if (!/^\d{9}$/.test(nit) && !/^\d{14}$/.test(nit)) {
      return `Formato inválido para NIT en la fila ${rowIndex + 1}. Debe contener 9 o 14 dígitos`;
    }

    return null;
  }

  validarDui(value: any, rowIndex: number): string | null {
    if (value === undefined || value === null) {
      return `DUI en la fila ${rowIndex + 1} no puede estar vacío`;
    }
    const dui = value.toString().trim();
    if (!dui) {
      return `DUI en la fila ${rowIndex + 1} no puede estar vacío`;
    }
    if (!/^\d{9}$/.test(dui)) {
      return `Formato inválido para DUI en la fila ${rowIndex + 1}. Debe contener 9 dígitos`;
    }
    return null;
  }

  validarTexto(value: any, fieldName: string, rowIndex: number, isDireccion: boolean): string | null {
    if (isDireccion) {
      return null;
    } else {
      if (!value || !isNaN(value)) {
        return `${fieldName} en la fila ${rowIndex + 1} no debe contener números`;
      }
      if (typeof value !== 'string' || !value.trim()) {
        return `${fieldName} en la fila ${rowIndex + 1} no puede estar vacío`;
      }
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
        return `${fieldName} en la fila ${rowIndex + 1} no puede contener números ni caracteres especiales`;
      }
    }

    return null;
  }

  mostrarToastDeError(message: string): void {
    this.toastr.error('¡Error!', message);
  }

}
