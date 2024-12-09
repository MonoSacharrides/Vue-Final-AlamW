<template>
    <div class="container col-md-6 offset-md-3 mt-5">
        <div class="card p-5">
            <div v-show="error" class="alert alert-danger">
                {{ errorMsg }}
            </div>
            <div v-show="success" class="alert alert-success">
                {{ successMsg }}
            </div>
            <div class="form-group mb-3">
                <label for="email">Email</label>
                <input type="email" class="form-control" v-model="email">
            </div>
            <div class="form-group mb-3">
                <label for="password">Password</label>
                <input type="password" class="form-control" v-model="password">
            </div>
            <div class="d-flex">
                <div class="flex-g row-1">
                    <router-link to="login">Already have an account?</router-link>
                </div>
                <button class="btn btn-primary" @click="registerUser()">Register</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../firebase/firebase.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const errorMsg = ref('')
const success = ref('')
const successMsg = ref('')

const registerUser = () => {
    if(email.value != '' || password.value != '') {
        createuserWithEmailAndPassword(auth, email.value, password.value)
            .then((cred) => {
                console.log('user created', cred.user)
                email.value = ''
                password.value = ''
                error.value = false
                success.value = true
                successMsg.value = 'Registered Successfully'
            })
            .catch((err) => {
                error.value = true
                errorMsg.value = err.message
            })
    } else {
        error.value = true
        errorMsg.value = 'Please fill out all the fields'
    }
}
</script>
