<template>
  <v-text-field 
    :label="'Group Name'"
    v-model="groupName"
  ></v-text-field> 
  <v-autocomplete
    chips
    label="Users"
    clearable
    :items="users"
    item-title="text"
    item-value="value"
    v-model="chips"
    multiple
    @update:search="fetchUsers"
  ></v-autocomplete>
  <v-btn color="primary" variant="tonal" @click="createGroup()">Save</v-btn>
  <div class="grid grid-cols-2 gap-8">
    <v-card>
      <template v-slot:title>
        Available models
      </template>
      <template v-slot:text>
        <div v-for="i in models" :key="i" @click="addModel(i)" class="py-1 cursor-pointer">
          {{ i }}
        </div>
      </template>
    </v-card>
    <v-card>
      <template v-slot:title>
        Selected models
      </template>
      <template v-slot:text>
        <div v-for="i in modelsAdded" :key="i">
          <v-icon :color="'#E15241'" @click="deleteFromModels(i)" icon="mdi-delete"></v-icon>
          <span>{{ i }}</span>
          <div class="flex">
            <v-checkbox
              :label="'View'"
              v-model="permissions[i].view"               
            ></v-checkbox>
            <v-checkbox
              :label="'Add'"
              v-model="permissions[i].add"
            ></v-checkbox>
            <v-checkbox
              :label="'Change'"
              v-model="permissions[i].change"
            ></v-checkbox>
            <v-checkbox
              :label="'Delete'"
              v-model="permissions[i].delete"
            ></v-checkbox>
          </div>
        </div>
      </template>
    </v-card>
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
import { onMounted, ref } from 'vue';
import localConfig from "@/local_config"
import axios from '../plugins/axios'
import { findErrMessage } from "../plugins/helpers"  
const apiKey = localConfig.api

const chips = ref([])
const groupName = ref("")
const users = ref([])
const models = ref([])
const modelsAdded = ref([])
const permissions = ref({})
const alert = ref(false)
const alertText = ref('')
const props = defineProps({
  id: {
    type: Object,
    default: ''
  },
})

const getData = async () => {
	try {
			const response = await axios.get(`${apiKey}models`);
			models.value = response.data
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

const fetchUsers = async (searchValue) => {
  try {
    const response = await axios.get(`${apiKey}auth/user/`,{ params: { search: searchValue } })
    response.data.results.map($ => {
      users.value.push({value: $.id, text: $.email})
    })
  } catch (error) {
    showAlert(error)    
  }
}

const deleteFromModels = (modelString) => {
  models.value.push(modelString)
  modelsAdded.value = modelsAdded.value.filter((j, i) => j !== modelString);
  models.value = models.value.slice().sort()
  delete permissions.value[modelString]
}

const addModel = (modelString) => {
  models.value = models.value.filter((j, i) => j !== modelString)
  modelsAdded.value.push(modelString)
  permissions.value[modelString] = {
    add: true,
    change: true,
    delete: true,
    view: true
  }
}

const createGroup = async () => {
  let permissionsArr = []
  Object.keys(permissions.value).map($ => {
    permissionsArr.push(
      {
        modelName: $,
        permissions: {
          add: permissions.value[$].add,
          change: permissions.value[$].change,
          delete: permissions.value[$].delete,
          view: permissions.value[$].view,
        }
      }
    )
  })
  let tempUsers = []
  chips.value.map($ => {
    if($.value) tempUsers.push($.value) 
    else tempUsers.push($)
  })
  let groupInfo = {
    id: props.id,
    name: groupName.value,
    permissions: permissionsArr,
    users: tempUsers
  }
  console.log(groupInfo)
  try {
    if(props.id !== '')
      await axios.put(`${apiKey}permissions/`, groupInfo)
    else 
      await axios.post(`${apiKey}permissions/`, groupInfo)
    location.reload()
  } catch(e) {
    showAlert(error)    
  }
}

const getProfile = async () => {
  try {
    const response = await axios.get(`${apiKey}auth/group/${props.id}/`)
    const userData = response.data
    groupName.value = userData.name
    userData.users.map($ => {
      chips.value.push({
        value: $.id,
        text: $.email
      })
    })
    userData.permissions.map($ => {
      modelsAdded.value.push($.name)
      permissions.value[$.name] = {
        add: true,
        change: true,
        delete: true,
        view: true
      }
    })
  } catch (error) {
    showAlert(error)    
  }
}

onMounted(() => {
  getData()
  if(props.id !== '')
    getProfile()
});
</script>