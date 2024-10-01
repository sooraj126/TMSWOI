document.addEventListener('DOMContentLoaded', function () {

   // Initialize Materialize components
  //  var elems = document.querySelectorAll('.modal');
  //  M.Modal.init(elems);
  //  var selects = document.querySelectorAll('select');
  //  M.FormSelect.init(selects);
 
  var elems = document.querySelectorAll('select');
  var modalElems = document.querySelectorAll('.modal');
  M.FormSelect.init(elems);
  M.Modal.init(modalElems);

    // Elements
    const taskForm = document.getElementById('taskForm');
    const notStartedBoard = document.getElementById('notStarted');
    const inProgressBoard = document.getElementById('inProgress');
    const onHoldBoard = document.getElementById('onHold');
    const completedBoard = document.getElementById('completed');
    const moveTaskSelect = document.getElementById('moveTaskSelect');
    const moveTaskButton = document.getElementById('moveTaskButton');
    const deleteTaskButton = document.getElementById('deleteSelectedTask');

  let selectedTask = null; 

    // Fetch tasks and populate the boards
    fetchTasks();
 
  // document.getElementById('newTaskLink').addEventListener('click', function () {
  //   const modal = M.Modal.getInstance(document.getElementById('taskModal'));
  //   modal.open();
  // });


  // document.getElementById('taskForm').addEventListener('submit', function (e) {
  //   e.preventDefault(); 


  //   const title = document.getElementById('task_title').value;
  //   const deadline = document.getElementById('task_deadline').value;
  //   const description = document.getElementById('task_description').value;
  //   const priority = document.getElementById('task_priority').value;
  //   const category = document.getElementById('task_category').value;


  //   if (!title || !deadline || !priority || !category) {
  //     M.toast({ html: 'Please fill out all fields', classes: 'red' });
  //     return; 
  //   }

  
  //   const taskItem = document.createElement('li');
  //   taskItem.classList.add('card');  // Apply card class
  //   taskItem.innerHTML = `
  //     <div class="card-content">
  //       <span class="card-title">${title}</span>
  //       <p><strong>Deadline:</strong> ${deadline}</p>
  //       <p><strong>Priority:</strong> ${priority}</p>
  //       <p><strong>Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>
  //       <p><strong>Description:</strong> ${description}</p>
  //     </div>
  //   `;
    
  //   document.getElementById('notStarted').appendChild(taskItem);
    


  //   taskItem.addEventListener('click', function () {
  //     if (selectedTask) {
  //       selectedTask.classList.remove('selected'); 
  //     }
  //     taskItem.classList.add('selected');
  //     selectedTask = taskItem;
  //     document.getElementById('deleteSelectedTask').classList.remove('disabled'); 
  //     document.getElementById('moveTaskContainer').classList.remove('disabled'); 
  //   });


  //   document.getElementById('taskForm').reset();
  //   const modal = M.Modal.getInstance(document.getElementById('taskModal'));
  //   modal.close();
  //   M.FormSelect.init(elems); 
  // });


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
      status: 'notStarted' // Default status for new tasks
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      const savedTask = await response.json();
      createTaskElement(savedTask); // Add new task to the board
      taskForm.reset(); // Reset the form
      M.Modal.getInstance(document.getElementById('taskModal')).close(); // Close modal
    } catch (error) {
      console.error('Error creating task:', error);
    }
  });

  // document.getElementById('deleteSelectedTask').addEventListener('click', function () {
  //   if (selectedTask) {
  //     selectedTask.remove(); 
  //     selectedTask = null; 
  //     document.getElementById('deleteSelectedTask').classList.add('disabled'); 
  //     document.getElementById('moveTaskContainer').classList.add('disabled'); 
  //   }
  // });

  
  // document.getElementById('moveTaskSelect').addEventListener('change', function () {
  //   if (selectedTask) {
  //     const targetBoard = this.value;
  //     const board = document.getElementById(targetBoard);

 
  //     board.appendChild(selectedTask);


  //     selectedTask.classList.remove('selected');
  //     selectedTask = null;
  //     document.getElementById('deleteSelectedTask').classList.add('disabled'); 
  //     document.getElementById('moveTaskContainer').classList.add('disabled'); 
  //   }
  // });


  // Fetch tasks from the server
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

    // Create and append task element to the board
    function createTaskElement(task) {
      const li = document.createElement('li');
      li.classList.add('collection-item');
      li.draggable = true;
      li.dataset.taskId = task._id; // Add task ID for future reference
  
      // Task content to display
      li.innerHTML = `
        <strong>${task.title}</strong><br>
        <em>${task.description}</em><br>
        <span>Deadline: ${new Date(task.deadline).toLocaleDateString()}</span><br>
        <span>Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span><br>
        <span>Category: ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
      `;
  
      // Append task to the correct status board
      if (task.status === 'notStarted') {
        notStartedBoard.appendChild(li);
      } else if (task.status === 'inProgress') {
        inProgressBoard.appendChild(li);
      } else if (task.status === 'onHold') {
        onHoldBoard.appendChild(li);
      } else if (task.status === 'completed') {
        completedBoard.appendChild(li);
      }
  
      // Add task selection feature
      li.addEventListener('click', () => {
        handleTaskSelection(li, task);
      });
  
      // Add drag-and-drop functionality
      li.addEventListener('dragstart', handleDragStart);
      li.addEventListener('dragend', handleDragEnd);
    }



     // Task selection logic
  function handleTaskSelection(taskElement, task) {
    // Remove 'selected' class from previously selected task
    if (selectedTask) {
      selectedTask.classList.remove('selected');
    }

    // Add 'selected' class to the clicked task
    taskElement.classList.add('selected');
    selectedTask = taskElement; // Store the currently selected task

    // Enable move and delete buttons
    deleteTaskButton.classList.remove('disabled');
    moveTaskSelect.classList.remove('disabled');
    moveTaskButton.classList.remove('disabled');

    // Set the selected task ID for future actions
    moveTaskSelect.value = task.status;
  }



    // Drag-and-drop handlers
    function handleDragStart(e) {
      e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
      e.target.classList.add('dragging');
    }
  
    function handleDragEnd(e) {
      e.target.classList.remove('dragging');
    }
  
    // Task movement
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
  
        // Remove the task from its old board
        selectedTask.parentNode.removeChild(selectedTask);
  
        // Append it to the new board
        createTaskElement(updatedTask);
  
        // Reset selection
        selectedTask = null;
        deleteTaskButton.classList.add('disabled');
        moveTaskSelect.classList.add('disabled');
        moveTaskButton.classList.add('disabled');
      } catch (error) {
        console.error('Error moving task:', error);
      }
    });
  
    // Delete task
    deleteTaskButton.addEventListener('click', async function () {
      if (!selectedTask) return;
  
      const taskId = selectedTask.dataset.taskId;
  
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
  
        if (response.ok) {
          // Remove task from the UI
          selectedTask.parentNode.removeChild(selectedTask);
  
          // Reset selection
          selectedTask = null;
          deleteTaskButton.classList.add('disabled');
          moveTaskSelect.classList.add('disabled');
          moveTaskButton.classList.add('disabled');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    });
  
    // Drag-and-drop board event listeners
    const boards = [notStartedBoard, inProgressBoard, onHoldBoard, completedBoard];
  
    boards.forEach(board => {
      board.addEventListener('dragover', e => {
        e.preventDefault();
      });
  
      board.addEventListener('drop', async function (e) {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = board.id; // Use the board ID as the new task status
  
        try {
          const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          });
          const updatedTask = await response.json();
  
          // Remove the task from its old board
          const draggedTask = document.querySelector(`[data-task-id="${taskId}"]`);
          draggedTask.parentNode.removeChild(draggedTask);
  
          // Append it to the new board
          createTaskElement(updatedTask);
        } catch (error) {
          console.error('Error updating task status:', error);
        }
      });
    });


});







/////for shwoing user data on screen///

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

//  user ID from the URL
const userId = getQueryParam('id');

if (userId) {
    // user data from the server
    fetch(`/api/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
           
            document.getElementById('user-info').innerText = `Welcome ${data.name} !`;
            
        })
        .catch(error => {
            console.error(error);
            document.getElementById('user-info').innerText = 'User not found';
        });
}


  // Initialize dropdowns
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, { hover: false });
  });


  document.getElementById('showUserInfo').addEventListener('click', function() {
 
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    fetch(`/api/user/${userId}`) 
        .then(response => response.json())
        .then(data => {
            const userName = data.name; 
            const userEmail = data.email; 

            // Update modal content with user information
            document.getElementById('userName').innerText = 'Name: ' + userName;
            document.getElementById('userEmail').innerText = 'Email: ' + userEmail;

            const modalInstance = M.Modal.getInstance(document.getElementById('userInfoModal'));
            modalInstance.open();
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
});


//   // Open OnTrack Modal
// document.getElementById('ontrackLink').addEventListener('click', function() {
//   const modal = M.Modal.getInstance(document.getElementById('onTrackModal'));
//   modal.open();
// });



document.getElementById('ontrackLink').addEventListener('click', function() {
const userId = getQueryParam('id');

// Fetch existing OnTrack link
fetch(`/api/onTrack/${userId}`)
    .then(response => {
        if (!response.ok) throw new Error('Link not found');
        return response.json();
    })
    .then(data => {
        document.getElementById('onTrackInput').value = data.onTrackLink; // Set input value
    })
    .catch(error => {
        console.error('Error fetching OnTrack link:', error);
        document.getElementById('onTrackInput').value = ''; // Clear input if no link found
    });

const modal = M.Modal.getInstance(document.getElementById('onTrackModal'));
modal.open();
});


document.getElementById('onTrackForm').addEventListener('submit', function(e) {
e.preventDefault();

const userId = getQueryParam('id');
const onTrackLink = document.getElementById('onTrackInput').value;
console.log(userId)
console.log(onTrackLink)
// Save OnTrack link
fetch('/api/ontrack', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userId, onTrackLink }),
})
.then(response => {
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  console.log('Success:', data);
  closeModal(); 
})
.catch((error) => {
  console.error('Error:', error);
});

});

function closeModal() {
const modal = M.Modal.getInstance(document.getElementById('onTrackModal'));
modal.close();
}


document.getElementById('ontrackButton').addEventListener('click', function () {

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');  

if (userId) {
    window.location.href = `/ontrack?id=${userId}`;
} else {
    alert('User ID not found!');
}
});







