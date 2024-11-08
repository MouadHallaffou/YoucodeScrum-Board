// Sélection des éléments et initialise la liste des tâches
const buttonTask = document.querySelector(".btn");
const showTask = document.getElementById("modal-task");
const closeIcon = document.getElementById("close_btn");
const cancelTask = document.getElementById("task-cancel-btn");
const saveTask = document.getElementById("task-save-btn");
const successAlert = document.getElementById("success-alert");

// Charger les tâches depuis localStorage
let tasksList = JSON.parse(localStorage.getItem("tasksList")) || []; 
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

// Fonction pour tronquer la description à 100 caractères
function truncateDescription(description) {
  if (description.length > 100) {
    return description.substring(0, 100) + "...";
  }
  return description;
}

// Fonction pour afficher la description complète d'une tâche
function detailsTask(taskId) {
  // Trouver la tâche avec l'ID correspondant
  const task = tasksList.find((task) => task.id === taskId);
  
  if (task) {
    // Créer et insérer un modal dans le DOM
    const modalContent = `
      <div class="modal fade" id="descriptionModal" tabindex="-1" aria-labelledby="descriptionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="descriptionModalLabel">${task.taskTitle}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h6>Type de tâche: ${task.taskType}</h6>
              <h6>Priorité: ${task.taskPriority}</h6>
              <h6>Statut: ${task.taskStatus}</h6>
              <h6>Date de création: ${task.taskDate}</h6>
              <p><strong>Description complète:</strong></p>
              <p>${task.taskDescription}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insérer le modal dans le body de la page
    document.body.insertAdjacentHTML("beforeend", modalContent);

    // Initialiser et afficher le modal
    const modal = new bootstrap.Modal(document.getElementById("descriptionModal"));
    modal.show();

    // Supprimer le modal du DOM une fois qu'il est fermé
    document.getElementById("descriptionModal").addEventListener("hidden.bs.modal", function () {
      document.getElementById("descriptionModal").remove();
    });
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
    let iconClass;
    if (task.taskStatus === "To Do") {
      iconClass = "bi-hourglass-split text-success fs-3";
    } else if (task.taskStatus === "In Progress") {
      iconClass = "bi-arrow-repeat text-info fs-3";
    } else if (task.taskStatus === "Done") {
      iconClass = "bi bi-check-circle text-success fs-3";
    }

    // Création de l'élément de tâche
    const taskItem = document.createElement("div");
    taskItem.className = "card mb-2";
    taskItem.innerHTML = `
    <div class="card-body">
      <i class="bi ${iconClass}"></i>
      <h5 class="card-title fs-4">${task.taskTitle}</h5>
      <h6 class="card-subtitle mb-2 text-muted">#${
        tasksList.indexOf(task) + 1
      } créé le: ${task.taskDate}</h6>
      <p class="card-text">${truncateDescription(task.taskDescription)}</p>
      <div class="d-flex justify-content-start gap-2">
        <span class="badge bg-primary fs-6">${task.taskPriority}</span>
        <span class="badge bg-success fs-6">${task.taskType}</span>
      </div>
      <div class="mt-2 d-flex justify-content-end">
        <button class="btn btn-info me-1 task-action-btn" onclick="detailsTask(${task.id})">Détails▶️</button>
        <button class="btn btn-warning me-1 task-action-btn" onclick="editTask(${task.id})">Modifier✏️</button>
        <button class="btn btn-danger me-1 task-action-btn delete-btn" data-id="${task.id}">Supprimer🗑️</button>
      </div>
    </div>
  `;  
    
    // Ajouter la tâche dans le bon container
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

  // Afficher le nombre de tâches par statut
  document.getElementById("to-do-count").innerText = toDoCount;
  document.getElementById("in-progress-count").innerText = inProgressCount;
  document.getElementById("done-count").innerText = doneCount;
}

// Charger les tâches existantes au démarrage de l'application
document.addEventListener("DOMContentLoaded", () => {
  renderTasks(); // Afficher les tâches dès que la page est prête
});
