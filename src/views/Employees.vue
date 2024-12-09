

      <script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { db } from '../firebase/firebase.js'
import { collection, deleteDoc, addDoc, onSnapshot, doc, getDoc, query, orderBy } from 'firebase/firestore'

onMounted(() => {
  const q = query(collection(db, 'employees'), orderBy('lastname')); // Fetch data from Firestore with query clause

  onSnapshot(q, (querySnapshot) => {
    let empTmp = []
    querySnapshot.forEach((doc) => {
      const employee = {
        id: doc.id,
        lastname: doc.data().lastname,
        firstname: doc.data().firstname,
        gender: doc.data().gender,
        contactNo: doc.data().contactNo,
        position: doc.data().position
      }
      empTmp.push(employee)
    })

    employees.value = empTmp
    console.log(employees)
  })
})

const lastname = ref('')
const firstname = ref('')
const gender = ref('')
const contactNo = ref('')
const position = ref('')

const employees = ref([])

const addEmployee = () => {
  if (lastname.value != '' && firstname.value != '' && gender.value != '' && contactNo.value != '' && position.value != '') {
    const employee = {
        lastname: lastname.value,
        firstname: firstname.value,
        gender: gender.value,
        contactNo: contactNo.value,
        position: position.value
      }
    addDoc(collection(db, "employees"), employee)
    lastname.value = ''
    firstname.value = ''
    gender.value = ''
    contactNo.value = ''
    position.value = ''
  }
}
</script>

<template>

  <nav class="navbar navbar-expand-lg bg-primary p-3" id="navbar">
    <div class="container-lg">
      <RouterLink class="navbar-brand" to="/" style="margin-left: 10px; color:white;">IT Department Task Board</RouterLink>
    </div>
    <div class="navbar-collapse ms-5" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink
            class="nav-link btn btn-light me-2 px-3 py-2 rounded-pill"
            aria-current="page"
            to="/">
            Home
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link btn btn-light me-2 px-3 py-2 rounded-pill"
            to="/employees">
            Employees
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>


  <div class="container mt-3">
    <div class="row">
      <div class="container d-flex justify-content-between">
        <h3>Employees</h3> {{ firstname }}
      </div>
      <div class="container col-md-12">
        <div class="container d-flex align-items-center p-3">
          <p class="w-50 mb-0 fw-semibold">NAME</p>
          <div class="container d-flex justify-content-between">
            <div class="container">
              <p class="mb-0 fw-semibold">GENDER</p>
            </div>
            <div class="container">
              <p class="mb-0 fw-semibold">CONTACT #</p>
            </div>
            <div class="container text-start">
              <p class="mb-0 fw-semibold">POSITION</p>
            </div>
            <div class="container text-end">
              <p class="mb-0 fw-semibold">ACTIONS</p>
            </div>
          </div>
        </div>

        <div v-for="emp in employees" :key="emp.id" class="container d-flex align-items-center p-3 border rounded mb-1 shadow-sm bg-light-emphasis" id="employee">
          <p class="w-50 mb-0 fw-semibold">{{emp.lastname}}, {{emp.firstname}}</p>
          <div class="container d-flex justify-content-between">
            <div class="container">
              <p class="mb-0 fw-normal">{{emp.gender}}</p>
            </div>
            <div class="container">
              <p class="mb-0 fw-normal">{{emp.contactNo}}</p>
            </div>
            <div class="container text-start">
              <p class="mb-0 fw-normal">{{emp.position}}</p>
            </div>
            <div class="container" id="action">
              <div class="float-end">
                <RouterLink :to="{ name: 'employee', params: { id: emp.id }}" class="text-secondary" id="edit">
                  <i class="fa-solid fa-eye"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </i>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div class="container text-end pt-2 mt-3 mb-4">
          <button
            class="btn btn-outline-primary shadow-sm px-4 py-2"
            style="cursor: pointer; width: auto;"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal">
            <i class="fa-solid fa-user-plus"></i>&nbsp; Add New Employee
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Add new employee</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-floating mb-3">
            <input v-model="firstname" type="text" class="form-control" id="floatingInput" placeholder="text" required>
            <label for="floatingInput">First Name</label>
          </div>
          <div class="form-floating mb-3">
            <input v-model="lastname" type="text" class="form-control" id="floatingInput" placeholder="text">
            <label for="floatingInput">Last Name</label>
          </div>
          <div class="form-floating mb-3">
            <select v-model="gender" class="form-select" id="floatingSelect" aria-label="Floating label select example">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <label for="floatingSelect">Gender</label>
          </div>
          <div class="form-floating mb-3">
            <input v-model="contactNo" type="text" class="form-control" id="floatingInput" placeholder="text">
            <label for="floatingInput">Contact Number</label>
          </div>
          <div class="form-floating mb-3">
            <input v-model="position" type="text" class="form-control" id="floatingInput" placeholder="text">
            <label for="floatingInput">Position</label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-success" @click="addEmployee()">Add Employee</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  #navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1030;
  }

  body {
    padding-top: 80px;
  }

  #employee:hover, #addEmp:hover {
    background-color: rgba(0, 0, 0, 0.041);
  }
  #employee:hover #action {
    visibility: visible !important;
  }
  .v-hidden {
    visibility: hidden !important;
  }
  #edit:hover {
    opacity: 0.7;
  }
</style>
