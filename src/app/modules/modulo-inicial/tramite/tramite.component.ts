import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ExcelRow } from '../../interface/ExcelRow.interface';
import { FileValidationService } from '../../services/file-validation.service';
const ITEMS_PER_PAGE_DEFAULT: number = 10;
const INITIAL:number = 0;
@Component({
  selector: 'app-tramite',
  templateUrl: './tramite.component.html',
  styleUrls: ['./tramite.component.scss']
})
export class TramiteComponent  {

  excelData: ExcelRow[] = [];
  pagedExcelData: ExcelRow[] = [];
  itemsPerPage: number = ITEMS_PER_PAGE_DEFAULT;
  p:any = INITIAL;

  selectedOption: boolean = false;
  botonDescargar: boolean = false;
  botonesCompletado: boolean = false;
  cargaIncompleta:boolean = false;

  cantidadVialidades: number = INITIAL;
  constructor(private toastr: ToastrService,private fileValidationService: FileValidationService) { }

  onChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'vialidad') {
      this.selectedOption = true;
      this.botonDescargar = true;

    } else if (selectElement.value === 'solvencia') {
      this.selectedOption = false;
      this.botonDescargar = false;
      this.botonesCompletado = false;

    }
    else {
      this.selectedOption = false;
      this.botonDescargar = false;
      this.botonesCompletado = false;

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
      this.cargaIncompleta = false;

      const filteredData = excelData.map((row: any, index: number) => {
        if (index === 0) return {};

        const newRow: any = {};

        const correlativoError = this.fileValidationService.validarCorrelativo(row[0], index);
        if (correlativoError) {
          this.fileValidationService.mostrarToastDeError(correlativoError);
          this.cargaIncompleta = true;
          newRow.hasError = true;
        }
        newRow.Correlativo = row[0];
        const nitError = this.fileValidationService.validarNit(row[1], index);
        if (nitError) {
          this.fileValidationService.mostrarToastDeError(nitError);
          this.cargaIncompleta = true;
          newRow.hasError = true;
        }
        newRow.NumeroDeNitDelEmpleado = row[1];
        const duiError = this.fileValidationService.validarDui(row[2], index);
        if (duiError) {
          this.fileValidationService.mostrarToastDeError(duiError);
          this.cargaIncompleta = true;
          newRow.hasError = true;
        }
        newRow.NumeroDeDuiDelEmpleado = row[2];
        const direccionErrors = this.fileValidationService.validarTexto(row[3], 'Direccion', index, true);
        if (direccionErrors) {
          this.fileValidationService.mostrarToastDeError(direccionErrors);
          this.cargaIncompleta = true;
          newRow.hasError = true;
        }
        newRow.DireccionDeResidencia = row[3];
        const nombresError = this.fileValidationService.validarTexto(row[4], 'Nombres', index, false);
        if (nombresError) {
          this.fileValidationService.mostrarToastDeError(nombresError);
          this.cargaIncompleta = true;
          newRow.hasError = true;
        }
        newRow.Nombres = row[4];
        const apellidosError = this.fileValidationService.validarTexto(row[5], 'Apellidos', index, false);
        if (apellidosError) {
          this.fileValidationService.mostrarToastDeError(apellidosError);
          this.cargaIncompleta = true;
          newRow.hasError = true;
        }
        newRow.Apellidos = row[5];
        this.selectedOption = false;
        return newRow;
      });
      if (!this.cargaIncompleta) {
        this.cargaIncompleta = false;
      }
      this.botonesCompletado = true;
      this.excelData = filteredData.slice(1);
      this.cantidadVialidades = this.excelData.length;
    };
    fileReader.readAsArrayBuffer(file);
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

  guardarExcel(){
    document.getElementById('archivo')?.click();
  }

  showPay(): void {
    if (this.cargaIncompleta) {
    this.toastr.error('¡Error!', "Pago rechazado, problemas en plantilla");
    return;
    }
    this.toastr.success('¡Éxito!', "Pago completado");
  }

// ! Paginacion
  setPage(page: number): void {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.excelData.length);
    this.pagedExcelData = this.excelData.slice(startIndex, endIndex);
  }

  pageChanged(event: any): void {
    this.p = event;
    this.setPage(this.p);
  }

}
