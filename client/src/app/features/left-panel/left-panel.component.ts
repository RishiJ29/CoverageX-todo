import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-left-panel',
  imports: [CommonModule],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss'
})
export class LeftPanelComponent {

  @Input() taskDates: string[] = [];
  @Input() selectedDate: string | null = null;
  @Input() groupedDates: {
    past: string[];
    today: string | null;
    future: string[];
  } = { past: [], today: null, future: [] };

  @Output() search = new EventEmitter<string>();
  @Output() dateSelect = new EventEmitter<string | null>();
  @Output() addTask = new EventEmitter<void>();
  
  
  validationMessage: string | null = null;

   isPast(date: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0); 
    
    return inputDate < today; 
  }

  showValidationMessage(message: string) {
    this.validationMessage = message;
    // Clear the message after 3 seconds
    setTimeout(() => {
      this.validationMessage = null;
    }, 3000);
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  openAddModal() {
    this.addTask.emit();
  }

  selectDate(date: string) {
    // 1. Past Date Validation
    if (this.isPast(date)) {
      this.showValidationMessage('Cannot filter tasks by a date in the past.');
      return; // Stop selection
    }
    
    // 2. Proceed if validation passes
    this.validationMessage = null; // Clear any existing message
    this.selectedDate = date;
    this.dateSelect.emit(date);
  }

  isToday(date: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  }
}
