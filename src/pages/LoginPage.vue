<template>
  <div class="wrapper">
    <v-sheet width="300" class="mx-auto login-block">
      <h1 class="login-block-h1">Admin Panel</h1>
      <v-form fast-fail @submit.prevent>
        <v-text-field
          v-model="user"
          label="Login"
        ></v-text-field>

        <v-text-field
          v-model="pass"
          label="Password"
          type="password"
        ></v-text-field>

        <v-text-field
          v-model="code"
          label="2FA code"
        ></v-text-field>

        <v-btn block class="mt-2" variant="tonal" @click="login()">Submit</v-btn>
      </v-form>
    </v-sheet>
  </div>
  <v-alert
    class="alert-block"
    v-if="alert"
    color="pink"
    dark
    border="top"
    icon="mdi-home"
    transition="scale-transition"
  >
    {{ alertText }}
  </v-alert>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import localConfig from "@/local_config"
import { useRouter } from 'vue-router'
import { findErrMessage } from "@/plugins/helpers"
const apiKey = localConfig.api
const user = ref("")
const pass = ref("")
const code = ref("")
const alert = ref(false)
const alertText = ref('')
const router = useRouter()
const login = async () => {
  try {
    const response = await axios.post(`${apiKey}login/`, {
      username: user.value,
      password: pass.value,
      otp_token: code.value
      
    });    
    localStorage.setItem("jwt_token", response.data.access_token)
    router.push({path: '/page/dashboard'})
  } catch (error) {
    showAlert(error)
  }
}

const showAlert = (err) => {
  const alertMessage = findErrMessage(err)
  if(alertMessage) {
    alert.value = true
    alertText.value = alertMessage
    setTimeout(() => {
      alert.value = false
      alertText.value = ''
    }, 3000)
  }
}

</script>

<style>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #38485C;
  margin-left: -210px;
}
input {
    border: 1px solid #CCC;
    padding: 5px;
}
label {
    display: block;
    width: 150px;
}
.alert-block {
  position: fixed !important;
  bottom: 0 !important;
  right: 0 !important;
  width: 520px !important;
  z-index: 22 !important;
}
.login-block {
  padding: 40px;
}
.login-block-h1 {
  font-size: 25px;
  font-weight: bold;
  padding-bottom: 10px;
  text-align: center;
}
</style>