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

  
  
  
  
  
  
  
  
  