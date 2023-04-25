<template>
<div class="breadcrumbs">
  <div class="breadcrumbs__link" @click="router.push({path: `/${baseUrl}/dashboard`})">Home</div>
   /
  {{ info.name }}
</div>
<v-dialog
  v-model="infoDialog"
  width="auto"
>
  <v-card prepend-icon="mdi-home">
    <Show :data="showData" />
    <v-card-actions>
      <v-btn color="primary" block @click="infoDialog = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog
  v-model="editDialog"
  width="auto"
>
  <v-card prepend-icon="mdi-home">
    <Edit :data="showData" />
    <v-card-actions>
      <v-btn color="primary" block @click="editDialog = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog
  v-model="createDialog"
  width="auto"
>
  <v-card prepend-icon="mdi-plus">
    <v-card-title class="text-h5">
      Create
    </v-card-title>
    <Create :data="showData" />
    <v-card-actions>
      <v-btn color="primary" block @click="createDialog = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<v-dialog
  v-model="deleteDialog"
  width="auto"
>
  <v-card prepend-icon="mdi-home">
    <div class="p-8">
      Are you shure to delete this?
      <v-card-actions class="flex-wrap">
        <v-btn color="primary" block @click="deleteItem">Yes</v-btn><br/>
        <v-btn color="primary" block @click="deleteDialog = false">Close</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</v-dialog>

<div class="flex justify-between p-8">
  <v-text-field
    v-model="search"
    append-icon="mdi-magnify"
    label="Search"
    single-line
    hide-details
    class="content-page__search"
  >
  </v-text-field>
  <div>
    <v-btn class="content-page__btn" prepend-icon="mdi-filter-variant-plus">
      Add filter
    </v-btn>
    <v-btn class="content-page__btn" prepend-icon="mdi-plus" @click="getCreateData">
      Create
    </v-btn>
    <v-btn class="content-page__btn" prepend-icon="mdi-download">
      Export
    </v-btn>
  </div>
</div>
<div class="content-page-table">  
  <v-data-table
    :headers="headers"
    :items="data.results"
    :hide-default-header="true"
    :hide-default-footer="true"
    disable-pagination
  >
  <template v-slot:item="{ item }">
    <tr>
      <td v-for="i in headers" :class="{'checks' : i.key === 'control'}">   
        <div v-if="i.key === 'control'">
          <input type="checkbox" />
        </div>
        <div v-else-if="i.key === 'user'" class="content-page-table__cell">
          {{ item.columns[i.key]?.value  }}
        </div>
        <div v-else-if="i.key === 'preview_image' || i.key === 'announce_image' || i.key === 'logo' ">
          <img width="100" :src="item.columns[i.key]" />
        </div>
        <div v-else-if="i.key === 'actions'" class="action-cell content-page-table__cell">
          <v-icon v-if="haveIcon('show')" :color="'#4994EC'" @click="getDetailData(item.columns['id'])" icon="mdi-eye"></v-icon>
          <v-icon v-if="haveIcon('edit')" :color="'#4994EC'" @click="getEditData(item.columns['id'])" icon="mdi-pencil"></v-icon>
          <v-icon v-if="haveIcon('create')" :color="'#67AD5B'" icon="mdi-content-duplicate"></v-icon>
          <v-icon v-if="haveIcon('delete')" :color="'#E15241'" @click="deleteItemDialog(item.columns['id'])" icon="mdi-delete"></v-icon>
        </div>
        <div v-else class="content-page-table__cell">{{ item.columns[i.key] }}</div>
      </td>
    </tr>
  </template>
  </v-data-table>
  <div class="text-center">
    <v-pagination
      v-model="pageNum"
      :length="pageCount"
    ></v-pagination>
  </div>
</div>

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import axios from '../../src/plugins/axios';
import { watch, ref, onBeforeMount } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useNavStore } from '@/stores/nav'
import Show from '@/components/Show.vue'
import Edit from '@/components/Edit.vue'
import Create from '@/components/Create.vue'
import localConfig from "@/local_config"
import _ from 'lodash'

const nav = useNavStore()

const apiKey = localConfig.api
const baseUrl = localConfig.base

const search = ref('')
const perPage = ref(10)

const pagination = ref({
  page: 2,
  itemsPerPage: 12,
  pageStart: 1,
  pageStop: 30,
  pageCount: 30,
})


const pageNum = ref(1)
const pageCount = ref(1)

const route = useRoute()
const router = useRouter()
const param = ref(route.params.page)

const infoDialog = ref(false)
const editDialog = ref(false)
const createDialog = ref(false)
const deleteDialog = ref(false)

const showData = ref({})

const deleteItemId = ref("")

onBeforeMount(() => {
  pageNum.value = 1
  pageCount.value = 1
  getData(param.value)
}),

watch(
  () => route.params.page,
  (newValue) => {
      param.value = newValue;
      getData(newValue)
  }
)
watch(search, _.debounce((newVal) => {
  searchStr(param.value, newVal)
}, 1002))

//////

function splitAndReplace(str) {
  const parts = str.split('_');
  const lastPart = parts.pop();
  const firstPart = parts.join('_');

  return [firstPart, lastPart];
}


const endsWithList = (str) => {
  return str.endsWith('_list');
}

const removeListSuffix = (str) => {
  const suffix = '_list';

  if (str.endsWith(suffix)) {
    return str.slice(0, -suffix.length);
  }
  
  return str;
}
///////

const normFields = (arr) => {
  let res = []
  res.push(
    {
      title: "",
      key: "control",
      sortable: false,
    }
  )
  Object.keys(arr).map($ => {
    if($ !== "_label")
      res.push(
        {
          title: arr[$].attributes.label,
          key: arr[$].source,
          sortable: false,
        }
      )
  })
  res.push(
    {
      title: "",
      key: "actions",
      sortable: false,
    }
  )
  return res
}

const haveIcon = (icon) => addition.value[0]?.actions?.includes(icon)

const getActions = async () => {
  try {
    const response = await axios.get(`${apiKey}resources/`);
    resources.value = response.data
    nav.setResources(response.data)
  } catch (error) {
    console.log(error.type);
  }
} 

const headers = ref([])
const info = ref([])
const data = ref([])
const addition = ref([])

const getData = async (path) => { 
  let pathSepar = splitAndReplace(removeListSuffix(path))
  await getActions()
  addition.value = await nav.getResources.filter($ => $.name === removeListSuffix(path))  
  if(endsWithList(path)) 
    try {
      const options = await axios.options(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/`);
      info.value = options.data
      const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/?limit=${perPage.value}&offset=0`);
      data.value = response.data
      pageCount.value = response.data.count / 10
      headers.value = normFields(info.value.list_fields)      
    } catch (error) {
      console.error(error.type);
    }
}

watch(pageNum, (newVal) => {
  getPaginateData(param.value)
})

const paginate = (val) => {
  pagination.value = val
  getPaginateData(param.value)
}

const getPaginateData = async (path) => { 
  let pathSepar = splitAndReplace(removeListSuffix(path))
  if(endsWithList(path)) 
    try {
      const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/?limit=10&offset=${(pageNum.value - 1) * 10}`);
      data.value = response.data
      pageCount.value = response.data.count / 10
    } catch (error) {
      console.error(error.type);
    }
}

const searchStr = async (path, str) => {
  let pathSepar = splitAndReplace(removeListSuffix(path))
  if(endsWithList(path)) 
    try {
      const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/?limit=10&offset=0&search=${str}`);
      data.value = response.data
    } catch (error) {
      console.error(error.type);
    }
}

const getDetailData = async (id) => {
  let pathSepar = splitAndReplace(removeListSuffix(param.value))
  if(endsWithList(param.value)) 
    try {
      const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${id}/?`);
      showData.value = { 
        list_fields: info.value.list_fields, 
        fields: info.value.fields, 
        data: response.data 
      }
      infoDialog.value = true
    } catch (error) {
      console.error(error.type);
    }
}

const getCreateData = async () => {
  let pathSepar = splitAndReplace(removeListSuffix(param.value))
  if(endsWithList(param.value)) 
    try {
      showData.value = { 
        list_fields: info.value.list_fields, 
        fields: info.value.fields, 
      }
      createDialog.value = true
    } catch (error) {
      console.error(error.type);
    }
}

const getEditData = async (id) => {
  let pathSepar = splitAndReplace(removeListSuffix(param.value))
  if(endsWithList(param.value)) 
    try {
      const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${id}/?`);
      showData.value = {
        list_fields: info.value.list_fields, 
        fields: info.value.fields, 
        data: response.data 
      }
      editDialog.value = true
    } catch (error) {
      console.error(error.type);
    }
}

const deleteItem = async () => {
  let pathSepar = splitAndReplace(removeListSuffix(param.value))
  if(endsWithList(param.value)) 
    try {
      await axios.delete(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${deleteItemId.value}/?`);
      deleteDialog.value = false
      location.reload()
    } catch (error) {
      console.error(error.type);
    }
}

const deleteItemDialog = (id) => {
  deleteItemId.value = id
  deleteDialog.value = true
}

</script>

<style>
.content-page-table {
  overflow-x: scroll;
  font-size: 11px;
}

.action-cell {
  display: flex;
  flex-wrap: nowrap;
}
.action-cell>i {
  margin-right: 10px;
}
.content-page-table__cell {
  font-size: 12px;
}
.checks {
  width: 20px;
}
.content-page__search {
  width: 350px !important;
  max-width: 350px;
}
.breadcrumbs {
  padding: 20px;
  display: flex;
}
.breadcrumbs__link {
  color: #5C92E5;
  border-bottom: 1px solid #5C92E5;
  cursor: pointer;
  display: block;
  margin-right: 6px;
}
.content-page__btn {
  margin-left: 20px;
}
.v-data-table-footer {
  display: none;
}
</style>