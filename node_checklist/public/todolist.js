const $todolist = document.querySelector("#todo-list");
const $todoForm = document.querySelector("#todo-form");

window.addEventListener("load", () => {
  displayTodos();
});

$todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let newList = {
    content: e.target.elements.content.value,
    category: e.target.elements.category.value,
    done: false,
  };
  
  axios.post("/postData", { ...newList }).then(function () {
    e.target.reset();
    location.reload();
  });
});

function displayTodos() {
  axios({
    method: "GET",
    url: "/getData",
  }).then((res) => {
    let checklistData = res.data;
    $todolist.innerHTML = "";
    createList(checklistData);
  });
}

function createList(e) {
  e.forEach((list) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    if (list.done) {
      todoItem.classList.add("done");
    } else {
      todoItem.classList.remove("done");
    }

    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const todoContents = document.createElement("div");
    const todoButtons = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    input.type = "checkbox";
    input.checked = list.done;
    span.classList.add("bubble");

    if (list.category == "일정") {
      span.classList.add("calendar");
    } else if (list.category == "준비물") {
      span.classList.add("materials");
    } else {
      span.classList.add("reservation");
    }

    todoContents.classList.add("todo-contents");
    todoButtons.classList.add("todo-button");
    editButton.classList.add("edit");
    deleteButton.classList.add("delete");

    todoContents.innerHTML = `
      <input type="text" value='${list.content}' readonly />
    `;
    editButton.innerHTML = "수정하기";
    deleteButton.innerHTML = "삭제하기";

    label.appendChild(input);
    label.appendChild(span);
    todoButtons.appendChild(editButton);
    todoButtons.appendChild(deleteButton);
    todoItem.appendChild(label);
    todoItem.appendChild(todoContents);
    todoItem.appendChild(todoButtons);
    $todolist.appendChild(todoItem);

    input.addEventListener("click", (e) => {
      list.done = e.target.checked;

      if (list.done) {
        axios.put("/done", { list }).then(function () {
          todoItem.classList.add("done");
        });
      } else {
        axios.put("/notDone", { list }).then(function () {
          todoItem.classList.remove("done");
        });
      }
    });

    editButton.addEventListener("click", (e) => {
      const input = todoContents.querySelector("input");
      input.removeAttribute("readonly");
      input.focus();
      input.addEventListener("blur", (e) => {
        input.setAttribute("readonly", true);
        let targetVal = e.target.value;
        axios.put("/editData", { list, targetVal }).then(function () {});
      });
    });

    deleteButton.addEventListener("click", (e) => {
      axios.delete("/deleteData", { data: { ...list } }).then(() => {});
      todoItem.style.display = "none";
    });
  });
}
