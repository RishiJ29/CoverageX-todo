package com.todo.backend.Repository;

import com.todo.backend.Model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findBydueDate(LocalDate dueDate);
}
