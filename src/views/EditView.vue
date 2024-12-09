<script setup>
import { ref, onMounted, watch } from 'vue'
import { db } from '../firebase/firebase.js'
import { doc, getDoc, updateDoc, deleteDoc  } from 'firebase/firestore'
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

const getTaskID = defineProps(['id'])

onMounted(async () => {

    const taskID = getTaskID.id

    const docRef = doc(db, "tasks", taskID)
    const docSnap = await getDoc(docRef)

    task.value = docSnap.data().task
    endDate.value = docSnap.data().endDate
    status.value = docSnap.data().status
    assignee.value = docSnap.data().assignee
})

const task = ref('')
const endDate = ref('')
const status = ref('')
const assignee = ref('')
const taskID = getTaskID.id

// let newTask = ref({})

// watch([task, endDate, status, assignee], ([newTaskValue, newEndDateValue, newStatusValue, newAssigneeValue]) => {
//     // updateDoc(doc(db, 'tasks', taskID), {
//     // task: newTaskValue,
//     // endDate: newEndDateValue,
//     // status: newStatusValue,
//     // assignee: newAssigneeValue
//     // })

//     const modifiedTask = {
//         task: newTaskValue,
//         endDate: newEndDateValue,
//         status: newStatusValue,
//         assignee: newAssigneeValue
//     }
//     newTask = JSON.parse(JSON.stringify(modifiedTask))

// })

const updateTask = () => {
    updateDoc(doc(db, 'tasks', taskID), {
        task: task.value,
        endDate: endDate.value,
        status: status.value,
        assignee: assignee.value
    })

    router.push('/')

}

const deleteTask = () => {
  deleteDoc(doc(db, 'tasks', taskID))
  router.push('/')
}
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="container col-md-6">
                <h3 class="text-center mb-3"><i class="fa-solid fa-pen-to-square"></i> Edit Task</h3>
                <div class="card">
                    <div class="card-header d-flex align-items-center">
                        <RouterLink to="/" class="fs-5 text-decoration-none text-dark fw-bold me-2"> <i class="fa-solid fa-arrow-left"></i></RouterLink>
                        <p class="fs-5 mb-0">Go Back</p>
                    </div>
                    <div class="card-body">
                        <div class="form-floating mb-3">
                        <input v-model="task" type="text" class="form-control" id="floatingInput" placeholder="text">
                        <label for="floatingInput">What is the task?</label>
                        </div>
                        <div class="form-floating mb-3">
                        <input v-model="endDate" type="date" class="form-control" id="floatingInput" placeholder="text">
                        <label for="floatingInput">End Date</label>
                        </div>
                        <div class="form-floating mb-3">
                        <select v-model="status" class="form-select" id="floatingSelect" aria-label="Floating label select example">
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Finished">Finished</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <label for="floatingSelect">Status</label>
                        </div>
                        <div class="form-floating mb-3">
                        <input v-model="assignee" type="text" class="form-control" id="floatingInput" placeholder="text">
                        <label for="floatingInput">Assignee(s)</label>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="float-end">
                            <a class="btn btn-danger me-3" id="delete" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="fa-solid fa-trash"></i> Delete</a>
                            <a class="btn btn-success" @click="updateTask()"> <i class="fa-solid fa-floppy-disk"></i> Update</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5 text-danger" id="exampleModalLabel"><i class="fa-solid fa-triangle-exclamation"></i> Delete Confirmation: </h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p class="fw-normal">Are you sure you want to delete this task "{{ task }}"?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteTask()">Delete Task</button>
            </div>
          </div>
        </div>
      </div>
<RouterView />
</template>

<style>
    #header {
        width: 50% !important;
    }
</style>
