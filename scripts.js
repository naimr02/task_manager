document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    document.getElementById('new-task-form').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Form submitted");
        addTask();
    });

    // Light/Dark mode switch
    const modeSwitch = document.getElementById('mode-switch');
    modeSwitch.addEventListener('change', toggleMode);
    loadModeFromStorage();

    loadTasksFromStorage();
    displayTasks();
});

function toggleMenu() {
    var menu = document.querySelector('.menu-links');
    menu.classList.toggle('show');
    document.body.classList.toggle('menu-open'); // Toggle class to darken the background

    // Add event listener to the document
    document.addEventListener('click', function(event) {
        var isClickInsideMenu = menu.contains(event.target);
        var isClickOnMenuIcon = document.querySelector('.menu-icon').contains(event.target);

        if (!isClickInsideMenu && !isClickOnMenuIcon && menu.classList.contains('show')) {
            menu.classList.remove('show');
            document.body.classList.remove('menu-open');
        }
    });
}

let tasks = [];

function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;

    console.log("Adding task:", title, description, dueDate, priority);

    const task = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        completed: false
    };

    tasks.push(task);
    saveTasksToStorage();
    displayTasks();
    clearForm();
}

function clearForm() {
    document.getElementById('new-task-form').reset();
}

function displayTasks(filter = 'all') {
    console.log("Displaying tasks with filter:", filter);
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (['low', 'medium', 'high'].includes(filter)) {
        filteredTasks = tasks.filter(task => task.priority === filter);
    }

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        if (task.completed) {
            taskItem.classList.add('completed');
        }

        if (task.priority == 'low') {
        taskItem.innerHTML = `
            <h3>${task.title}<img src="icons/bulat.svg" style="vertical-align:middle"></h3>
            <p>${task.description}</p>
            <p>Due: ${task.dueDate}</p>
            <p>Priority: ${task.priority}</p>
            <button onclick="toggleComplete(${task.id})">${task.completed ? 'Mark as Pending' : 'Mark as Completed'}</button>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(taskItem);}

        if (task.priority == 'medium') {
            taskItem.innerHTML = `
                <h3>${task.title}   <img src="icons/petak.svg" style="vertical-align:middle"></h3>
                <p>${task.description}</p>
                <p>Due: ${task.dueDate}</p>
                <p>Priority: ${task.priority}</p>
                <button onclick="toggleComplete(${task.id})">${task.completed ? 'Mark as Pending' : 'Mark as Completed'}</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(taskItem);}

            if (task.priority == 'high') {
                taskItem.innerHTML = `
                    <h3>${task.title}   <img src="icons/segitiga.svg" style="vertical-align:middle"></h3>
                    <p>${task.description}</p>
                    <p>Due: ${task.dueDate}</p>
                    <p>Priority: ${task.priority}</p>
                    <button onclick="toggleComplete(${task.id})">${task.completed ? 'Mark as Pending' : 'Mark as Completed'}</button>
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;
                taskList.appendChild(taskItem);}
    });

    
}

function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    saveTasksToStorage();
    displayTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('due-date').value = task.dueDate;
    document.getElementById('priority').value = task.priority;
    
    deleteTask(id);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage();
    displayTasks();
}

function filterTasks(filter) {
    displayTasks(filter);
}

function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    console.log("Loaded tasks from storage:", tasks);
}

// Light/Dark Mode Toggle Functions
function toggleMode() {
    document.body.classList.toggle('dark-mode');
    saveModeToStorage();
}

function saveModeToStorage() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

function loadModeFromStorage() {
    const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('mode-switch').checked = true;
    }
}

// Function to handle the prompt and store the person's name
function getName() {
    let person = prompt("Please enter your name", "Task Manager");
    if (person != null) {
        localStorage.setItem('personName', person); // Store the name in localStorage
        document.getElementById("showName").innerHTML =
        person;
    }
  }

// Function to check if a name is already stored and display it
function checkStoredName() {
    let storedName = localStorage.getItem('personName');
    if (storedName != null) {
      document.getElementById("showName").innerHTML =
      storedName;
    }
  }

// Check for stored name on page load
window.onload = checkStoredName

document.addEventListener('DOMContentLoaded', function() {
    const fontSelect = document.getElementById('font-select');
    
    // Load saved font preference
    const savedFont = localStorage.getItem('preferredFont');
    if (savedFont) {
        document.body.classList.add(`font-${savedFont}`);
        fontSelect.value = savedFont;
    }
    
    // Listen for font selection changes
    fontSelect.addEventListener('change', function() {
        // Remove existing font class
        document.body.className = document.body.className.replace(/font-\S+/g, '');
        // Add new font class
        const selectedFont = fontSelect.value.toLowerCase().replace(' ', '-');
        document.body.classList.add(`font-${selectedFont}`);
        // Save font preference
        localStorage.setItem('preferredFont', selectedFont);
    });
});
