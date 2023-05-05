<template>
  <div v-if="type === 'auth_group_list'" class="p-8" style="min-width: 50vw;">
    <v-text-field 
      :label="'Group Name'"
      v-model="groupName"
    ></v-text-field>    
    <v-autocomplete
      chips
      label="Users"
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
  </div>
  <div v-else class="detail-data">    
    <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
      <template v-if="props.data.fields[field].attributes.read_only === true"></template>
      <template v-else-if="props.data.fields[field].type === 'boolean'">
        <v-checkbox
          :label="props.data.fields[field].attributes.label"
          v-model="values[field]"
        ></v-checkbox>
      </template>
      <template v-else-if="props.data.fields[field].type === 'choice'">
        <label>{{ props.data.fields[field].attributes.label }}</label>
        <v-select
          item-title="text"
          item-value="value"
          :items="props.data.fields[field].attributes.choices"
          :label="props.data.fields[field].attributes.label"
          v-model="values[field]"
        ></v-select>
      </template>
      <template v-else-if="props.data.fields[field].type === 'datetime'">
        <v-date-picker v-model="values[field]"></v-date-picker>
      </template>
      <template v-else>
        <v-text-field 
          :label="props.data.fields[field].attributes.label"
          v-model="values[field]"
          :hint="props.data.fields[field].attributes.hint"
        ></v-text-field>
      </template>
    </div>
    <v-btn color="primary" variant="tonal" block @click="save">Save</v-btn>
  </div>
  </template>
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router'
  import localConfig from "@/local_config"
  import axios from '../plugins/axios'
  import { splitAndReplace, endsWithList, removeListSuffix } from "../plugins/helpers"
  
  const apiKey = localConfig.api
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
  })
  
  const values = ref({})
  const route = useRoute()
  const param = ref(route.params.page)
  const chips = ref([])
  const groupName = ref("")
  const users = ref([])
  const models = ref([])
  const modelsAdded = ref([])
  const searchString = ref("")
  const permissions = ref({})

  const save = async () => {
    let pathSepar = splitAndReplace(removeListSuffix(param.value))
    if(endsWithList(param.value)) 
      try {
        await axios.post(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/`, values.value)
        location.reload()
      } catch (error) {
        console.error(error.type);
      }
  }

const getData = async () => {
	try {
			const response = await axios.get(`${apiKey}models`);
			models.value = response.data
	} catch (error) {
			console.log(error.message);
	}
}

const fetchUsers = async (searchValue) => {
  try {
    const response = await axios.get(`${apiKey}auth/user/`,{ params: { search: searchValue } })
    console.log(response)
    response.data.results.map($ => {
      users.value.push({value: $.id, text: $.email})
    })
  } catch (error) {
    console.error(error.type);
  }
}

const deleteFromModels = (modelString) => {
  console.log('del',modelString)
  models.value.push(modelString)
  modelsAdded.value = modelsAdded.value.filter((j, i) => j !== modelString);
  models.value = models.value.slice().sort()
  delete permissions.value[modelString]
}

const addModel = (modelString) => {
  console.log('add',modelString)
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
  let usersArr = []  
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
  let groupInfo = {
    id: "",
    name: groupName.value,
    permissions: permissionsArr,
    users: chips.value
  }
  try {
    await axios.post(`${apiKey}permissions/`, groupInfo)
    location.reload()
  } catch(e) {
    console.log(e.message)
  }
}

onMounted(() => {
  if(props.type === 'auth_group_list')
    getData()
});

</script>
  
<style scoped>
.detail-data {
  width: 500px;
  padding: 30px;
  margin: 0 auto
}
.detail-data-item {
  margin-bottom: 20px;
}
.hidden {
  display: none;
}
</style>