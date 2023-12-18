const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");
const addTaskButton = document.getElementById("add-task-button");
const taskItems = document.querySelectorAll(".task");
const dueDateInput = document.getElementById("due-date");

let editId,
isEditTask = false,
todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let liTag = "";
    if (todos) {
    todos.forEach((todo, id) => {
        let completed = todo.status == "completed" ? "checked" : "";
        let moveButton = id > 0 ? `<li onclick='moveToTop(${id})'><i class="uil uil-arrow-up"></i>Move to Top</li>` : "";
        if (filter == todo.status || filter == "all") {
            liTag += `<li class="task">
            <label for="${id}">
                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                <p class="${completed}">${todo.name}</p>
                <p class="due-date">${todo.dueDate ? todo.dueDate : " "}</p> <!-- Display due date or "No date" -->
            </label>
            <div class="settings">
                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                <ul class="task-menu">
                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                    ${moveButton}
                </ul>
            </div>
        </li>`;
        }
    });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any tasks here.</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

function moveToTop(taskId) {
    if (taskId > 0) {
        const taskToMove = todos.splice(taskId, 1)[0];
        todos.unshift(taskToMove);
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
}

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if(!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});

addTaskButton.addEventListener("click", () => {
    const taskName = taskInput.value.trim();
    const dueDate = dueDateInput.value; 
    if (taskName) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            const taskInfo = { name: taskName, status: "pending", dueDate: dueDate }; 
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = taskName;
            todos[editId].dueDate = dueDate; 
        }
        taskInput.value = "";
        dueDateInput.value = ""; 
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});

function moveToTop(taskId) {
    if (taskId > 0) {
        const taskToMove = todos.splice(taskId, 1)[0];
        todos.unshift(taskToMove);
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
}