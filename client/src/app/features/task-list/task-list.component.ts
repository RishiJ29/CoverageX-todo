import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from "../../shared/components/task-card/task-card.component";
import { TaskModalComponent } from '../../shared/components/task-modal/task-modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent, TaskModalComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'] // fixed
})
export class TaskListComponent {

  showModal = signal(false);
  loading = signal(false);

  /** Directly receive tasks to display from parent */
  @Input() tasks: Task[] = [];
  @Input() selectedDate: string | null = null;

  @Output() taskCompleted = new EventEmitter<void>();
  @Output() taskActionComplete = new EventEmitter<void>();

  currentPage: number = 1;
  tasksPerPage: number = 5;

  constructor(private taskService: TaskService) {}

  /** Filter tasks locally if needed (optional) */
  get incompleteTasks(): Task[] {
    return this.tasks.filter(t => !t.completed);
  }

  /** Toggle task completion */
  toggleComplete(task: Task) {
  this.taskService.completeTask(task.id).subscribe({
    next: updatedTask => {
      this.taskCompleted.emit();
      this.taskActionComplete.emit();
    },
    error: err => console.error('Error completing task', err)
  });
}

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  // task-list.component.ts

  saveTask(taskData: Partial<Task>) {
    this.closeModal(); // Close first for better UX

    const observable = (taskData as Task).id
      ? this.taskService.updateTask((taskData as Task).id!, taskData)
      : this.taskService.createTask(taskData);

    observable.subscribe({
      next: () => {
        this.taskActionComplete.emit(); // ✅ Signal parent to reload after create/update
      },
      error: err => console.error('Error saving task', err)
    });
  }

  /** Pagination */
  paginatedTasks(): Task[] {
    const start = (this.currentPage - 1) * this.tasksPerPage;
    const end = start + this.tasksPerPage;
    return this.tasks.slice(start, end);
  }

  totalPages(): number {
    return Math.ceil(this.tasks.length / this.tasksPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
