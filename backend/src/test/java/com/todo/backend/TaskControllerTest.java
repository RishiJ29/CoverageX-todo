package com.todo.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.backend.Model.Task; // Ensure this import path is correct
import com.todo.backend.Repository.TaskRepository; // Ensure this import path is correct
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class TaskControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    // Helper method to create a valid task object using setters
    private Task createMockTask(String title) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription("Integration test description");
        task.setDueDate(LocalDate.now().plusDays(1));
        task.setDueTime(LocalTime.of(10, 0));
        return task;
    }

    // --- 1. Test POST and GET (Creation and Retrieval) ---
    @Test
    void createTask_and_GetById_ShouldWork() throws Exception {
        // Arrange
        Task newTask = createMockTask("Integration Create Test");

        // Act: Perform POST request to create the task
        String responseContent = mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newTask)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Deserialize the saved Task to get the generated ID
        Task savedTask = objectMapper.readValue(responseContent, Task.class);
        Long savedId = savedTask.getId();

        // Assert 1: Verify the data was saved correctly in the database
        assertTrue(taskRepository.findById(savedId).isPresent(), "Task should be found in the database after creation.");

        // Assert 2: Verify GET by ID endpoint works
        mockMvc.perform(get("/api/tasks/{id}", savedId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Integration Create Test"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    // --- 2. Test PATCH /complete (Completion/Toggling) ---
    @Test
    void completeTask_ShouldMarkTaskAsCompleted() throws Exception {
        // Arrange: Save a new task directly via the repository
        Task taskToComplete = taskRepository.save(createMockTask("Task to Complete"));
        Long taskId = taskToComplete.getId();

        // Act & Assert
        mockMvc.perform(patch("/api/tasks/{id}/complete", taskId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));

        // Assert Database State: Verify the change persisted
        Task updatedTask = taskRepository.findById(taskId).orElseThrow();
        assertTrue(updatedTask.isCompleted(), "Task should be marked as true in the database.");
    }

    // --- 3. Test DELETE (Deletion) ---
    @Test
    void deleteTask_ShouldRemoveTaskFromDatabase() throws Exception {
        // Arrange: Save a task to be deleted
        Task taskToDelete = taskRepository.save(createMockTask("Task to Delete"));
        Long taskId = taskToDelete.getId();

        // Act & Assert
        mockMvc.perform(delete("/api/tasks/{id}", taskId))
                .andExpect(status().isOk()); // Assuming your delete returns 200 OK

        // Assert Database State
        assertFalse(taskRepository.findById(taskId).isPresent(), "Task should not be found in the database after deletion.");
    }
}
