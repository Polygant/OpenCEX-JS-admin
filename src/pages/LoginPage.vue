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
import localConfig from "@/local_config"
import { useRouter } from 'vue-router'
const apiKey = localConfig.api
const user = ref("trade@polygant.net")
const pass = ref("1234qwer")
const code = ref("")
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