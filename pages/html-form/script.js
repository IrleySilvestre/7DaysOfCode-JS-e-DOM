const elemForm = document.getElementById("form");
const elemName = document.getElementById("nome");
const elemBirthDate = document.getElementById("birth-date");
const elemTblBirth = document.getElementById("tblBirth");
const elemTblEdite = document.getElementById("btn-edite");
const elemBtnSubmit = document.getElementById("btn-submit");

function showError(input, message) {
  const elemFormControl = input.parentElement;
  elemFormControl.className = "form-control error";
  const elemSmall = elemFormControl.querySelector("small");
  elemSmall.innerText = message;
}

function showSuccess(input) {
  const elemFormControl = input.parentElement;
  elemFormControl.className = "form-control success";
}

function removeSuccess(inputArray) {
  inputArray.forEach((elem) => {
    const elemFormControl = elem.parentElement;
    elemFormControl.className = "form-control";
  });
}

function enableBtn(inputArray) {
  const qtdFild = inputArray.length;
  let qtdSuccess = 0;
  inputArray.forEach((elem) => {
    const elemFormControl = elem.parentElement;
    if (elemFormControl.className === "form-control success") {
      qtdSuccess++;
    }
  });

  if (qtdFild === qtdSuccess) {
    elemBtnSubmit.removeAttribute("disabled");
    elemBtnSubmit.className = "btn enable";
  } else {
    elemBtnSubmit.setAttribute("disabled", "");
    elemBtnSubmit.className = "btn";
  }
}

function checkRequired(inputArr) {
  inputArr.forEach((elem) => {
    if (elem.id === "birth-date") {
      const data = new Date(elemBirthDate.value);
      const dtNow = new Date();
      if (data > dtNow) {
        showError(elem, `Data deve ser menor que data atual!`);
        return;
      }
    }

    if (elem.value.trim() === "") {
      showError(elem, ` Campo obrigtório`);
    } else {
      showSuccess(elem);
    }
  });
}

function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, `Campo deve ter mais  ${min} caracteres`);
  } else if (input.value.length > max) {
    showError(input, `Campo nao pode ser maior que  ${max} caracteres`);
  } else {
    showSuccess(input);
  }
}

function addBirth() {
  const list = elemTblBirth.innerHTML;

  const listBirth = [];

  const data = new Date(elemBirthDate.value);

  const dt = `${data.getUTCDate().toString().padStart(2, "0")}/${(
    data.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${data.getUTCFullYear()}`;

  const birthdayPerson = {
    name: elemName.value,
    dtBirth: dt,
  };

  listBirth.push(birthdayPerson);

  elemName.value = "";
  elemBirthDate.value = "";

  removeSuccess([elemName, elemBirthDate]);

  elemBtnSubmit.setAttribute("disabled", "");
  elemBtnSubmit.className = "btn";

  listBirth.forEach((elem) => {
    let newList =
      list +
      `<tr>
                <td>${elem.name}</td>
                <td>${elem.dtBirth}</td>
                <td>
                    <button id="btn-edite" >Editar</button>
                    <button id="btn-remove" >Remover</button>
                </td>
            </tr>`;
    elemTblBirth.innerHTML = newList;
  });

  addEventBtn();
}

function addEventBtn() {
  const elemBtnEdit = document.querySelectorAll("#btn-edite");
  const elemBtnRemove = document.querySelectorAll("#btn-remove");

  elemBtnEdit.forEach((elem) => {
    elem.addEventListener("click", edite);
  });
  elemBtnRemove.forEach((elem) => {
    elem.addEventListener("click", remove);
  });
}

function edite(e) {
  const tr = e.target.parentElement.parentElement.children;
  elemName.value = tr[0].innerHTML;
  const dt = tr[1].innerHTML;
  const dtformat = `${dt.slice(6, 10)}-${dt.slice(3, 5)}-${dt.slice(0, 2)}`;
  elemBirthDate.value = dtformat;
  checkRequired([elemName, elemBirthDate]);
  enableBtn([elemName, elemBirthDate]);

  remove(e);
}

function remove(e) {
  const elemTr = e.target.parentElement.parentElement;
  elemTr.innerHTML = "";
}

elemName.onblur = () => {
  checkRequired([elemName, elemBirthDate]);
  checkLength(elemName, 3, 70);
  enableBtn([elemName, elemBirthDate]);
};
elemBirthDate.onblur = () => {
  checkRequired([elemName, elemBirthDate]);
  enableBtn([elemName, elemBirthDate]);
};

elemForm.addEventListener("submit", function (e) {
  e.preventDefault();

  checkRequired([elemName, elemBirthDate]);

  checkLength(elemName, 3, 70);

  addBirth();
});
