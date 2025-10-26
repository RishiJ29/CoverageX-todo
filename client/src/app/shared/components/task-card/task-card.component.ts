import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {

  @Input() task!: Task;
  @Output() toggleComplete = new EventEmitter<Task>();

  /** Emit toggle completion */
  onToggleComplete() {
    this.toggleComplete.emit(this.task);
  }
}
