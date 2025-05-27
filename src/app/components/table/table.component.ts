import { Component, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ColumnEnum } from "src/app/core/enum/table.enum";
import { TaskService } from "src/app/core/service/task.service";
import { ITask } from "src/app/interface/task.interface";
import { TaskModalComponent } from "src/app/components/task-modal/task-modal.component"; // Ajusta la ruta
import { ModalMode } from "src/app/core/enum/modal.enum";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent {
  /**
   * Fuente de datos de la tabla
   */
  dataSource = new MatTableDataSource<ITask>([]);

  /**
   * Columnas de la tabla
   */
  displayedColumns = [
    ColumnEnum.id,
    ColumnEnum.title,
    ColumnEnum.description,
    ColumnEnum.priority,
    ColumnEnum.limitDate,
    ColumnEnum.status,
    ColumnEnum.actions,
  ];

  /**
   * Servicio de tareas
   */
  private taskService = inject(TaskService);

  /**
   * Modal de angular material
   */
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadTasks();
    this.loadInitialData();
  }

  /**
   * Carga todas las tareas desde el servicio
   */
  loadTasks(): void {
    const tasks = this.taskService.getAll();
    this.dataSource.data = tasks;
  }

  /**
   * Carga datos iniciales para testing (solo si no hay tareas)
   * Puedes eliminar este método cuando tengas datos reales
   */
  loadInitialData(): void {
    if (this.dataSource.data.length === 0) {
      const sampleTasks: ITask[] = [
        {
          id: 0,
          title: "Completar proyecto Angular",
          priority: 1,
          progress: 2,
          limitDate: new Date("2025-06-15"),
          description: "Se debe crear un administrador de tareas",
        },
        {
          id: 0,
          title: "Revisar documentación",
          priority: 2,
          progress: 1,
          limitDate: new Date("2025-06-01"),
          description: "Se debe documentar el codigo",
        },
        {
          id: 0,
          title: "Testing de componentes",
          priority: 3,
          progress: 3,
          limitDate: new Date("2025-05-30"),
          description: "Se deben realizar los test correspondientes",
        },
      ];

      sampleTasks.forEach((task) => {
        this.taskService.save(task);
      });

      this.loadTasks();
    }
  }

  /**
   * Abre el modal para crear una nueva tarea
   */
  addNewTask(): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: "700px",
      height: "auto",
      disableClose: false,
      data: {
        mode: ModalMode.create,
        task: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.saved) {
          this.loadTasks();
        }
      }
    });
  }

  /**
   * Elimina una tarea por ID
   * @param id ID de la tarea a eliminar
   */
  deleteTask(id: number): void {
    const task = this.taskService.getById(id);
    const taskTitle = task ? task.title : `ID ${id}`;

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "450px",
      disableClose: true,
      data: {
        title: "¿Eliminar tarea?",
        message: `¿Está seguro que desea eliminar la tarea "${taskTitle}"?`,
        confirmText: "Eliminar",
        cancelText: "Cancelar",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== true) {
        return;
      }
      try {
        const deleted = this.taskService.delete(id);
        if (deleted) {
          this.loadTasks();
        }
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    });
  }

  /**
   * Abre el modal para editar una tarea
   * @param id ID de la tarea
   */
  editTask(id: number): void {
    const task = this.taskService.getById(id);

    if (!task) {
      return;
    }

    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: "700px",
      height: "auto",
      disableClose: false,
      data: {
        mode: ModalMode.edit,
        task: task,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.saved) {
        this.loadTasks();
      }
    });
  }

  /**
   * Obtiene el conteo total de tareas
   *
   * @returns Total de tareas
   */
  getTaskCount(): number {
    return this.taskService.getCount();
  }

  /**
   * Refresca los datos desde localStorage
   */
  refreshData(): void {
    this.loadTasks();
  }

  /**
   * Obtiene el texto de la prioridad
   *
   * @param priority Id de la prioridad
   * @returns Nombre de la prioridad
   */
  getPriorityText(priority: number): string {
    switch (priority) {
      case 1:
        return "Alta";
      case 2:
        return "Media";
      case 3:
        return "Baja";
      default:
        return "Sin definir";
    }
  }

  /**
   * Obtiene la clase CSS para la prioridad
   *
   * @param priority Id de la prioridad
   * @returns Clase para la prioridad
   */
  getPriorityClass(priority: number): string {
    switch (priority) {
      case 1:
        return "priority-high";
      case 2:
        return "priority-medium";
      case 3:
        return "priority-low";
      default:
        return "priority-undefined";
    }
  }

  /**
   * Obtiene el texto del estado/progreso
   *
   * @param progress Id del progreso
   * @returns Nombre del progreso
   */
  getStatusText(progress: number): string {
    switch (progress) {
      case 1:
        return "Pendiente";
      case 2:
        return "En Progreso";
      case 3:
        return "Completada";
      default:
        return "Sin definir";
    }
  }

  /**
   * Obtiene la clase CSS para el estado
   *
   * @param progress Id del progreso
   * @returns Clase para el progreso
   */
  getStatusClass(progress: number): string {
    switch (progress) {
      case 1:
        return "status-pending";
      case 2:
        return "status-progress";
      case 3:
        return "status-completed";
      default:
        return "status-undefined";
    }
  }

  /**
   * Obtiene la clase CSS para la fecha límite
   *
   * @param limitDate Fecha limite
   * @returns Clase para la fecha limite
   */
  getDateClass(limitDate: Date): string {
    const today = new Date();
    const limit = new Date(limitDate);
    const diffDays = Math.ceil(
      (limit.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays < 0) return "date-overdue";
    if (diffDays <= 3) return "date-urgent";
    if (diffDays <= 7) return "date-warning";
    return "date-normal";
  }
}
