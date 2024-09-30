document.getElementById('fetchButton').addEventListener('click', fetchTasks);

async function fetchTasks() {
    const apiInput = document.getElementById('apiInput').value;
    if (apiInput) {
        try {
            const response = await fetch(apiInput);
            const data = await response.text();
            parseICalendar(data);
        } catch (error) {
            console.error('Error fetching iCalendar data:', error);
            displayError('Failed to fetch tasks. Please check the API URL.');
        }
    } else {
        displayError('Please enter a valid API URL.');
    }
}

function parseICalendar(data) {
    const events = [];
    const lines = data.split(/\r?\n/);

    let eventMap = {};
    let currentEvent = {};

    lines.forEach(line => {
        if (line.startsWith('BEGIN:VEVENT')) {
            currentEvent = {};
        } else if (line.startsWith('SUMMARY:')) {
            currentEvent.summary = line.replace('SUMMARY:', '').trim();
        } else if (line.startsWith('DTSTART;VALUE=DATE:')) {
            currentEvent.startDate = line.replace('DTSTART;VALUE=DATE:', '').trim();
        } else if (line.startsWith('END:VEVENT')) {
            if (currentEvent.summary) {
                const summaryKey = currentEvent.summary.replace(/^Start: |^End: /, '').trim();
                if (currentEvent.summary.startsWith('Start')) {
                    eventMap[summaryKey] = { startDate: currentEvent.startDate, endDate: 'N/A' };
                } else if (currentEvent.summary.startsWith('End')) {
                    if (!eventMap[summaryKey]) {
                        eventMap[summaryKey] = { startDate: 'N/A', endDate: 'N/A' };
                    }
                    eventMap[summaryKey].endDate = currentEvent.startDate;
                }
            }
        }
    });

    for (const [summaryKey, dates] of Object.entries(eventMap)) {
        if (dates.startDate !== 'N/A' && dates.endDate !== 'N/A') {
            if (dates.startDate > dates.endDate) {
                [dates.startDate, dates.endDate] = [dates.endDate, dates.startDate];
            }
        }
        events.push({
            summary: summaryKey,
            startDate: dates.startDate,
            endDate: dates.endDate
        });
    }

    displayTasks(events);
}

function displayTasks(tasks) {
    const taskColumns = document.getElementById('taskColumns');
    taskColumns.innerHTML = ''; 

    if (tasks.length === 0) {
        taskColumns.innerHTML = '<li>No tasks found</li>';
    } else {
        const taskGroups = {};

        tasks.forEach(task => {
            const courseCode = task.summary.split(":")[0].trim();
            if (!taskGroups[courseCode]) {
                taskGroups[courseCode] = [];
            }
            taskGroups[courseCode].push(task);
        });

        for (const [courseCode, tasks] of Object.entries(taskGroups)) {
            const courseColumn = document.createElement('div');
            courseColumn.classList.add('col', 's12', 'course-column');

            const courseHeader = document.createElement('h5');
            courseHeader.textContent = courseCode;
            courseColumn.appendChild(courseHeader);

            const taskList = document.createElement('ul');
            taskList.classList.add('row');
            
            tasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.classList.add('col', 's12', 'm6', 'l4');
                listItem.innerHTML = `
                    <div class="card task-card">
                        <div class="card-content">
                            <span class="card-title">${task.summary}</span>
                            <p>Start Date: ${task.startDate}</p>
                            <p>End Date: ${task.endDate}</p>
                        </div>
                    </div>
                `;
                taskList.appendChild(listItem);
            });

            courseColumn.appendChild(taskList);
            taskColumns.appendChild(courseColumn);
        }
    }
}

function displayError(message) {
    const taskColumns = document.getElementById('taskColumns');
    taskColumns.innerHTML = `<li style="color: red;">${message}</li>`;
}


document.getElementById('taskpageButton').addEventListener('click', function () {

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');  
  
    if (userId) {
        window.location.href = `/task?id=${userId}`;
    } else {
        alert('User ID not found!');
    }
  });


  document.addEventListener('DOMContentLoaded', async () => {
    const userId = getUserIdFromUrl(); // Function to extract userId from URL
    if (userId) {
        await fetchOnTrackLink(userId);
    }
});

async function fetchOnTrackLink(userId) {
    try {
        console.log("hello");
        const response = await fetch(`/api/ontracklink/${userId}`); // Adjust according to your route
        if (!response.ok) {
            throw new Error('Failed to fetch OnTrack link');
        }
        const data = await response.json();
        if (data.link) {
            // Display the OnTrack link
            document.getElementById('apiInput').value = data.link; 
        } else {
            displayError('No OnTrack link found for this user.'); 
        }
    } catch (error) {
        console.error('Error fetching OnTrack link:', error);
        displayError('An error occurred while fetching the OnTrack link.');
    }
}

function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    // console.log(urlParams.get('id'))
    return urlParams.get('id'); 
}
