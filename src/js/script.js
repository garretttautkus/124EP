// script.js: BYU IT&C 210a JavaScript
// Insert the Lab 1b JavaScript.
function on_submit(event) {
    let formData = new FormData(event.currentTarget);
    let json = JSON.stringify(Object.fromEntries(formData));
    alert(json);
    event.preventDefault();
}

// Insert the Lab 2a JavaScript.



class Task {
    constructor({ text, date, done, id, hotDate, line }) {
        // HINT This method is the constructor. In C++, this would be
        // the Task() method. The curly braces inside the constructor is // a JavaScript syntax that is called 'deconstruction'. This
        // means the constructor will ask for an object
        // (`{i: 'am', an: 'object'}`) with the parameters `text`,
        // `date`, `done`, and `id`. This will make it easier to
        // convert it from the local storage database we will set up.

        // console.log('Calling constructor', text, date, done, id)
        this.text = text
        this.date = date
        this.done = done
        this.id = id
        this.hotDate = hotDate
        this.line = line
    }
    toHTML() {
        // TODO: Fill out this method. It should return a string version
        // of this task, including an `<li>` tag and all of the
        // css classes you used to make it look pretty. It should
        // display the `text`, `date`, and `done` property of this
        // Task. It should also have two inline event handlers, which call the
        // update and delete function, with this Task's `id` as a
        // parameter.

        return `
        <li class="task">
    <input type="checkbox" ${this.done? "checked" : ""} class="checkbox-icon" onclick="updateTask(${this.id})"/>
    <span class="task-description ${this.line}">${this.text}</span>
    <span class="task-date">${this.prettyDate()}</span>
    <button type="button" class="task-delete material-icon" onclick="deleteTask(${this.id})">delete</button>
    </li>`


    }
    prettyDate() {
        // TODO: Fill out this method. It should return the date in our
        // locale's format, 'MM / DD / YYYY', instead of the
        // easily-sortable international standard, 'YYYY-MM-DD'.

        const year = this.date.substring(0, 4);
        const month = this.date.substring(5,7);
        const day = this.date.substring(8,10);
        
        this.hotDate = month + ' / ' + day + ' / ' + year;
    
        return `
        ${this.hotDate}
        `
    }
    toggle() {
        // TODO: Fill out this method. It should flip this Task's `done`
        // property from `true` to `false`, or from `false` to `true`.
        this.done = !this.done;
        if (this.line == 'unchecked-task') {
            this.line = 'checked-task';
        }
        else {
            this.line = 'unchecked-task';
        }
    }
}

let tasks = []
let sortedTasks = [];

let sorting = false;
let hiding = false;

function updateStorage(newData) {
    // ... update the local storage
    let jsonString = JSON.stringify(newData);
    localStorage.setItem('database', jsonString);
    readStorage();
}

function readStorage() {
    // ... read from the local storage
    let jsonString = localStorage.getItem('database');
    let result = JSON.parse(jsonString) || [];
    result = result.map(taskData => new Task(taskData));
    tasks = result;
    updateForm();
    //return result;
    readTasks();
}

function updateSortStorage(newData) {
    // ... update the local storage
    let jsonString = JSON.stringify(newData);
    localStorage.setItem('sortDatabase', jsonString);
    readSortStorage();
}

function readSortStorage() {
    // ... read from the local storage
    let jsonString = localStorage.getItem('sortDatabase');
    let result = JSON.parse(jsonString) || [];
    result = result.map(sortTaskData => new Task(sortTaskData));
    sortedTasks = result;
    updateForm();
    //return result;
    readSortTasks();
}

function saveForm(event){
    let formData = new FormData(event.currentTarget);
    let formObj = Object.fromEntries(formData);
    localStorage.setItem('formData', JSON.stringify(formObj));
}

function updateForm(){
    var gotFormObj = JSON.parse(localStorage.getItem('formData'));
    document.getElementById("formText").value = gotFormObj.text;
    document.getElementById("formDate").value = gotFormObj.date;
}

function createTask(event) {
    // TODO: Pull in form data from DOM
    // TODO: Format it to JSON
    // TODO: Save it to local storage
    // Hint - Look at the JavaScript code from lab 1B to see how to extract form data

    let formData = new FormData(event.currentTarget);
    let formObj = Object.fromEntries(formData);
    event.preventDefault();
    tasks.push(
        new Task ({
            text: formObj.text.replaceAll("<", '&lt;').replaceAll(">", '&gt;').replaceAll("/", "&#47").replaceAll("\"", '&#34'),
            done: false,
            date: formObj.date,
            id: Date.now(),
            hotDate: formObj.date,
            line: "unchecked-task"
        })
    )
    updateStorage(tasks);
}

function readTasks() {
    // TODO: Pull in tasks from local storage
    // TODO: Parse tasks using the toHTML() function
    // TODO: Update DOM accordingly
        var finalHtml = '';
        if (!hiding) {
            for (const task of tasks) {
                const html = task.toHTML();
                finalHtml = finalHtml + html;        
            }
        }
        else {
            let tempTasks = tasks.filter(function( obj ) {
                return obj.line !== "checked-task";
            });
            for (const task of tempTasks) {
                const html = task.toHTML();
        
                finalHtml = finalHtml + html;        
            }
        }
    var ul = document.getElementById("taskList");
    ul.innerHTML = finalHtml;

}

function readSortTasks() {
    // TODO: Pull in tasks from local storage
    // TODO: Parse tasks using the toHTML() function
    // TODO: Update DOM accordingly
    var finalHtml = '';
    if (!hiding) {
        for (const task of sortedTasks) {
            const html = task.toHTML();
    
            finalHtml = finalHtml + html;        
        }
    }
    else {
        let tempTasks = sortedTasks.filter(function( obj ) {
            return obj.line !== "checked-task";
        });
        for (const task of tempTasks) {
            const html = task.toHTML();
    
            finalHtml = finalHtml + html;        
        }
    }

    var ul = document.getElementById("taskList");
    ul.innerHTML = finalHtml;

}

function updateTask(id) {
    // TODO: Update the task in `tasks` array by flipping it's `done` value
    // TODO: Save to local storage
    // TODO: Make the DOM update
    for (const task of tasks) {
        if (id == task.id) {
            task.toggle();
        }        
    }
     updateStorage(tasks);
    for (const task of sortedTasks) {
        if (id == task.id) {
            task.toggle();
        }        
    }
    updateSortStorage(sortedTasks);

    if (!sorting) {
        readTasks();
    }
    else {
        readSortTasks();
    }
}

function deleteTask(id) {
    // TODO: Delete task from `tasks` array
    // TODO: Save to local storage
    // TODO: Make the DOM update
    tasks = tasks.filter(function( obj ) {
        return obj.id !== id;
    });
    updateStorage(tasks);
    sortedTasks = sortedTasks.filter(function( obj ) {
        return obj.id !== id;
    });
    updateSortStorage(sortedTasks);
    if (!sorting) {
        readTasks();
    }
    else {
        readSortTasks();
    }
}


function clearStorage() {
    for (const task of tasks) {
        deleteTask(task.id);
    }
}
function clearSortStorage() {
    for (const task of sortedTasks) {
        deleteTask(task.id);
    }
}


function sortTasks(){
    if (!sorting) {
        //Make a copy of tasks
        //sortedTasks = tasks;
        sorting = true;
        sortedTasks = [];
        for (const task of tasks) {
            sortedTasks.push(task);
        }
        //use the sort() function to sort it by date
        sortedTasks = sortedTasks.sort((a, b) => {return new Date(a.date) - new Date(b.date)});
        updateSortStorage(sortedTasks);
        readSortStorage();
    }
    else {
        sorting = false;
        updateStorage(tasks);
        readStorage();
    }
}

function hideTasks(){
    if (hiding) {
        hiding = false;
    }
    else {
        hiding = true;
    }
    if (sorting) {
        readSortStorage();
    }
    else {
        readStorage();
    }
}



// function loadSave(){

//     if(!(localStorage.getItem('sort'))){
//         readStorage();
//     }
//     else{
//         readSortStorage();
//     }
// }