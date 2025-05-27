import { ITask } from "./task.interface";

/**
 * Representa los datos del modal para crear/editar tareas
 */
export interface ITaskDialogData {
  /** Accion a ejecutar en el modal */
  mode: "create" | "edit";

  /** Datos de la tarea */
  task: ITask | null;
}
