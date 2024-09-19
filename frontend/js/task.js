document.addEventListener('DOMContentLoaded', function () {

    var elems = document.querySelectorAll('select');
    var modalElems = document.querySelectorAll('.modal');
    M.FormSelect.init(elems);
    M.Modal.init(modalElems);
  
    let selectedTask = null; 
  
   
    document.getElementById('newTaskLink').addEventListener('click', function () {
      const modal = M.Modal.getInstance(document.getElementById('taskModal'));
      modal.open();
    });
  

    document.getElementById('taskForm').addEventListener('submit', function (e) {
      e.preventDefault(); 
  

      const title = document.getElementById('task_title').value;
      const deadline = document.getElementById('task_deadline').value;
      const description = document.getElementById('task_description').value;
      const priority = document.getElementById('task_priority').value;
      const category = document.getElementById('task_category').value;
  
 
      if (!title || !deadline || !priority || !category) {
        M.toast({ html: 'Please fill out all fields', classes: 'red' });
        return; 
      }
  
    
      const taskItem = document.createElement('li');
      taskItem.classList.add('card');  // Apply card class
      taskItem.innerHTML = `
        <div class="card-content">
          <span class="card-title">${title}</span>
          <p><strong>Deadline:</strong> ${deadline}</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <p><strong>Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>
          <p><strong>Description:</strong> ${description}</p>
        </div>
      `;
      
      document.getElementById('notStarted').appendChild(taskItem);
      
  

      taskItem.addEventListener('click', function () {
        if (selectedTask) {
          selectedTask.classList.remove('selected'); 
        }
        taskItem.classList.add('selected');
        selectedTask = taskItem;
        document.getElementById('deleteSelectedTask').classList.remove('disabled'); 
        document.getElementById('moveTaskContainer').classList.remove('disabled'); 
      });
  

      document.getElementById('taskForm').reset();
      const modal = M.Modal.getInstance(document.getElementById('taskModal'));
      modal.close();
      M.FormSelect.init(elems); 
    });
  
 
    document.getElementById('deleteSelectedTask').addEventListener('click', function () {
      if (selectedTask) {
        selectedTask.remove(); 
        selectedTask = null; 
        document.getElementById('deleteSelectedTask').classList.add('disabled'); 
        document.getElementById('moveTaskContainer').classList.add('disabled'); 
      }
    });
  
    
    document.getElementById('moveTaskSelect').addEventListener('change', function () {
      if (selectedTask) {
        const targetBoard = this.value;
        const board = document.getElementById(targetBoard);
  
   
        board.appendChild(selectedTask);
  
  
        selectedTask.classList.remove('selected');
        selectedTask = null;
        document.getElementById('deleteSelectedTask').classList.add('disabled'); 
        document.getElementById('moveTaskContainer').classList.add('disabled'); 
      }
    });
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  