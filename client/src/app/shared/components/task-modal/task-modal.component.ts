import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// --- CUSTOM VALIDATORS ---

// Validator 1: Prevents selecting a past date
const pastDateValidator: ValidatorFn = (control: AbstractControl) => {
  const dateValue = control.value; // ISO string YYYY-MM-DD
  if (!dateValue) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for date-only comparison
  
  const inputDate = new Date(dateValue);
  inputDate.setHours(0, 0, 0, 0); // Set input date to midnight

  return inputDate < today ? { pastDate: true } : null; // Validation failed (past date)
};

// Validator 2: Ensures time is present if date is present
const dateAndTimeValidator: ValidatorFn = (group: AbstractControl): { [key: string]: any } | null => {
  const dueDateControl = group.get('dueDate');
  const dueTimeControl = group.get('dueTime');
  
  // If a date is set AND a time is missing, return an error
  if (dueDateControl?.value && !dueTimeControl?.value) {
    return { timeRequired: true };
  }
  // If date is missing, or both date and time are present, validation passes
  return null;
};

@Component({
  selector: 'app-task-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})



export class TaskModalComponent {

  @Input() task?: Task;
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required]], // ✅ Title is required
      description: [''],
      dueDate: ['', [pastDateValidator]], // ✅ Add past date validator
      dueTime: [''],
      completed: [false]
    }, { validators: dateAndTimeValidator }); // ✅ Add group validator
  }
  
  // Helper to check validation status for displaying error messages
  isInvalidAndTouched(controlName: string): boolean | undefined {
    const control = this.form.get(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  ngOnChanges(): void {
    if (this.task) {
      // Populate form when editing (ensure compatibility with potentially nullable fields)
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        dueDate: this.task.dueDate || '',
        dueTime: this.task.dueTime || '',
        completed: this.task.completed
      });
    } else {
      // Clear form when switching to create mode
      this.form.reset({ completed: false });
    }
    // Re-check validators on changes (important for edit mode)
    this.form.updateValueAndValidity();
  }

  onSave(): void {
    // Mark all controls as touched to display errors immediately on save attempt
    this.form.markAllAsTouched(); 
    
    if (this.form.valid) {
      // Ensure only valid data is sent
      this.save.emit(this.form.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.form.reset({ completed: false }); // Reset form on cancel
  }
}
