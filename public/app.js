// Referencia a la tabla de contenido
const contentTable = document.getElementById('contentTable');
// Referencia al template
const templateRow = document.getElementById('contentRow').content;

const inputName = document.getElementById('inputName');
const inputAge = document.getElementById('inputAge');

const createUserFormContent = document.getElementById('form-create');
const createUserForm = document.getElementById('createUserForm');

const updateUserFormContent = document.getElementById('form-update');
const updateUserForm = document.getElementById('updateUserForm');

let editingUserId = null;

/**
 * Agregar Row.
 *
 * @param {*} name
 * @param {*} age
 */
function addRow(name, age, id) {
  // Clono el template en una nueva variable
  const row = templateRow.cloneNode(true);

  // Modifico el valor del nodo de texto por el ingesado por el usuario
  row.querySelector('.txtName').innerText = name;
  row.querySelector('.txtAge').innerText = age;

  row.querySelector('.btnDelete').onclick = () => deleteUser(id);
  row.querySelector('.btnEdit').addEventListener('click', () => updateUser(id));

  row.querySelector('.row').dataset.id = id;

  // Inserto en el contenido de la tabla
  contentTable.appendChild(row);
}

/**
 * Llamado a la API.
 *
 * @param {'get'|'post'|'delete'|'put'} method
 * @param {'/users'|'/users/:id'} endpoint
 * @returns
 */
async function api(method, endpoint, body = undefined) {
  if (body) {
    body = JSON.stringify(body);
  }

  const response = await fetch(`/api${endpoint}`, {
    method,
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  return data;
}

/**
 * Cargar datos de la tabla.
 */
async function loadTable() {
  contentTable.innerHTML = '';
  const data = await api('get', '/users');
  data.forEach(({ name, age, id }) => addRow(name, age, id));
}

/**
 * Inicio de la APP.
 */
async function initApp() {
  await loadTable();
}

/**
 * Crear usuario.
 */
async function createUser() {
  const name = inputName.value;
  const age = inputAge.value;

  await api('post', '/users', {
    name,
    age,
  });

  createUserForm.reset();
  loadTable();
}

/**
 * Actualizar usuario.
 */
async function updateUser(id) {
  editingUserId = id;

  createUserFormContent.style.display = 'none';
  updateUserFormContent.style.display = '';

  const user = await api('get', `/users/${id}`);

  updateUserFormContent.querySelector('#user-id').innerText = id;
  updateUserForm.querySelector('#inputName').value = user.name;
  updateUserForm.querySelector('#inputAge').value = user.age;
}

async function saveUpdateUser() {
  const name = updateUserForm.querySelector('#inputName').value;
  const age = updateUserForm.querySelector('#inputAge').value;

  await api('put', `/users/${editingUserId}`, {
    name,
    age,
  });

  cancelUpdate();
  loadTable();
}

async function deleteUser(id) {
  await api('delete', `/users/${id}`);

  const userRow = document.querySelector(`[data-id='${id}']`);
  userRow.remove();
}

function cancelUpdate() {
  updateUserFormContent.style.display = 'none';
  createUserFormContent.style.display = '';
}
