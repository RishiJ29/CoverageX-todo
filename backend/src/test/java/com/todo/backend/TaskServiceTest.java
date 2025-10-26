package com.todo.backend;

import com.todo.backend.Model.Task;
import com.todo.backend.Repository.TaskRepository;
import com.todo.backend.Service.TaskService;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock // 1. Mock the dependency (Repository)
    private TaskRepository taskRepository;

    @InjectMocks // 2. Inject mocks into the service instance
    private TaskService taskService;

    private Task mockTask;

    @BeforeEach
    void setUp() {
        mockTask = new Task();
        mockTask.setId(1L);
        mockTask.setTitle("Test Task");
        mockTask.setCompleted(false);
    }

    @Test
    void completeTask_ShouldSetCompletedToTrueAndSave() {
        // Arrange
        // Tell Mockito what to return when the repository is called
        when(taskRepository.findById(1L)).thenReturn(Optional.of(mockTask));
        when(taskRepository.save(any(Task.class))).thenReturn(mockTask);

        // Act
        Task completedTask = taskService.completeTask(1L);

        // Assert
        // 1. Verify the business logic was applied
        assertTrue(completedTask.isCompleted(), "Task should be marked as completed");

        // 2. Verify the necessary method calls occurred
        verify(taskRepository, times(1)).findById(1L);
        // Verify save was called exactly once with *any* Task object
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void completeTask_ShouldThrowException_WhenTaskNotFound() {
        // Arrange
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        // Assert
        // Verify that calling the service method throws the expected exception
        assertThrows(RuntimeException.class, () -> {
            taskService.completeTask(99L);
        });

        // Verify that save was never called if the task doesn't exist
        verify(taskRepository, never()).save(any(Task.class));
    }
}
