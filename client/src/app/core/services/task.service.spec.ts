import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch tasks', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Sample', createdAt: '2025-10-22', completed: false }
    ] as Task[];

    service.fetchTasks().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Sample');
    });

    const req = httpMock.expectOne('/api/tasks?limit=5');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });
});
