'use strict';


function getJSON(src) {
    var request = new XMLHttpRequest();
    request.open('GET', src, false); 
    request.send(null);

    if (request.status === 200) {
        try {
            return JSON.parse(request.responseText);
        } catch(e) {
            return null;
        }
    }
    return null;
}

function order(obj,todos) {
    if(todos.sort_by === 'newest_first') {
        obj.sort(function(a,b){
          return a.updated_at < b.updated_at;
        });
    }
    return obj;
}

function filter (obj) {
    if(!obj.filter_by) return obj.items;

    var result = [];
    for(let todo of obj.items) {
        if(todo.status === obj.filter_by) result.push(todo);
    }

    return result;
}

function loadToDo(src){
    var localTodo = getLocalStorage('todo');

    if(localTodo) return localTodo;

    var todosFile = getJSON(src);
    setLocalStorage('todo', todosFile);

    return todosFile;
}

function getLocalStorage(name) {
    var todos_str = localStorage.getItem(name);

    if (todos_str) return JSON.parse(todos_str); 
    return;
}

function setLocalStorage (name, value) {
    localStorage.setItem(name,JSON.stringify(value));
}

function action(type, id){
    for(let todo of todos.items) {
        if(todo.updated_at == id) todo.status = type;
    }

    setLocalStorage('todo', todos);
    show();
}

function add(){
    var newTask = document.getElementById('newTask');
    if(!newTask.value) return;
    
    var date = new Date();
    var time = date.getTime();

    todos.items.push({
        updated_at: time,
        description: newTask.value,
        status: "todo"
    });

    setLocalStorage('todo', todos);
    newTask.value = '';
    show();
}

function selectedOption(){
    if(todos.filter_by === 'todo') document.getElementById("link-todo").className = 'link-selected';
    else if(todos.filter_by === 'done') document.getElementById("link-done").className = 'link-selected';
    else if(todos.filter_by === 'removed') document.getElementById("link-removed").className = 'link-selected';
    else document.getElementById("link-all").className = 'link-selected';
}

function resetSelected(){
    document.getElementById("link-all").className = '';
    document.getElementById("link-todo").className = '';
    document.getElementById("link-done").className = '';
    document.getElementById("link-removed").className = '';
}

function showFiltered(element, type) {
    resetSelected();

    todos.filter_by = type;
    element.className += 'link-selected';
    setLocalStorage('todo', todos);
    show();
}
 
function show() {

    var items = todos.items;
    items = filter(todos);
    items = order(items, todos);

    if(!todos.items) return;

    var html = '<ul class="task-display">';

    for(let todo of items) {

        html += `<li class="${todo.status} task-item">
                    <span class="description">${todo.description}</span>
                    <ul class="button-container">
                        <li><a href="#" title="Done" class="icon-done" onclick="action('done', ${todo.updated_at})"></a></li>
                        <li><a href="#" title="Remove" class="icon-remove" onclick="action('removed', ${todo.updated_at})"></a></li>
                    </ul>
                </li>`;
    }

    html += '</ul>';
 
    document.getElementById('todo-list').innerHTML = html;
}

var todos = {};

function init(){
    todos = loadToDo('js/data.json');
    selectedOption();
    show();
}

window.onload = init;