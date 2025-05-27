import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  taskTitle?: string;
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData
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
   */
  getTitle(): string {
    return this.data.title || 'Confirmar acción';
  }

  /**
   * Obtiene el texto del botón confirmar
   */
  getConfirmText(): string {
    return this.data.confirmText || 'Confirmar';
  }

  /**
   * Obtiene el texto del botón cancelar
   */
  getCancelText(): string {
    return this.data.cancelText || 'Cancelar';
  }
}