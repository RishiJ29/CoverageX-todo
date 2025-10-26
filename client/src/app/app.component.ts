import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftPanelComponent } from './features/left-panel/left-panel.component';
import { TaskListComponent } from './features/task-list/task-list.component';
import { Task } from './core/models/task.model';
import { TaskService } from './core/services/task.service';
import { TaskCardComponent } from "./shared/components/task-card/task-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [LeftPanelComponent, TaskListComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  tasks = signal<Task[]>([]);
  selectedDate = signal<string | null>(null);
  searchQuery = signal<string>('');

  constructor(private taskService: TaskService) {}
 
  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
   this.taskService.fetchTasks().subscribe({
    next: tasks => this.tasks.set(tasks),
    error: err => console.error('Failed to load tasks', err)
   });
  }

  get groupedTaskDates() {
    const allTasks = this.tasks();
    const today = new Date().toISOString().split('T')[0];

    const uniqueDates = [...new Set(
      this.tasks()
        .map(t => t.dueDate)
        .filter((d): d is string => !!d)
    )].sort((a, b) => a.localeCompare(b));

    const past = uniqueDates.filter(date => date < today);
    const future = uniqueDates.filter(date => date > today);
    const isTodayIncluded = uniqueDates.includes(today);

   return { past, today: isTodayIncluded ? today : null, future };
  }


  onDateSelect(date: string | null) {
    this.selectedDate.set(date);
  }

  onTaskAction() {
   this.loadTasks(); // ✅ Forces a full reload, updating the `tasks` signal
  }

  onTaskActionComplete() {
    this.loadTasks(); // ✅ Forces a full reload of all data
  }

  @ViewChild('taskList') taskListComponent!: TaskListComponent;

  taskListModalOpen() {
    this.taskListComponent.showModal.set(true);
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  get tasksToShow(): Task[] {
   const tasks = this.tasks();
   const query = this.searchQuery().toLowerCase();

   let filteredByDateOrCompletion: Task[];

   if (this.selectedDate()) {
     // Show *all* tasks for the selected date (completed + incomplete)
     filteredByDateOrCompletion = tasks.filter(t => t.dueDate === this.selectedDate());
   } else {
     // Show only incomplete tasks across all dates
     filteredByDateOrCompletion = tasks.filter(t => !t.completed);
   }

   if (query) {
     return filteredByDateOrCompletion.filter(t =>
       t.title.toLowerCase().includes(query) ||
       (t.description && t.description.toLowerCase().includes(query))
     );
   } else {
     return filteredByDateOrCompletion;
   }
  }

}
