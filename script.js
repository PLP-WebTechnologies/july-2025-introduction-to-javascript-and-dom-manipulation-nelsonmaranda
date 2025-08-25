// =====================================================
// PART 1: VARIABLE DECLARATIONS AND CONDITIONALS
// =====================================================

// Global variables to manage application state
let tasks = []; // Array to store all task objects
let taskIdCounter = 1; // Counter for unique task IDs
let currentFilter = 'all'; // Current filter state (all, pending, completed, high)
let isDarkTheme = false; // Boolean to track theme state

// DOM element references (cached for better performance)
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const noTasksMessage = document.getElementById('noTasksMessage');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');
const themeToggle = document.getElementById('themeToggle');
const clearAllBtn = document.getElementById('clearAllBtn');

// =====================================================
// PART 2: CUSTOM FUNCTIONS
// =====================================================

// Function 1: Add a new task with validation
function addTask() {
    // Get input values
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    // Conditional validation - check if input is empty
    if (taskText === '') {
        alert('Please enter a task description!');
        return; // Exit function if validation fails
    }
    
    // Conditional validation - check length
    if (taskText.length > 100) {
        alert('Task description is too long! Maximum 100 characters.');
        return;
    }
    
    // Create new task object
    const newTask = {
        id: taskIdCounter++, // Increment counter for unique ID
        text: taskText,
        priority: priority,
        completed: false,
        createdAt: new Date()
    };
    
    // Add task to array
    tasks.push(newTask);
    
    // Clear input field
    taskInput.value = '';
    
    // Update the display
    renderTasks();
    updateStats();
    
    console.log('New task added:', newTask);
}

// Function 2: Toggle task completion status
function toggleTaskCompletion(taskId) {
    // Find task using conditional logic
    const task = tasks.find(task => task.id === taskId);
    
    // Conditional check if task exists
    if (task) {
        // Toggle completion status
        task.completed = !task.completed;
        
        // Update display
        renderTasks();
        updateStats();
        
        // Conditional feedback message
        if (task.completed) {
            console.log(`Task "${task.text}" marked as completed! 🎉`);
        } else {
            console.log(`Task "${task.text}" marked as pending.`);
        }
    } else {
        console.log('Task not found!');
    }
}

// Function 3: Delete a specific task
function deleteTask(taskId) {
    // Conditional confirmation dialog
    if (confirm('Are you sure you want to delete this task?')) {
        const initialLength = tasks.length;
        
        // Filter out the task to delete
        tasks = tasks.filter(task => task.id !== taskId);
        
        // Check if deletion was successful
        if (tasks.length < initialLength) {
            renderTasks();
            updateStats();
            console.log('Task deleted successfully!');
        } else {
            console.log('Task not found for deletion!');
        }
    }
}

// Function 4: Filter tasks based on criteria
function filterTasks(filterType) {
    currentFilter = filterType;
    renderTasks();
    
    // Update filter button states using conditional logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        // Conditional class manipulation
        if (btn.dataset.filter === filterType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    console.log('Filter applied:', filterType);
}

// =====================================================
// PART 3: LOOPS
// =====================================================

// Loop Example 1: Render tasks using forEach loop
function renderTasks() {
    // Clear existing content
    taskList.innerHTML = '';
    
    // Get filtered tasks based on current filter
    let filteredTasks = getFilteredTasks();
    
    // Check if there are no tasks to display
    if (filteredTasks.length === 0) {
        taskList.appendChild(noTasksMessage);
        return;
    }
    
    // forEach loop to create and display each task
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
    
    console.log(`Rendered ${filteredTasks.length} tasks`);
}

// Loop Example 2: Update statistics using traditional for loop
function updateStats() {
    let totalTasks = tasks.length;
    let completedCount = 0;
    let pendingCount = 0;
    
    // Traditional for loop to count task statuses
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completedCount++;
        } else {
            pendingCount++;
        }
    }
    
    // Update DOM elements with new counts
    totalTasksSpan.textContent = totalTasks;
    completedTasksSpan.textContent = completedCount;
    pendingTasksSpan.textContent = pendingCount;
    
    console.log(`Stats updated: Total: ${totalTasks}, Completed: ${completedCount}, Pending: ${pendingCount}`);
}

// Loop Example 3: Clear all tasks using while loop
function clearAllTasks() {
    // Conditional confirmation
    if (tasks.length === 0) {
        alert('No tasks to clear!');
        return;
    }
    
    if (confirm('Are you sure you want to clear all tasks?')) {
        // While loop to remove tasks one by one (demonstrating while loop usage)
        while (tasks.length > 0) {
            tasks.pop(); // Remove last task
        }
        
        renderTasks();
        updateStats();
        console.log('All tasks cleared!');
    }
}

// =====================================================
// PART 4: DOM INTERACTIONS
// =====================================================

// DOM Interaction 1: Create task element dynamically
function createTaskElement(task) {
    // Create main container element
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.taskId = task.id;
    
    // Create task header
    const taskHeader = document.createElement('div');
    taskHeader.className = 'task-header';
    
    // Create task text element
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    // Create priority badge
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `task-priority priority-${task.priority}`;
    priorityBadge.textContent = task.priority;
    
    // Append text and priority to header
    taskHeader.appendChild(taskText);
    taskHeader.appendChild(priorityBadge);
    
    // Create actions container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';
    
    // Create complete button
    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn-small btn-complete';
    completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
    completeBtn.onclick = () => toggleTaskCompletion(task.id);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-small btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(task.id);
    
    // Append buttons to actions
    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);
    
    // Append all elements to main container
    taskItem.appendChild(taskHeader);
    taskItem.appendChild(actionsDiv);
    
    return taskItem;
}

// DOM Interaction 2: Event listener setup and element selection
function setupEventListeners() {
    // Add task button click event
    addTaskBtn.addEventListener('click', addTask);
    
    // Enter key press in input field
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    
    // Theme toggle button
    themeToggle.addEventListener('click', toggleTheme);
    
    // Clear all tasks button
    clearAllBtn.addEventListener('click', clearAllTasks);
    
    // Filter buttons using event delegation
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('filter-btn') && event.target.dataset.filter) {
            filterTasks(event.target.dataset.filter);
        }
    });
    
    console.log('Event listeners set up successfully!');
}

// DOM Interaction 3: Dynamic style and class manipulation
function toggleTheme() {
    // Toggle theme variable
    isDarkTheme = !isDarkTheme;
    
    // Get body element
    const body = document.body;
    
    // Conditional class manipulation based on theme
    if (isDarkTheme) {
        body.classList.add('dark-theme');
        themeToggle.textContent = 'Light Theme';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.textContent = 'Dark Theme';
    }
    
    console.log(`Theme toggled to: ${isDarkTheme ? 'Dark' : 'Light'}`);
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Get filtered tasks based on current filter using conditional logic
function getFilteredTasks() {
    // Switch statement for different filter conditions
    switch (currentFilter) {
        case 'completed':
            return tasks.filter(task => task.completed === true);
        case 'pending':
            return tasks.filter(task => task.completed === false);
        case 'high':
            return tasks.filter(task => task.priority === 'high');
        default:
            return tasks; // Return all tasks
    }
}

// =====================================================
// APPLICATION INITIALIZATION
// =====================================================

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM fully loaded - initializing application...');
    
    // Set up all event listeners
    setupEventListeners();
    
    // Add some sample tasks for demonstration
    const sampleTasks = [
        {
            id: taskIdCounter++,
            text: "Learn JavaScript DOM manipulation",
            priority: "high",
            completed: false,
            createdAt: new Date()
        },
        {
            id: taskIdCounter++,
            text: "Practice using loops and conditionals",
            priority: "medium",
            completed: true,
            createdAt: new Date()
        },
        {
            id: taskIdCounter++,
            text: "Build an interactive web application",
            priority: "low",
            completed: false,
            createdAt: new Date()
        }
    ];
    
    // Add sample tasks using loop
    for (let i = 0; i < sampleTasks.length; i++) {
        tasks.push(sampleTasks[i]);
    }
    
    // Initial render
    renderTasks();
    updateStats();
    
    console.log('✅ Application initialized successfully!');
    console.log('📋 Features demonstrated:');
    console.log('   - Variables and conditionals');
    console.log('   - Custom functions');
    console.log('   - Multiple loop types');
    console.log('   - DOM manipulation');
    console.log('   - Event handling');
});

