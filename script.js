// Model

let tasks = [];

// View
const table = document.getElementById("table");

function updateView() {
    let htmlString = /*html*/ `
        <tr>
            <th class="task-header">Task</th>
            <th class="deadline-header">Deadline</th>
            <th class="assigned-to"> Assigned to</th>
            <th class="done">Completed</th>
            <th class="buttonsCol">Edit</th>
        </tr>
    `;
    if (tasks.length > 0) {
        for (let i = 0; i < tasks.length; i++) {
            htmlString += createTaskHTML(i);
        }
    } else {
        htmlString += /*html*/ `
            <tr>
                <td class="placeholder">Add a task below...</td>
                <td class="placeholder">N/A</td>
                <td class="placeholder">N/A</td>
                <td class="center-flex">
                    <input id="checkbox" type="checkbox" disabled>
                    <div class="completed-date placeholder">N/A</div>
                </td>
                <td></td>
            </tr>
        `;
    }
        
    table.innerHTML = htmlString;
}

updateView();

// Controller
const app = document.getElementById("app");
const desc = document.getElementById("description");
const person = document.getElementById("person");
const date = document.getElementById("date-input");

function newTask() {
    if (desc.value === "") return;
    let assigned = person.value === "" ? "N/A" : person.value;
    tasks.push({
        description: desc.value,
        assignedTo: assigned,
        deadline: date.value ? new Date(date.value) : null,
        isDone: false,
    });
    desc.value = "";
    person.value = "";
    updateView();
    saveDataToCookie();
}

function createTaskHTML(i) {
    let checkbox = tasks[i].isDone ? 'checked="checked"' : "";
    let checkedClass = tasks[i].isDone ? 'class="checked"' : "";
    let dateString = tasks[i].deadline === null ? "N/A" : tasks[i].deadline.toLocaleDateString();
    if (tasks[i].editMode) return /*html*/ `
        <tr>
            <td ${checkedClass}><input class="edit" type="text" id="editDesc${i}" value="${tasks[i].description}"></td>
            <td class="less-padding ${tasks[i].isDone ? "checked" : ""}">
                <input class="date-edit inside" type="date" id="editDate${i}" value="${tasks[i].deadline === null ? "" : tasks[i].deadline.toISOString().substr(0, 10)}">
            </td>
            <td ${checkedClass}><input class="edit short" type="text" id="editPerson${i}" value="${tasks[i].assignedTo}"></td>
            <td class="center-flex ${tasks[i].isDone ? "checked" : ""}">
                <input id="checkbox${i}" type="checkbox" onchange="toggleDone(this, ${i})" ${checkbox}>
                <div class="completed-date">
                    ${tasks[i].isDone ? tasks[i].completedDate.toLocaleDateString() : "N/A"}
                </div>
            </td>
            <td ${checkedClass}>
                <button onclick="saveEdit(${i})" class="firstButton">Save</button>
                <button onclick="cancelEdit(${i})" class="secondButton">Cancel</button>
            </td>
        </tr>
    `;
    return /*html*/ `
        <tr>
            <td ${checkedClass}>${tasks[i].description}</td>
            <td ${checkedClass}>${dateString}</td>
            <td ${checkedClass}>${tasks[i].assignedTo}</td>
            <td class="center-flex ${tasks[i].isDone ? "checked" : ""}">
                <input id="checkbox${i}" type="checkbox" onchange="toggleDone(this, ${i})" ${checkbox}>
                <div class="completed-date">
                    ${tasks[i].isDone ? tasks[i].completedDate.toLocaleDateString() : "N/A"}
                </div>
            </td>
            <td ${checkedClass}>
                <button onclick="editTask(${i})" class="firstButton">Edit</button>
                <button onclick="deleteTask(${i})" class="secondButton">Delete</button>
            </td>
        </tr>
    `;
}

function toggleDone(element, index) {
    tasks[index].isDone = element.checked;
    if (tasks[index].isDone) tasks[index].completedDate = new Date();
    updateView();
    saveDataToCookie();
}

function editTask(i) {
    tasks[i].editMode = true;
    updateView();
}

function saveEdit(i) {
    let task = tasks[i];
    task.description = document.getElementById(`editDesc${i}`).value;
    task.assignedTo = document.getElementById(`editPerson${i}`).value;
    task.deadline = new Date(document.getElementById(`editDate${i}`).value);
    task.editMode = false;
    updateView();
    saveDataToCookie();
}

function cancelEdit(i) {
    tasks[i].editMode = false;
    updateView();
}

function deleteTask(i) {
    tasks.splice(i, 1);
    updateView();
    saveDataToCookie();
}

function saveDataToCookie() {
    document.cookie = `tasks=${JSON.stringify(tasks)}`;
}