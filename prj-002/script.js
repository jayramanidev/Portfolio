/**
 * Mission Control - Task Manager JavaScript
 */

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.draggedItem = null;

        this.initElements();
        this.bindEvents();
        this.render();
    }

    initElements() {
        this.form = document.getElementById('taskForm');
        this.titleInput = document.getElementById('taskTitle');
        this.prioritySelect = document.getElementById('taskPriority');
        this.deadlineInput = document.getElementById('taskDeadline');
        this.container = document.getElementById('tasksContainer');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasksEl = document.getElementById('totalTasks');

        // Edit modal
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.editIdInput = document.getElementById('editTaskId');
        this.editTitleInput = document.getElementById('editTitle');
        this.editPrioritySelect = document.getElementById('editPriority');
        this.editDeadlineInput = document.getElementById('editDeadline');
        this.cancelEditBtn = document.getElementById('cancelEdit');

        // Filter buttons
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    bindEvents() {
        // Add task
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filters
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.render();
            });
        });

        // Edit modal
        this.editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });

        this.cancelEditBtn.addEventListener('click', () => this.closeModal());

        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeModal();
        });

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    // LocalStorage
    loadTasks() {
        const stored = localStorage.getItem('missionControl_tasks');
        return stored ? JSON.parse(stored) : [];
    }

    saveTasks() {
        localStorage.setItem('missionControl_tasks', JSON.stringify(this.tasks));
    }

    // CRUD Operations
    addTask() {
        const title = this.titleInput.value.trim();
        if (!title) return;

        const task = {
            id: Date.now(),
            title,
            priority: this.prioritySelect.value,
            deadline: this.deadlineInput.value || null,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.render();

        // Reset form
        this.form.reset();
        this.prioritySelect.value = 'medium';
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.render();
    }

    openEdit(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.editIdInput.value = task.id;
        this.editTitleInput.value = task.title;
        this.editPrioritySelect.value = task.priority;
        this.editDeadlineInput.value = task.deadline || '';

        this.editModal.classList.add('show');
        this.editTitleInput.focus();
    }

    saveEdit() {
        const id = parseInt(this.editIdInput.value);
        const task = this.tasks.find(t => t.id === id);

        if (task) {
            task.title = this.editTitleInput.value.trim();
            task.priority = this.editPrioritySelect.value;
            task.deadline = this.editDeadlineInput.value || null;
            this.saveTasks();
            this.render();
        }

        this.closeModal();
    }

    closeModal() {
        this.editModal.classList.remove('show');
    }

    // Filtering
    getFilteredTasks() {
        return this.tasks.filter(task => {
            switch (this.currentFilter) {
                case 'active':
                    return !task.completed;
                case 'completed':
                    return task.completed;
                case 'high':
                case 'medium':
                case 'low':
                    return task.priority === this.currentFilter;
                default:
                    return true;
            }
        });
    }

    // Rendering
    render() {
        const filtered = this.getFilteredTasks();

        // Update stats
        const active = this.tasks.filter(t => !t.completed).length;
        this.totalTasksEl.textContent = `${active} active mission${active !== 1 ? 's' : ''}`;

        // Show empty state or tasks
        if (filtered.length === 0) {
            this.container.innerHTML = '';
            this.emptyState.classList.add('show');
            return;
        }

        this.emptyState.classList.remove('show');

        this.container.innerHTML = filtered.map(task => this.renderTask(task)).join('');

        // Bind task events
        this.bindTaskEvents();
    }

    renderTask(task) {
        const isOverdue = task.deadline && !task.completed && new Date(task.deadline) < new Date();
        const deadlineText = task.deadline ? this.formatDate(task.deadline) : '';

        return `
            <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" 
                 data-id="${task.id}" draggable="true">
                <div class="task-checkbox" data-action="toggle"></div>
                <div class="task-content">
                    <span class="task-title">${this.escapeHtml(task.title)}</span>
                    <div class="task-meta">
                        <span class="priority-badge ${task.priority}">${task.priority}</span>
                        ${deadlineText ? `
                            <span class="task-deadline ${isOverdue ? 'overdue' : ''}">
                                📅 ${deadlineText}${isOverdue ? ' (Overdue!)' : ''}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn edit" data-action="edit" title="Edit">✏️</button>
                    <button class="action-btn delete" data-action="delete" title="Delete">🗑️</button>
                </div>
            </div>
        `;
    }

    bindTaskEvents() {
        // Click events
        this.container.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskEl = el.closest('.task-item');
                const id = parseInt(taskEl.dataset.id);
                const action = el.dataset.action;

                switch (action) {
                    case 'toggle':
                        this.toggleComplete(id);
                        break;
                    case 'edit':
                        this.openEdit(id);
                        break;
                    case 'delete':
                        this.deleteTask(id);
                        break;
                }
            });
        });

        // Drag and drop
        const taskItems = this.container.querySelectorAll('.task-item');

        taskItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                this.draggedItem = null;
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedItem && this.draggedItem !== item) {
                    this.reorderTasks(
                        parseInt(this.draggedItem.dataset.id),
                        parseInt(item.dataset.id)
                    );
                }
            });
        });
    }

    reorderTasks(draggedId, targetId) {
        const draggedIndex = this.tasks.findIndex(t => t.id === draggedId);
        const targetIndex = this.tasks.findIndex(t => t.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const [draggedTask] = this.tasks.splice(draggedIndex, 1);
        this.tasks.splice(targetIndex, 0, draggedTask);

        this.saveTasks();
        this.render();
    }

    // Utilities
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
