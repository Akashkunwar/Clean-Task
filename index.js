const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const TaskItemEl = document.getElementById("Task-item");

let TaskList = [];

function updateLocalStorage() {
  chrome.storage.local.set({ TaskList: TaskList }, function () {
    console.log("Task list saved");
  });
}

function renderTaskList() {
  chrome.storage.local.get("TaskList", function (result) {
    TaskList = result.TaskList || [];
    TaskItemEl.innerHTML = "";
    if (TaskList.length > 0) {
      TaskList.forEach((item) => {
        const newEl = document.createElement("li");
        newEl.textContent = item.value;
        newEl.addEventListener("dblclick", function () {
          const index = TaskList.findIndex((el) => el.id === item.id);
          if (index !== -1) {
            TaskList.splice(index, 1);
            updateLocalStorage();
            renderTaskList();
          }
        });
        TaskItemEl.appendChild(newEl);
      });
    } else {
      TaskItemEl.innerHTML = "<li>No Task. Well Done 👏</li>";
    }
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function addItem() {
  if (inputFieldEl.value.trim() !== "") {
    const newItem = {
      id: Date.now(),
      value: capitalizeFirstLetter(inputFieldEl.value.trim()),
    };
    chrome.storage.local.get("TaskList", function (result) {
      TaskList = result.TaskList || [];
      TaskList.push(newItem);
      updateLocalStorage();
      renderTaskList();
    });
    inputFieldEl.value = "";
  }
}

addButtonEl.addEventListener("click", addItem);
inputFieldEl.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addItem();
  }
});

renderTaskList();
