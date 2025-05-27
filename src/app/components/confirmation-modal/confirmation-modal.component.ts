import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IConfirmationData } from 'src/app/interface/confirmation-data.interface';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

  /**
   * Referencia al modal de angular material
   */
  public dialogRef = inject(MatDialogRef<ConfirmationModalComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IConfirmationData
  ) {}

  /**
   * Cierra el modal sin confirmar
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Confirma la acción y cierra el modal
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Obtiene el título del modal
   * 
   * @returns Titulo del modal
   */
  getTitle(): string {
    return this.data.title || 'Confirmar acción';
  }

  /**
   * Obtiene el texto del botón confirmar
   * 
   * @returns Texto del btn
   */
  getConfirmText(): string {
    return this.data.confirmText || 'Confirmar';
  }

  /**
   * Obtiene el texto del botón cancelar
   * 
   * @returns Texto del btn
   */
  getCancelText(): string {
    return this.data.cancelText || 'Cancelar';
  }
}