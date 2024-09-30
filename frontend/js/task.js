document.addEventListener('DOMContentLoaded', function () {
  
  var elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);
  var selects = document.querySelectorAll('select');
  M.FormSelect.init(selects);

  
  const taskForm = document.getElementById('taskForm');
  const notStartedBoard = document.getElementById('notStarted');
  const inProgressBoard = document.getElementById('inProgress');
  const onHoldBoard = document.getElementById('onHold');
  const completedBoard = document.getElementById('completed');
  const moveTaskSelect = document.getElementById('moveTaskSelect');
  const moveTaskButton = document.getElementById('moveTaskButton');
  const deleteTaskButton = document.getElementById('deleteSelectedTask');
  
  let selectedTask = null;

 
  fetchTasks();

  
  taskForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const taskTitle = document.getElementById('task_title').value;
    const taskDeadline = document.getElementById('task_deadline').value;
    const taskDescription = document.getElementById('task_description').value;
    const taskPriority = document.getElementById('task_priority').value;
    const taskCategory = document.getElementById('task_category').value;

    const newTask = {
      title: taskTitle,
      deadline: taskDeadline,
      description: taskDescription,
      priority: taskPriority,
      category: taskCategory,
      status: 'notStarted' 
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      const savedTask = await response.json();
      createTaskElement(savedTask); 
      taskForm.reset(); 
      M.Modal.getInstance(document.getElementById('taskModal')).close(); 
    } catch (error) {
      console.error('Error creating task:', error);
    }
  });

  
  async function fetchTasks() {
    try {
      const response = await fetch('/api/tasks');
      const tasks = await response.json();
      tasks.forEach(task => {
        createTaskElement(task);
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

 
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('collection-item');
    li.draggable = true;
    li.dataset.taskId = task._id; 

    
    li.innerHTML = `
      <strong>${task.title}</strong><br>
      <em>${task.description}</em><br>
      <span>Deadline: ${new Date(task.deadline).toLocaleDateString()}</span><br>
      <span>Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span><br>
      <span>Category: ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
    `;

    
    if (task.status === 'notStarted') {
      notStartedBoard.appendChild(li);
    } else if (task.status === 'inProgress') {
      inProgressBoard.appendChild(li);
    } else if (task.status === 'onHold') {
      onHoldBoard.appendChild(li);
    } else if (task.status === 'completed') {
      completedBoard.appendChild(li);
    }

    
    li.addEventListener('click', () => {
      handleTaskSelection(li, task);
    });

    
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);
  }

  
  function handleTaskSelection(taskElement, task) {
    
    if (selectedTask) {
      selectedTask.classList.remove('selected');
    }

    
    taskElement.classList.add('selected');
    selectedTask = taskElement; 

    
    deleteTaskButton.classList.remove('disabled');
    moveTaskSelect.classList.remove('disabled');
    moveTaskButton.classList.remove('disabled');

    
    moveTaskSelect.value = task.status;
  }

  
  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
    e.target.classList.add('dragging');
  }

  function handleDragEnd(e) {
    e.target.classList.remove('dragging');
  }

  
  moveTaskButton.addEventListener('click', async function () {
    if (!selectedTask) return;

    const newStatus = moveTaskSelect.value;
    const taskId = selectedTask.dataset.taskId;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const updatedTask = await response.json();

      
      selectedTask.parentNode.removeChild(selectedTask);

      
      createTaskElement(updatedTask);

      
      selectedTask = null;
      deleteTaskButton.classList.add('disabled');
      moveTaskSelect.classList.add('disabled');
      moveTaskButton.classList.add('disabled');
    } catch (error) {
      console.error('Error moving task:', error);
    }
  });

  
  deleteTaskButton.addEventListener('click', async function () {
    if (!selectedTask) return;

    const taskId = selectedTask.dataset.taskId;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        
        selectedTask.parentNode.removeChild(selectedTask);

        
        selectedTask = null;
        deleteTaskButton.classList.add('disabled');
        moveTaskSelect.classList.add('disabled');
        moveTaskButton.classList.add('disabled');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  });

  
  const boards = [notStartedBoard, inProgressBoard, onHoldBoard, completedBoard];

  boards.forEach(board => {
    board.addEventListener('dragover', e => {
      e.preventDefault();
    });

    board.addEventListener('drop', async function (e) {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      const newStatus = board.id; 

      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        const updatedTask = await response.json();

        
        const draggedTask = document.querySelector(`[data-task-id="${taskId}"]`);
        draggedTask.parentNode.removeChild(draggedTask);

        
        createTaskElement(updatedTask);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    });
  });
});
