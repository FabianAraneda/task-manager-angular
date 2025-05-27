/**
 * Representa los datos del modal de confirmacion
 */
export interface IConfirmationData {
  /** Titulo del modal */
  title?: string;

  /** Mensaje del modal */
  message: string;

  /** Texto de btn 'Confirmar' */
  confirmText?: string;

  /** Texto de btn 'Cancelar' */
  cancelText?: string;

  /** Titulo de la tarea */
  taskTitle?: string;
}
