/**
 * Representa la estructura de una tarea
 */
export interface ITask {

    /** Id de la tarea */
    id: number;

    /** Titulo de la tarea */
    title: string;

    /** Id de la prioridad de la tarea {Alta / Media / Baja} */
    priority: number;

    /** Id del progreso de la tarea */
    progress: number;

    /** Fecha limite para la tarea */
    limitDate: Date;

    /** Descripcion de la tarea */
    description: string;
}