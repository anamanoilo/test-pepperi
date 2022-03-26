const refs = {
  form: document.querySelector("form"),
  list: document.querySelector(".list"),
  sortByNameBtn: document.querySelector(".sort-by-name-btn"),
  sortByValueBtn: document.querySelector(".sort-by-value-btn"),
  deleteBtn: document.querySelector(".delete-btn"),
  xmlBtn: document.querySelector(".xml-btn"),
  buttons: document.querySelectorAll(".btn"),
};

refs.form.addEventListener("submit", onSubmit);
const data = [];

function onSubmit(e) {
  e.preventDefault();

  const input = refs.form.elements.input;
  const inputValue = input.value.trim();
  if (!inputValue) {
    alert("Enter some text!");
    return;
  }

  const pair = inputValue.split("=");
  if (pair.length !== 2) {
    alert('Wrong format. Please fill the field in the format "Name=Value".');
    return;
  }
  const pairObj = {
    name: pair[0].trim(),
    value: pair[1].trim(),
  };

  for (const key in pairObj) {
    if (pairObj.hasOwnProperty(key)) {
      if (!pairObj[key]) {
        const capitalizedKey = key[0].toUpperCase() + key.slice(1);
        alert(
          `Wrong format. Please make sure to include ${capitalizedKey} in the Name=Value Pair.`
        );
        return;
      }
      const alphanumeric = /^[\p{L}\p{N}]*$/u;
      if (!pairObj[key].match(alphanumeric)) {
        alert(
          "Wrong format. Names and Values can contain only alpha-numeric characters."
        );
        return;
      }
    }
  }

  data.push(pairObj);
  renderList(data);
  refs.buttons.forEach((btn) => (btn.disabled = false));
  refs.form.reset();
}

// function addToList(pairObj) {
//   const item = document.createElement("li");
//   item.textContent = `${pairObj.name}=${pairObj.value}`;
//   refs.list.append(item);
// }

refs.deleteBtn.addEventListener("click", onDelete);

function onDelete() {
  refs.list.innerHTML = "";
  data.length = 0;
  refs.buttons.forEach((btn) => (btn.disabled = true));
}

refs.sortByNameBtn.addEventListener("click", onSortByName);
refs.sortByValueBtn.addEventListener("click", onSortByValue);

function onSortByName() {
  // const sortedData = [...data].sort((a, b) => a.name.length - b.name.length);
  // renderList(sortedData);
  data.sort((a, b) => a.name.length - b.name.length);
  renderList(data);
}

function onSortByValue() {
  // const sortedData = [...data].sort((a, b) => a.value.length - b.value.length);
  // renderList(sortedData);
  data.sort((a, b) => a.value.length - b.value.length);
  renderList(data);
}

function renderList(dataOfObjects) {
  const markup = dataOfObjects
    .map(({ name, value }) => {
      return `<li>
              ${name}=${value}
            </li>`;
    })
    .join("");
  refs.list.innerHTML = markup;
}

refs.xmlBtn.addEventListener("click", onXmlBtn);

function onXmlBtn() {
  const markup = data
    .map(({ name, value }) => {
      return `<li>
              <code>
              	&ltitem&gt <br>
              	&nbsp;&nbsp; &ltname&gt${name}&lt/name&gt <br>
              	&nbsp;&nbsp; &ltvalue&gt${value}&lt/value&gt <br>
              	&lt/item&gt
              </code>
            </li>`;
    })
    .join("");
  refs.list.innerHTML = "";
  refs.list.insertAdjacentHTML("afterbegin", markup);
}
