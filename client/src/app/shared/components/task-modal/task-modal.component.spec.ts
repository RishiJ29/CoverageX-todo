import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskModalComponent } from './task-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('TaskModalComponent', () => {
  let component: TaskModalComponent;
  let fixture: ComponentFixture<TaskModalComponent>;
  let saveSpy: jasmine.Spy;

  // Define mock dates for consistent testing
  const TODAY_STRING = '2025-10-26';
  const FUTURE_DATE = '2025-10-27';
  const PAST_DATE = '2025-10-25';

  beforeAll(() => {
    // Mock the Date object to control 'today' for the pastDateValidator
    jasmine.clock().install();
    const baseTime = new Date(TODAY_STRING);
    jasmine.clock().mockDate(baseTime);
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // You must import ReactiveFormsModule to test Reactive Forms
      imports: [CommonModule, ReactiveFormsModule, TaskModalComponent],
      // Provide FormBuilder since it's injected in the component constructor
      providers: [FormBuilder],
    }).compileComponents();
    
    fixture = TestBed.createComponent(TaskModalComponent);
    component = fixture.componentInstance;
    
    // Set up a spy on the save output emitter
    saveSpy = spyOn(component.save, 'emit');
    
    fixture.detectChanges(); // Initialize the component and form
  });

  // --- Test Suite for Required Fields and Custom Validators ---
  describe('Form Validation', () => {

    // 1. Title Required Validation
    it('should be invalid when title is empty', () => {
      const titleControl = component.form.get('title');
      titleControl?.setValue('');
      
      // The control should be invalid and have the 'required' error
      expect(titleControl?.valid).toBeFalse();
      expect(titleControl?.errors?.['required']).toBeTrue();
    });

    // 2. Past Date Validation (Custom Validator)
    it('should show pastDate error when dueDate is in the past', () => {
      const dueDateControl = component.form.get('dueDate');
      dueDateControl?.setValue(PAST_DATE);
      
      // The control should be invalid and have the 'pastDate' error
      expect(dueDateControl?.valid).toBeFalse();
      expect(dueDateControl?.errors?.['pastDate']).toBeTrue();
    });

    it('should be valid when dueDate is today or in the future', () => {
      const dueDateControl = component.form.get('dueDate');
      
      dueDateControl?.setValue(FUTURE_DATE);
      expect(dueDateControl?.valid).toBeTrue();
      
      dueDateControl?.setValue(TODAY_STRING);
      expect(dueDateControl?.valid).toBeTrue();
    });

    // 3. Date/Time Dependency Validation (Group Validator)
    it('should show timeRequired error when dueDate is present but dueTime is missing', () => {
      component.form.get('title')?.setValue('Valid Title'); // Must be valid for the form to check group errors
      component.form.get('dueDate')?.setValue(FUTURE_DATE);
      component.form.get('dueTime')?.setValue('');

      // The form itself should be invalid because of the group validator
      expect(component.form.valid).toBeFalse();
      // Check for the specific error key set by the dateAndTimeValidator
      expect(component.form.errors?.['timeRequired']).toBeTrue();
    });
    
    it('should be valid when both dueDate and dueTime are set', () => {
      component.form.get('title')?.setValue('Valid Title');
      component.form.get('dueDate')?.setValue(FUTURE_DATE);
      component.form.get('dueTime')?.setValue('10:00');

      expect(component.form.valid).toBeTrue();
      expect(component.form.errors).toBeNull(); // No group errors
    });

    it('should be valid when both dueDate and dueTime are empty', () => {
      component.form.get('title')?.setValue('Valid Title');
      component.form.get('dueDate')?.setValue('');
      component.form.get('dueTime')?.setValue('');

      expect(component.form.valid).toBeTrue();
      expect(component.form.errors).toBeNull();
    });
  });

  // --- Test Suite for onSave() Emission Logic ---
  describe('onSave() emission', () => {
    it('should emit the form value when the form is valid', () => {
      // Set the form to a valid state
      component.form.patchValue({
        title: 'Complete Project Report',
        dueDate: FUTURE_DATE,
        dueTime: '15:00'
      });
      
      component.onSave();

      // The save event should have been emitted
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should NOT emit the form value when the form is invalid', () => {
      // Set the form to an invalid state (missing title)
      component.form.patchValue({
        title: '',
        dueDate: FUTURE_DATE,
        dueTime: '15:00'
      });
      
      component.onSave();

      // The save event should NOT have been emitted
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when onSave is called on an invalid form', () => {
        // Set the form to an invalid state (missing title)
        component.form.get('title')?.setValue('');
        
        // Ensure it starts as untouched
        expect(component.form.get('title')?.touched).toBeFalse();

        component.onSave();

        // After onSave, it should be marked as touched to display validation errors
        expect(component.form.get('title')?.touched).toBeTrue();
    });
  });
});
