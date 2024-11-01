// Sélection les éléments et initialise la liste des tâches
const buttonTask = document.querySelector(".btn"); // Sélection du bouton add task
const showTask = document.getElementById("modal-task");// Sélectionner le div formulaire
const closeIcon = document.getElementById("close_btn");// Sélectionner le bouton close icon pour fermer la fenêtre formulaire
const cancelTask = document.getElementById("cancel-btn");// Sélectionner le bouton cancel 
const saveTask = document.getElementById('task-save-btn');// Sélection du bouton save
const successAlert = document.getElementById("success-alert");// Sélection le div succes

let tasksList = [];
// Variable pour suivre l'ID de la tâche en cours de modification
let currentEditingTaskId = null; 

// Afficher/Masquer le formulaire d'ajout de tâche
buttonTask.addEventListener("click", function() {
  resetForm(); // Réinitialiser le formulaire lors de l'ouverture

  if (showTask.style.display === "none" || !showTask.style.display) {
    showTask.style.display = "block";
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  } else {
    showTask.style.display = "none";
    document.body.style.backgroundColor = "";
  }
});

// Fermeture du formulaire d'ajout lors du clic sur l'icône de fermeture
closeIcon.addEventListener("click", function() {
  showTask.style.display = "none";
  document.body.style.backgroundColor = "#fff";
});

// Fermeture du formulaire lors du clic sur le bouton Annuler
cancelTask.addEventListener("click", function() {
  resetForm();
});

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
  const form = document.querySelector("#form-task");
  form.reset();
  currentEditingTaskId = null; // Réinitialise l'ID de tâche en cours d'édition
}

// Gestion de la soumission du formulaire pour l'ajout ou la modification de tâche
const form = document.querySelector("#form-task");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Récupération des valeurs des champs du formulaire
  const taskTitle = document.querySelector("#task-title").value;
  const taskPriority = document.querySelector("#task-priority").value;
  const taskStatus = document.querySelector("#task-status").value;
  const taskDate = document.querySelector("#task-date").value;
  const taskDescription = document.querySelector("#task-description").value;
  const taskType = document.querySelector("input[name='task-type']:checked")?.value;

  // Vérifie que tous les champs sont remplis
  if (!taskTitle || !taskType || !taskPriority || !taskStatus || !taskDate || !taskDescription) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  // Vérifie si nous sommes en mode d'édition
  if (currentEditingTaskId) {
    // Mettre à jour la tâche existante
    const taskIndex = tasksList.findIndex(task => task.id === currentEditingTaskId);
    tasksList[taskIndex] = {
      id: currentEditingTaskId,
      taskTitle,
      taskType,
      taskPriority,
      taskStatus,
      taskDate,
      taskDescription
    };
    showSuccessAlert("Tâche modifiée avec succès !");
  } else {
    // Création d'un nouvel objet de tâche avec un ID unique basé sur la date
    const newTask = {
      id: Date.now(),
      taskTitle,
      taskType,
      taskPriority,
      taskStatus,
      taskDate,
      taskDescription
    };
    tasksList.push(newTask);
    showSuccessAlert("Tâche ajoutée avec succès !");
  }

  // Réinitialiser le formulaire et masquer le modal
  resetForm();
  showTask.style.display = "none";
  renderTasks(); // Mettre à jour l'affichage de la liste des tâches
});

// Fonction de suppression de tâche avec confirmation
function deleteTask(taskId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
    tasksList = tasksList.filter(task => task.id !== taskId);
    showSuccessAlert("Tâche supprimée avec succès !");
    renderTasks(); // Mettre à jour l'affichage après la suppression
  }
}

// Fonction de modification de tâche
function editTask(taskId) {
  const task = tasksList.find(task => task.id === taskId);
  if (task) {
    // Remplit le formulaire avec les données de la tâche à modifier
    document.querySelector("#task-title").value = task.taskTitle;
    document.querySelector("#task-priority").value = task.taskPriority;
    document.querySelector("#task-status").value = task.taskStatus;
    document.querySelector("#task-date").value = task.taskDate;
    document.querySelector("#task-description").value = task.taskDescription;
    document.querySelector(`input[name='task-type'][value='${task.taskType}']`).checked = true;
    currentEditingTaskId = taskId; // Définit l'ID de la tâche en cours d'édition
    showTask.style.display = "block"; // Affiche le formulaire pour modification
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  }
}

// Fonction pour afficher la liste des tâches
function renderTasks() {
  const taskListContainer = document.getElementById("to-do-tasks");
  taskListContainer.innerHTML = "";

  tasksList.forEach((task) => {
    // Création de l'élément de tâche avec les classes Bootstrap
    const taskItem = document.createElement("div");
    taskItem.className = "button-to-do d-flex justify-content-start px-1 py-2"; // Utilisation de la classe card pour un style Bootstrap
    taskItem.innerHTML = `
  
      <div class="card-body">
        <i class="bi bi-question-circle text-success"></i>
        <h5 class="card-title fs-4">${task.taskTitle}</h5>
        <h6 class="card-subtitle mb-2 text-muted">#${tasksList.indexOf(task) + 1} créé le: ${task.taskDate}</h6>
        <p class="card-text">${task.taskDescription}</p>
        <div class="d-flex justify-content-start gap-2">
          <span class="badge bg-primary fs-6">${task.taskPriority}</span>
          <span class="badge bg-success fs-6">${task.taskType}</span>
        </div>
        <div class="mt-3 d-flex justify-content-end">
          <button class="btn btn-warning me-2 task-action-btn" onclick="editTask(${task.id})">Modifier</button>
          <button class="btn btn-danger task-action-btn delete-btn" data-id="${task.id}">Supprimer</button>
        </div>
      </div>
    `;

    // Associer le gestionnaire d'événement pour la suppression
    taskItem.querySelector(".delete-btn").addEventListener("click", function() {
      deleteTask(task.id);
    });

    // Ajouter l'élément de tâche au conteneur de liste
    taskListContainer.appendChild(taskItem);
  });

  // Mettre à jour le compteur de tâches
  document.getElementById("to-do-tasks-count").textContent = tasksList.length;
}
