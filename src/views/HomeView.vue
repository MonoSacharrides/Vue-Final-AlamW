<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/firebase.js';
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { RouterLink, RouterView } from 'vue-router';

const tasks = ref([]);
const task = ref('');
const endDate = ref('');
const status = ref('');
const assignee = ref('');
const loading = ref(false);

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};


const loadFromLocalStorage = (key) => {
  return localStorage.getItem(key) || '';
};


onMounted(() => {
  fetchTasks();

  task.value = loadFromLocalStorage('task');
  endDate.value = loadFromLocalStorage('endDate');
  status.value = loadFromLocalStorage('status');
  assignee.value = loadFromLocalStorage('assignee');
});


const fetchTasks = () => {
  loading.value = true;
  onSnapshot(collection(db, 'tasks'), (querySnapshot) => {
    tasks.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      task: doc.data().task,
      endDate: new Date(Date.parse(doc.data().endDate)).toDateString(),
      status: doc.data().status,
      assignee: doc.data().assignee,
    }));
    loading.value = false;
  });
};

const addTask = async () => {
  if (!task.value || !endDate.value || !status.value || !assignee.value) {
    alert('Please fill in all fields before adding a task.');
    return;
  }
  const newTask = {
    task: task.value,
    endDate: endDate.value,
    status: status.value,
    assignee: assignee.value,
  };
  await addDoc(collection(db, 'tasks'), newTask);
  task.value = '';
  endDate.value = '';
  status.value = '';
  assignee.value = '';
};

const compareStrings = (status) => {
  const statusMap = {
    'Not Started': 'bg-secondary',
    'In Progress': 'bg-info',
    Finished: 'bg-success',
    Cancelled: 'bg-danger',
  };
  return statusMap[status] || 'bg-light';
};

const filterTasksByStatus = (status) => {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('status', '==', status), orderBy('task', 'asc'));
  loading.value = true;
  onSnapshot(q, (querySnapshot) => {
    tasks.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      task: doc.data().task,
      endDate: new Date(Date.parse(doc.data().endDate)).toDateString(),
      status: doc.data().status,
      assignee: doc.data().assignee,
    }));
    loading.value = false;
  });
};

</script>


<template>
  <div class="container mt-3">
    <div class="row">
      <div class="container d-flex justify-content-between">
        <h3>Task Board</h3>
        <div class="dropdown">
          <button class="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Filter Tasks
          </button>
          <ul class="dropdown-menu">
            <li><a @click="fetchTasks()" class="dropdown-item" href="#">All Tasks</a></li>
            <li><a @click="filterTasksByStatus('Not Started')" class="dropdown-item" href="#">Not Started</a></li>
            <li><a @click="filterTasksByStatus('In Progress')" class="dropdown-item" href="#">In Progress</a></li>
            <li><a @click="filterTasksByStatus('Finished')" class="dropdown-item" href="#">Finished</a></li>
            <li><a @click="filterTasksByStatus('Cancelled')" class="dropdown-item" href="#">Cancelled</a></li>
          </ul>
        </div>
      </div>

      <div class="container col-md-12">
        <div class="container d-flex align-items-center p-3">
          <p class="w-75 mb-0 fw-semibold">TASK</p>
          <div class="container d-flex justify-content-between">
            <div class="container text-center"><p class="mb-0 fw-semibold">END DATE</p></div>
            <div class="container text-center"><p class="mb-0 fw-semibold">STATUS</p></div>
            <div class="container text-start"><p class="mb-0 fw-semibold">ASSIGNESS</p></div>
          </div>
        </div>

        <div v-if="loading" class="text-center my-3">Loading...</div>

        <div v-for="item in tasks" :key="item.id" class="container d-flex align-items-center p-3 border rounded mb-1 shadow-sm">
          <p class="w-75 mb-0 fw-semibold">{{ item.task }}</p>
          <div class="container d-flex justify-content-between">
            <div class="container text-center">
              <p class="mb-0 fw-normal">{{ item.endDate }}</p>
            </div>
            <div class="container text-center">
              <span class="badge" :class="compareStrings(item.status)">{{ item.status }}</span>
            </div>
            <div class="container text-start">
              <p class="mb-0 fw-normal">{{ item.assignee }}</p>
            </div>
          </div>
        </div>

        <div class="container text-end pt-4  mt-3 mb-4 ">
        <button
          class="btn btn-outline-primary shadow-sm px-4 py-2"
          style="cursor: pointer; width: auto;"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal">
          <i class="fa-solid fa-bars-progress"></i>&nbsp; Add New Task
        </button>
      </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Add New Task</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-floating mb-3">
                    <input v-model="task" type="text" class="form-control" id="floatingInputTask" placeholder="Task" @input="saveToLocalStorage('task', task)">
                    <label for="floatingInputTask">What is the task?</label>
                </div>
                <div class="form-floating mb-3">
                    <input v-model="endDate" type="date" class="form-control" id="floatingInputEndDate" placeholder="End Date" @input="saveToLocalStorage('endDate', endDate)">
                    <label for="floatingInputEndDate">End Date</label>
                </div>
                <div class="form-floating mb-3">
                    <select v-model="status" class="form-select" id="floatingSelectStatus" @change="saveToLocalStorage('status', status)">
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Finished">Finished</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <label for="floatingSelectStatus">Status</label>
                </div>
                <div class="form-floating mb-3">
                    <input v-model="assignee" type="text" class="form-control" id="floatingInputAssignee" placeholder="Assignee(s)" @input="saveToLocalStorage('assignee', assignee)">
                    <label for="floatingInputAssignee">Assignee(s)</label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" @click="addTask">+ Add Task</button>
            </div>
        </div>
    </div>
</div>

  <RouterView />
</template>

<style>
#task:hover, #addTask:hover {
  background-color: rgba(0, 0, 0, 0.041);
}
.v-hidden {
  visibility: hidden;
}
</style>
