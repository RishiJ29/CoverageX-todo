import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelComponent } from './left-panel.component';
import { CommonModule } from '@angular/common';

describe('LeftPanelComponent', () => {
  let component: LeftPanelComponent;
  let fixture: ComponentFixture<LeftPanelComponent>;
  let dateSelectSpy: jasmine.Spy; // Spy to track the output event

  // Define today's date for consistent testing
  // We set it to the day before the test date so we can easily define "future" and "past"
  const TODAY_STRING = '2025-10-26'; 
  const FUTURE_DATE = '2025-10-27';
  const PAST_DATE = '2025-10-25';

  beforeAll(() => {
    // Mock the Date object to control 'today' during testing
    jasmine.clock().install();
    const baseTime = new Date(TODAY_STRING);
    jasmine.clock().mockDate(baseTime);
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, LeftPanelComponent], // Use standalone component directly
    }).compileComponents();
    
    fixture = TestBed.createComponent(LeftPanelComponent);
    component = fixture.componentInstance;
    
    // Set up a spy on the dateSelect output emitter
    dateSelectSpy = spyOn(component.dateSelect, 'emit');
    
    fixture.detectChanges(); // Initializes the component
  });

  // --- Test Suite for isPast() Helper ---
  describe('isPast() validation helper', () => {
    it('should return true for a past date', () => {
      expect(component.isPast(PAST_DATE)).toBeTrue();
    });

    it('should return false for today\'s date', () => {
      // isPast should be false for today
      expect(component.isPast(TODAY_STRING)).toBeFalse();
    });

    it('should return false for a future date', () => {
      expect(component.isPast(FUTURE_DATE)).toBeFalse();
    });
  });

  // --- Test Suite for selectDate() Logic ---
  describe('selectDate() method', () => {

    it('should emit the date and set selectedDate when a future date is clicked', () => {
      component.selectDate(FUTURE_DATE);

      // 1. Check if the output event was triggered
      expect(dateSelectSpy).toHaveBeenCalledWith(FUTURE_DATE);
      // 2. Check if the local selectedDate property was updated
      expect(component.selectedDate).toBe(FUTURE_DATE);
      // 3. Check if validation message is cleared
      expect(component.validationMessage).toBeNull();
    });

    it('should emit the date and set selectedDate when today\'s date is clicked', () => {
      component.selectDate(TODAY_STRING);

      expect(dateSelectSpy).toHaveBeenCalledWith(TODAY_STRING);
      expect(component.selectedDate).toBe(TODAY_STRING);
      expect(component.validationMessage).toBeNull();
    });

    it('should NOT emit the date and set a validation message when a past date is clicked', () => {
      // Store the current selected date (if any)
      const initialSelectedDate = component.selectedDate; 
      
      // Spy on console.warn if you want to verify the console message was triggered
      const consoleWarnSpy = spyOn(console, 'warn'); 

      component.selectDate(PAST_DATE);

      // 1. Check that the output event was NOT triggered
      expect(dateSelectSpy).not.toHaveBeenCalled();
      // 2. Check that the selected date remains unchanged
      expect(component.selectedDate).toBe(initialSelectedDate);
      // 3. Check that the validation message is set
      expect(component.validationMessage).toBeTruthy(); 
      // 4. (Optional) Check that the console warning was shown
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});
