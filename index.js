const fs = require('fs');
const readline = require('readline');

// File to store tasks
const DB_FILE = 'tasks.json';

// Initialize readline for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Load Tasks from the File
function loadTasks() {
    // If file does not exist, create it with an empty array
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, '[]');
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (err) {
        console.error('Error reading tasks file:', err);
        return [];
    }
}

// Save tasks to file
function saveTasks(tasks) {
    fs.writeFileSync(DB_FILE, JSON.stringify(tasks));
}

// Display the Main Menu
function showMenu() {
    console.log('\n======== Todo CLI ========');
    console.log('1. Add Task');
    console.log('2. List Tasks');
    console.log('3. Delete Task');
    console.log('4. Exit');
}

// Handle User's Choice
function askForAction() {
    showMenu();
    rl.question('\nWhat do you want to do? (1-4): ', (choice) => {
        switch (choice.trim()) {
            case '1':
                addTask();
                break;
            case '2':
                listTasks();
                break;
            case '3':
                deleteTask();
                break;
            case '4':
                rl.close();
                break;
            default:
                console.log('Invalid choice! Try again.');
                askForAction();
        }
    });
}

// Add a Task
function addTask() {
    rl.question('Enter the task: ', (task) => {
        if (!task.trim()) {
            console.log('Task cannot be empty!');
            return askForAction();
        }
        
        const tasks = loadTasks();
        tasks.push(task.trim());
        saveTasks(tasks);
        console.log('Task added!');
        askForAction();
    });
}

// List All Tasks
function listTasks() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log('No tasks found!');
    } else {
        console.log('\nYour Tasks:');
        tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task}`);
        });
    }
    askForAction();
}

// Delete a Task
function deleteTask() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log('No tasks to delete!');
        return askForAction();
    }

    console.log('\nYour Tasks:');
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task}`);
    });

    rl.question('\nEnter task number to delete: ', (num) => {
        const index = parseInt(num) - 1;
        if (isNaN(index) || index < 0 || index >= tasks.length) {
            console.log('Invalid task number!');
        } else {
            const deletedTask = tasks.splice(index, 1);
            saveTasks(tasks);
            console.log(`Deleted: "${deletedTask[0]}"`);
        }
        askForAction();
    });
}

// Start the App
function main() {
    console.log('Welcome to Todo CLI!');
    loadTasks(); // Initialize file if doesn't exist
    askForAction();
}

rl.on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
});

// Run the app
main();