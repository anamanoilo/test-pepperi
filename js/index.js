const refs = {
  form: document.querySelector("form"),
  list: document.querySelector(".list"),
  buttons: document.querySelector(".buttons-wrapper"),
  error: document.querySelector(".error"),
};

const data = [];
refs.form.addEventListener("submit", onSubmit);
refs.buttons.addEventListener("click", onClick);

function onSubmit(e) {
  e.preventDefault();

  const input = e.currentTarget.elements.input;
  const inputValue = input.value.trim();
  if (!inputValue) {
    e.currentTarget.classList.add("form--error");
    refs.error.textContent = "Enter some text!";
    return;
  }

  const pair = inputValue.split("=");
  if (pair.length !== 2) {
    e.currentTarget.classList.add("form--error");
    refs.error.textContent =
      'Wrong format. Please fill the field in the format "Name=Value".';
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
        refs.form.classList.add("form--error");
        refs.error.textContent = `Wrong format. Please make sure to include ${capitalizedKey} in the Name=Value Pair.`;
        return;
      }
      const alphanumeric = /^[\p{L}\p{N}]*$/u;
      if (!pairObj[key].match(alphanumeric)) {
        refs.form.classList.add("form--error");
        refs.error.textContent =
          "Wrong format. Names and Values can contain only alpha-numeric characters.";
        return;
      }
    }
  }
  data.push(pairObj);
  e.currentTarget.classList.remove("form--error");
  refs.error.textContent = "";
  renderList(data);
  refs.buttons.childNodes.forEach((btn) => (btn.disabled = false));

  refs.form.reset();
}

function onClick(e) {
  if (e.target === e.currentTarget) {
    return;
  }

  if (e.target.dataset.action === "name") {
    sortByName();
    return;
  }
  if (e.target.dataset.action === "value") {
    sortByValue();
    return;
  }
  if (e.target.dataset.action === "delete") {
    clearList();
    return;
  }
  if (e.target.dataset.action === "xml") {
    showXml();
    return;
  }
}

function sortByName() {
  // the original array is mutated to have possibility show the sorted array in XML
  // ----------------- Sort by the name length-----------------------
  // data.sort((a, b) => a.name.length - b.name.length);
  // renderList(data);
  // ----------------- Sort by alphabet-----------------------
  data.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
  renderList(data);
}

function sortByValue() {
  // ----------------- Sort by the name length-----------------------
  // data.sort((a, b) => a.value.length - b.value.length);
  // renderList(data);
  // ----------------- Sort by alphabet-----------------------
  data.sort(function (a, b) {
    return a.value.localeCompare(b.value);
  });
  renderList(data);
}

function clearList() {
  refs.list.innerHTML = "";
  data.length = 0;
  refs.buttons.childNodes.forEach((btn) => (btn.disabled = true));
}

function showXml() {
  const markup = data
    .map(
      ({ name, value }) => `
<li>
<code>
<pre>&ltitem&gt
  &ltname&gt${name}&lt/name&gt
  &ltvalue&gt${value}&lt/value&gt
&lt/item&gt</pre>
</code>
</li>`
    )
    .join("");
  refs.list.innerHTML = "";
  refs.list.insertAdjacentHTML("afterbegin", markup);
}

function renderList(dataOfObjects) {
  const markup = dataOfObjects
    .map(({ name, value }) => {
      return `<li>
                <p>${name}=${value}</p>
            </li>`;
    })
    .join("");
  refs.list.innerHTML = markup;
}
