// Sélection des éléments et initialise la liste des tâches
const buttonTask = document.querySelector(".btn");
const showTask = document.getElementById("modal-task");
const closeIcon = document.getElementById("close_btn");
const cancelTask = document.getElementById("task-cancel-btn");
const saveTask = document.getElementById("task-save-btn");
const successAlert = document.getElementById("success-alert");

let tasksList = JSON.parse(localStorage.getItem("tasksList")) || []; // Charger les tâches depuis localStorage
let currentEditingTaskId = null;

// Afficher/Masquer le formulaire d'ajout de tâche
buttonTask.addEventListener("click", function () {
  resetForm();

  if (showTask.style.display === "none" || !showTask.style.display) {
    showTask.style.display = "block";
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  } else {
    showTask.style.display = "none";
    document.body.style.backgroundColor = "";
  }
});

closeIcon.addEventListener("click", closeModal);
cancelTask.addEventListener("click", closeModal);

function closeModal() {
  showTask.style.display = "none";
  document.body.style.backgroundColor = "";
}

// Affichage de l'alerte de succès avec un message personnalisé
function showSuccessAlert(message) {
  successAlert.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${message}`;
  successAlert.style.display = "flex";
  setTimeout(() => {
    successAlert.style.display = "none";
  }, 1000);
}

// Réinitialise le formulaire
function resetForm() {
  document.querySelector("#form-task").reset();
  currentEditingTaskId = null;
}

// Gestion de la soumission du formulaire pour ajout ou modification de tâche
const form = document.querySelector("#form-task");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskTitle = document.querySelector("#task-title").value;
  const taskPriority = document.querySelector("#task-priority").value;
  const taskStatus = document.querySelector("#task-status").value;
  const taskDate = document.querySelector("#task-date").value;
  const taskDescription = document.querySelector("#task-description").value;
  const taskType = document.querySelector(
    "input[name='task-type']:checked"
  )?.value;

  if (
    !taskTitle ||
    !taskType ||
    !taskPriority ||
    !taskStatus ||
    !taskDate ||
    !taskDescription
  ) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  if (currentEditingTaskId) {
    // Modification de la tâche existante
    const taskIndex = tasksList.findIndex(
      (task) => task.id === currentEditingTaskId
    );
    tasksList[taskIndex] = {
      id: currentEditingTaskId,
      taskTitle,
      taskType,
      taskPriority,
      taskStatus,
      taskDate,
      taskDescription,
    };
    showSuccessAlert("Tâche modifiée avec succès !");
  } else {
    // Ajout d'une nouvelle tâche
    const newTask = {
      id: Date.now(),
      taskTitle,
      taskType,
      taskPriority,
      taskStatus,
      taskDate,
      taskDescription,
    };
    tasksList.push(newTask);
    showSuccessAlert("Tâche ajoutée avec succès !");
  }

  saveTasksToLocalStorage(); // Sauvegarde des tâches
  resetForm();
  closeModal();
  renderTasks();
});

// Sauvegarder les tâches dans le localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem("tasksList", JSON.stringify(tasksList));
}

// Supprimer une tâche avec confirmation
function deleteTask(taskId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
    tasksList = tasksList.filter((task) => task.id !== taskId);
    showSuccessAlert("Tâche supprimée avec succès !");
    saveTasksToLocalStorage(); // Sauvegarder les changements
    renderTasks();
  }
}

// Modifier une tâche
function editTask(taskId) {
  const task = tasksList.find((task) => task.id === taskId);
  if (task) {
    document.querySelector("#task-title").value = task.taskTitle;
    document.querySelector("#task-priority").value = task.taskPriority;
    document.querySelector("#task-status").value = task.taskStatus;
    document.querySelector("#task-date").value = task.taskDate;
    document.querySelector("#task-description").value = task.taskDescription;
    document.querySelector(
      `input[name='task-type'][value='${task.taskType}']`
    ).checked = true;
    currentEditingTaskId = taskId;
    showTask.style.display = "block";
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  }
}

// Afficher la liste des tâches
function renderTasks() {
  const toDoContainer = document.getElementById("to-do-tasks");
  const inProgressContainer = document.getElementById("in-progress-tasks");
  const doneContainer = document.getElementById("done-tasks");

  toDoContainer.innerHTML = "";
  inProgressContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  let toDoCount = 0;
  let inProgressCount = 0;
  let doneCount = 0;

  tasksList.forEach((task) => {
    // Sélection de l'icône en fonction du statut de la tâche
    let iconClass;
    if (task.taskStatus === "To Do") {
      iconClass = "bi-hourglass-split text-success fs-3";
    } else if (task.taskStatus === "In Progress") {
      iconClass = "bi-arrow-repeat text-info fs-3";
    } else if (task.taskStatus === "Done") {
      iconClass = "bi bi-check-circle text-success fs-3";
    }
        
    const taskItem = document.createElement("div");
    taskItem.className = "card mb-2";
    taskItem.innerHTML = `
      <div class="card-body">
        <i class="bi ${iconClass}"></i>
        <h5 class="card-title fs-4">${task.taskTitle}</h5>
        <h6 class="card-subtitle mb-2 text-muted">#${
          tasksList.indexOf(task) + 1
        } créé le: ${task.taskDate}</h6>
        <p class="card-text">${task.taskDescription}</p>
        <div class="d-flex justify-content-start gap-2">
          <span class="badge bg-primary fs-6">${task.taskPriority}</span>
          <span class="badge bg-success fs-6">${task.taskType}</span>
        </div>
        <div class="mt-2 d-flex justify-content-end">
          <button class="btn btn-warning me-1 task-action-btn" onclick="editTask(${
            task.id
          })">Modifier✏️</button>
          <button class="btn btn-danger me-1 task-action-btn delete-btn" data-id="${
            task.id
          }">Supprimer🗑️</button>
        </div>
      </div>
    `;

    taskItem
      .querySelector(".delete-btn")
      .addEventListener("click", function () {
        deleteTask(task.id);
      });

    if (task.taskStatus === "To Do") {
      toDoContainer.appendChild(taskItem);
      toDoCount++;
    } else if (task.taskStatus === "In Progress") {
      inProgressContainer.appendChild(taskItem);
      inProgressCount++;
    } else if (task.taskStatus === "Done") {
      doneContainer.appendChild(taskItem);
      doneCount++;
    }
  });

  document.getElementById("to-do-tasks-count").textContent = toDoCount;
  document.getElementById("in-progress-tasks-count").textContent = inProgressCount;
  document.getElementById("done-tasks-count").textContent = doneCount;
}

// Charger les tâches existantes au démarrage de l'application
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});

