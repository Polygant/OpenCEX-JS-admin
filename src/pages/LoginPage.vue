<template>
  <div class="wrapper">
    <v-sheet width="300" class="mx-auto">
      <v-form fast-fail @submit.prevent>
        <v-text-field
          v-model="user"
          label="Login"
        ></v-text-field>

        <v-text-field
          v-model="pass"
          label="Password"
        ></v-text-field>

        <v-text-field
          v-model="code"
          label="Code"
        ></v-text-field>

        <v-btn block class="mt-2" @click="login()">Submit</v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import axios from 'axios'

const user = ref("trade@polygant.net")
const pass = ref("1234qwer")
const code = ref("")

const login = async () => {
  try {
    const response = await axios.post('https://polyxdev.plgdev.com/apiadmin/login/', {
      username: user.value,
      password: pass.value,
      otp_token: code.value
      
    });
    console.log(response.data);
    localStorage.setItem("jwt_token", response.data.access_token)
  } catch (error) {
    console.error(error);
  }
}

</script>

<style>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
input {
    border: 1px solid #CCC;
    padding: 5px;
}
label {
    display: block;
    width: 150px;
}
</style>