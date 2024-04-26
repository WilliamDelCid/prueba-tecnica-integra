import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tramite',
  templateUrl: './tramite.component.html',
  styleUrls: ['./tramite.component.scss']
})
export class TramiteComponent implements OnInit {
  excelData: any[] = [];
  pagedExcelData: any[] = [];
  itemsPerPage: number = 10;
  p:any = 0;

  selectedOption: boolean = false;
  botonDescargar: boolean = false;
  isSuccess: boolean = false;
  botonesCompletado: boolean = false;
  cantidadVialidades: number = 0;
  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  onChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'vialidad') {
      this.selectedOption = true;
      this.botonDescargar = true;


    } else if (selectElement.value === 'solvencia') {
      this.selectedOption = false;
      this.botonDescargar = false;

    }
    else {
      this.selectedOption = false;
      this.botonDescargar = false;
    }
  }


  validateFile(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const fileName = file.name;
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext !== 'xlsx') {
      this.toastr.error('Por favor, seleccione un archivo XLSX válido.', 'Error');
      event.target.value = '';
    } else {
      this.readFile(file);
      event.target.value = '';
    }
  }

  readFile(file: any): void {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const filteredData = excelData.map((row: any, index: number) => {
        if (index === 0) return {};

        const newRow: any = {};

        const correlativoError = this.validarCorrelativo(row[0], index);
        if (correlativoError) {
          this.mostrarToastDeError(correlativoError);
        }
        newRow.Correlativo = row[0];
        const nitError = this.validarNit(row[1], index);
        if (nitError) {
          this.mostrarToastDeError(nitError);
        }
        newRow.NumeroDeNitDelEmpleado = row[1];
        const duiError = this.validarDui(row[2], index);
        if (duiError) {
          this.mostrarToastDeError(duiError);
        }
        newRow.NumeroDeDuiDelEmpleado = row[2];
        const direccionErrors = this.validarTexto(row[3], 'Direccion', index, true);
        if (direccionErrors) {
          this.mostrarToastDeError(direccionErrors);
        }
        newRow.DireccionDeResidencia = row[3];
        const nombresError = this.validarTexto(row[4], 'Nombres', index, false);
        if (nombresError) {
          this.mostrarToastDeError(nombresError);
        }
        newRow.Nombres = row[4];
        const apellidosError = this.validarTexto(row[5], 'Apellidos', index, false);
        if (apellidosError) {
          this.mostrarToastDeError(apellidosError);
        }
        newRow.Apellidos = row[5];
        this.selectedOption = false;
        return newRow;
      });
      this.botonesCompletado = true;
      this.excelData = filteredData.slice(1);
      this.cantidadVialidades = this.excelData.length;
    };
    fileReader.readAsArrayBuffer(file);
  }

  setPage(page: number): void {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.excelData.length);
    this.pagedExcelData = this.excelData.slice(startIndex, endIndex);
  }

  pageChanged(event: any): void {
    this.p = event;
    this.setPage(this.p);
  }


  exportToExcel(): void {
    const headers = ['Correlativo', 'NumeroDeNitDelEmpleado', 'NumeroDeDuiDelEmpleado', 'DirecciónDeResidencia', 'Nombres', 'Apellidos'];

    const workbook = XLSX.utils.book_new();
    const worksheetData = [headers];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const maxRows = 15;

    const columnWidths = headers.map(header => ({ wch: header.length * 1.2 }));
    worksheet['!cols'] = columnWidths;
    worksheet['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxRows, c: headers.length - 1 } }) };
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla');
    workbook.Props = {
      Title: 'Archivo Generado por Angular',
      Author: 'Prueba Front end Angular',
      Comments: 'Este archivo solo puede ser cargado en Angular.'
    };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, 'plantillaTramite.xlsx');
  }


  validarCorrelativo(value: any, rowIndex: number): string | null {
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

  guardarExcel(){
    document.getElementById('archivo')?.click();
  }

}
