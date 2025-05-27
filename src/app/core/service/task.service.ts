import { Injectable } from "@angular/core";
import { ITask } from "src/app/interface/task.interface";

/**
 * Servicio para manejar las peticiones de tareas
 * 
 * Este servicio proporciona los metodos para 
 * operaciones CRUD de tareas usando localStorage
 */
@Injectable({
    providedIn: 'root'
})
export class TaskService {

    /** Key para el objeto en localstorage */
    private readonly STORAGE_KEY = 'tasks';

    constructor() {
        this.initializeStorage();
    }

    /**
     * Inicializa el localStorage con un array vacio si no existe
     */
    private initializeStorage(): void {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
        }
    }

    /**
     * Obtiene todas las tareas del localStorage
     * @returns Array de tareas
     */
    getAll(): ITask[] {
        try {
            const tasks = localStorage.getItem(this.STORAGE_KEY);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            return [];
        }
    }

    /**
     * Obtiene una tarea por su ID
     * @param id Identificador de la tarea
     * @returns La tarea encontrada o undefined
     */
    getById(id: number): ITask | undefined {
        const tasks = this.getAll();
        return tasks.find(task => task.id === id);
    }

    /**
     * Crea una nueva tarea
     * @param task Argumento con los datos de la tarea
     * @returns La tarea creada con su ID asignado
     */
    save(task: ITask): ITask {
        try {
            const tasks = this.getAll();
            
            // Si no tiene ID, es una tarea nueva
            if (!task.id) {
                task.id = this.generateNewId(tasks);
                tasks.push(task);
            } else {
                // Si tiene ID, es una actualización
                const index = tasks.findIndex(t => t.id === task.id);
                if (index !== -1) {
                    tasks[index] = { ...task };
                } else {
                    // Si no existe, la agrega como nueva
                    tasks.push(task);
                }
            }
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
            return task;
        } catch (error) {
            console.error('Error al guardar la tarea:', error);
            throw new Error('No se pudo guardar la tarea');
        }
    }

    /**
     * Actualiza una tarea existente
     * @param task Tarea con los datos actualizados
     * @returns La tarea actualizada o null si no existe
     */
    update(task: ITask): ITask | null {
        try {
            const tasks = this.getAll();
            const index = tasks.findIndex(t => t.id === task.id);
            
            if (index !== -1) {
                tasks[index] = { ...task };
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
                return task;
            }
            
            return null;
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            throw new Error('No se pudo actualizar la tarea');
        }
    }

    /**
     * Elimina una tarea por Id
     * @param id Identificador de la tarea
     * @returns true si se eliminó, false si no se encontró
     */
    delete(id: number): boolean {
        try {
            const tasks = this.getAll();
            const initialLength = tasks.length;
            const filteredTasks = tasks.filter(task => task.id !== id);
            
            if (filteredTasks.length < initialLength) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTasks));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            throw new Error('No se pudo eliminar la tarea');
        }
    }

    /**
     * Genera un nuevo ID único para las tareas
     * @param tasks Array actual de tareas
     * @returns Nuevo ID único
     */
    private generateNewId(tasks: ITask[]): number {
        if (tasks.length === 0) {
            return 1;
        }
        
        const maxId = Math.max(...tasks.map(task => task.id));
        return maxId + 1;
    }

    /**
     * Verifica si existe una tarea con el titulo dado
     * @param title Titulo a verificar
     * @param excludeId ID a excluir de la verificación (para actualizaciones)
     * @returns true si existe, false si no
     */
    existsByTitle(title: string, excludeId?: number): boolean {
        const tasks = this.getAll();
        return tasks.some(task => 
            task.title.toLowerCase() === title.toLowerCase() && 
            task.id !== excludeId
        );
    }

    /**
     * Obtiene el conteo total de tareas
     * @returns Número total de tareas
     */
    getCount(): number {
        return this.getAll().length;
    }
}