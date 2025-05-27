import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITask } from 'src/app/interface/task.interface';
import { TaskService } from 'src/app/core/service/task.service';
import { IPriority } from 'src/app/interface/priority.interface';
import { IProgress } from 'src/app/interface/progress.interface';

export interface DialogData {
  mode: 'create' | 'edit';
  task: ITask | null;
}

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnInit {
  
  isEditMode: boolean = false;
  taskForm: FormGroup;
  
  // Control para detectar cambios en el formulario
  hasChanges: boolean = false;
  private initialFormValue: any = null;
  
  // Fecha mínima para el datepicker
  minDateObj: Date = new Date();
  
  // Opciones para los select
  priorityOptions: IPriority[] = [
    { id: 1, description: 'Alta' },
    { id: 2, description: 'Media' },
    { id: 3, description: 'Baja' }
  ];
  
  progressOptions: IProgress[] = [
    { id: 1, description: 'Pendiente' },
    { id: 2, description: 'En Progreso' },
    { id: 3, description: 'Completada' }
  ];

  constructor(
    public dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    
    // Establecer fecha mínima (hoy)
    this.minDateObj = new Date();
    
    if (this.isEditMode && this.data.task) {
      this.populateForm(this.data.task);
      // Guardar el valor inicial para detectar cambios
      this.saveInitialFormValue();
      // Suscribirse a cambios del formulario
      this.subscribeToFormChanges();
    }
    
    console.log('Modal abierto en modo:', this.data.mode);
    console.log('Datos de la tarea:', this.data.task);
  }

  /**
   * Crea el formulario reactivo
   */
  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      priority: [1, [Validators.required]],
      progress: [1, [Validators.required]],
      limitDate: ['', [Validators.required]]
    });
  }

  /**
   * Llena el formulario con los datos de la tarea a editar
   */
  private populateForm(task: ITask): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      progress: task.progress,
      limitDate: new Date(task.limitDate) // Usar objeto Date directamente
    });
  }

  /**
   * Guarda el valor inicial del formulario para detectar cambios
   */
  private saveInitialFormValue(): void {
    // Convertir fecha a string para comparación consistente
    const formValue = { ...this.taskForm.value };
    if (formValue.limitDate instanceof Date) {
      formValue.limitDate = formValue.limitDate.toISOString();
    }
    this.initialFormValue = JSON.stringify(formValue);
  }

  /**
   * Se suscribe a los cambios del formulario para detectar modificaciones
   */
  private subscribeToFormChanges(): void {
    this.taskForm.valueChanges.subscribe(() => {
      if (this.isEditMode && this.initialFormValue) {
        this.checkForChanges();
      }
    });
  }

  /**
   * Verifica si el formulario ha sido modificado
   */
  private checkForChanges(): void {
    const currentValue = { ...this.taskForm.value };
    // Convertir fecha a string para comparación consistente
    if (currentValue.limitDate instanceof Date) {
      currentValue.limitDate = currentValue.limitDate.toISOString();
    }
    
    const currentValueString = JSON.stringify(currentValue);
    this.hasChanges = this.initialFormValue !== currentValueString;
  }

  /**
   * Cierra el modal sin guardar
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Guarda la tarea y cierra el modal
   */
  onSave(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      
      const taskData: ITask = {
        id: this.isEditMode ? this.data.task!.id : 0, // 0 para nuevas tareas
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        progress: formValue.progress,
        limitDate: formValue.limitDate // Ya es un objeto Date del datepicker
      };

      try {
        // Guardar la tarea usando el servicio
        const savedTask = this.taskService.save(taskData);
        
        // Cerrar el modal con éxito
        this.dialogRef.close({ 
          saved: true, 
          mode: this.data.mode,
          task: savedTask 
        });
        
        console.log('Tarea guardada exitosamente:', savedTask);
      } catch (error) {
        console.error('Error al guardar la tarea:', error);
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.taskForm.markAllAsTouched();
      console.log('Formulario inválido');
    }
  }

  /**
   * Verifica si el botón de guardar debe estar habilitado
   */
  isSaveButtonEnabled(): boolean {
    if (!this.taskForm.valid) {
      return false;
    }
    
    // Si es modo crear, solo verificar que sea válido
    if (!this.isEditMode) {
      return true;
    }
    
    // Si es modo editar, verificar que sea válido Y que haya cambios
    return this.hasChanges;
  }
  getModalTitle(): string {
    return this.isEditMode ? 'Editar Tarea' : 'Crear Nueva Tarea';
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasError(field: string, errorType: string): boolean {
    return this.taskForm.get(field)?.hasError(errorType) && this.taskForm.get(field)?.touched || false;
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(field: string): string {
    const control = this.taskForm.get(field);
    
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${this.getFieldName(field)} es requerido`;
      if (control.errors['minlength']) return `${this.getFieldName(field)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['maxlength']) return `${this.getFieldName(field)} no puede exceder ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    
    return '';
  }

  /**
   * Obtiene el nombre amigable del campo
   */
  private getFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      title: 'El título',
      description: 'La descripción',
      priority: 'La prioridad',
      progress: 'El progreso',
      limitDate: 'La fecha límite'
    };
    
    return fieldNames[field] || field;
  }
}