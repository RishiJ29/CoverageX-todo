export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string | null;   // ISO date string (e.g., "2025-10-23")
  dueTime?: string | null;   // optional, e.g., "14:30"
  createdAt: string;         // ISO timestamp (e.g., "2025-10-22T14:00:00Z")
  completed: boolean;
}

