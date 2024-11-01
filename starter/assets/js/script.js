
// Sélectionner les éléments
const buttonTask = document.querySelector(".btn"); // Sélection du bouton add task
const showTask = document.getElementById("modal-task"); // Sélectionner le div formulaire
const closeIcon = document.getElementById("close_btn"); // Sélectionner le bouton close icon pour fermer la fenêtre formulaire
const cancelTask = document.getElementById("cancel-btn"); // Sélectionner le bouton cancel 
const saveTask = document.getElementById('task-save-btn'); // Sélection du bouton save

// Liste pour stocker les tâches
let tasksList = []; 

// Afficher le formulaire lorsque le bouton Add Task est cliqué
buttonTask.addEventListener("click", function() {
  if (showTask.style.display === "none" || !showTask.style.display) {
      showTask.style.display = "block"; // Affiche le formulaire
      document.body.style.backgroundColor = "rgba(0, 0, 0, 0.3)"; // Modifie la couleur de fond globale
  } else {
      showTask.style.display = "none"; // Masque le formulaire
      document.body.style.backgroundColor = ""; // Restaure la couleur de fond initiale
  }
});

// Masquer le formulaire lorsque l'icône de fermeture est cliquée
closeIcon.addEventListener("click", function(){
  showTask.style.display = "none";
  document.body.style.backgroundColor = "#fff";
});

// Masquer le formulaire lorsque le bouton cancel est cliqué 
cancelTask.addEventListener("click", function(){
  showTask.style.display = "none";
  document.body.style.backgroundColor = "#fff";
});

// Formulaire d'ajout de tâche
const form = document.querySelector("#form-task");

// Gestion de la soumission du formulaire
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêcher la soumission par défaut

  // Récupérer les valeurs des champs
  const taskTitle = document.querySelector("#task-title").value;
  const taskPriority = document.querySelector("#task-priority").value;
  const taskStatus = document.querySelector("#task-status").value;
  const taskDate = document.querySelector("#task-date").value;
  const taskDescription = document.querySelector("#task-description").value;
  const taskType = document.querySelector("input[name='task-type']:checked")?.value;

  // Vérifier que tous les champs obligatoires sont remplis
  if (!taskTitle || !taskType || !taskPriority || !taskStatus || !taskDate || !taskDescription) {
    alert("Veuillez remplir tous les champs obligatoires marqués par une étoile rouge.");
    return;
  }

  // crée un objet newTask avec les informations de la tâche et on l'ajoute à tasksList
  const newTask = {
    taskTitle,
    taskType,
    taskPriority,
    taskStatus,
    taskDate,
    taskDescription
  };
  tasksList.push(newTask);

  // Réinitialiser le formulaire
  form.reset();

  // Masquer le modal
  showTask.style.display = "none";

  // Mettre à jour la liste des tâches affichée
  renderTasks();
});

// Fonction pour afficher la liste des tâches
function renderTasks() {
  const taskListContainer = document.getElementById("to-do-tasks");
  taskListContainer.innerHTML = ""; // Vider la liste avant de la remplir

  tasksList.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "button-to-do d-flex justify-content-start px-1 py-2";
    taskItem.innerHTML = `
      <div class="d-flex justify-content-start p-1">
        <i class="bi bi-question-circle text-success"></i>
      </div>
      <div class="list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0">
        <div class="fw-bold fs-5">${task.taskTitle}</div>
        <div class="text-secondary">#${tasksList.indexOf(task) + 1} créé le ${task.taskDate}</div>
        <div>${task.taskDescription}</div>
        <div class="col-card-priority my-2">
          <span class="btn btn-primary p-1">${task.taskPriority}</span>
          <span class="btn btn-success p-1">${task.taskType}</span>
        </div>
        <div class="col-card-priority my-2">
          <button type="submit" name="update" class="btn btn-warning p-1 task-action-btn" id="task-update-btn">Update</button>
          <button type="submit" name="delete" class="btn btn-danger p-1 task-action-btn" id="task-delete-btn">Delete</button>
        </div>
      </div>
    `;
    taskListContainer.appendChild(taskItem);
  });

  // Mettre à jour le nombre de tâches
  document.getElementById("to-do-tasks-count").textContent = tasksList.length;
}

const buttonDelete = document.getElementById("task-delete-btn") // Sélection du bouton Dellette

buttonDelete.addEventListener("click",(showTask.style.display = "block"));




