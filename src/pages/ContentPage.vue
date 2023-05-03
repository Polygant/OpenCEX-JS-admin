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
  v-model="actDialog"
  width="auto"
>
  <v-card>
    <div class="p-8">
      Do {{  act.name }} ?
    </div>
    <v-card-actions class="flex-wrap">
      <v-btn color="primary" block @click="submitAct()">Do</v-btn>
      <v-btn color="primary" block @click="actDialog = false">Close</v-btn>
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
  <div class="flex">
    <div v-click-outside-element="() => filterShow = false">
      <div v-if="filterShow" class="filters-block">
        <div v-for="filter in Object.keys(filters)" :key="filter">
          <template v-if="filters[filter].type !== 'datetime'">
            <label>{{ filters[filter].attributes.label }}</label>
            <div class="flex" v-if="filters[filter].type === 'integer'">
              <v-text-field
                type="number"
                v-model="filters[filter].on"
              ></v-text-field>
              <v-icon class="mt-4" :color="'#E15241'" @click="() => filters[filter].on = ''" icon="mdi-close"></v-icon>
            </div>      
            <div class="flex" v-else-if="filters[filter].type === 'choice'">
              <v-select
                item-title="text"
                item-value="value"
                v-model="filters[filter].on"
                :items="[{ value: '', text: 'Not Set' }, ...filters[filter].attributes.choices]"
              ></v-select>
              <v-icon class="mt-4" :color="'#E15241'" @click="() => filters[filter].on = ''" icon="mdi-close"></v-icon>
            </div>
            <div class="flex" v-else-if="filters[filter].type === 'boolean'">
              <v-switch
                v-model="filters[filter].on"
                hide-details
                inset
              ></v-switch>
              <v-icon class="mt-4" :color="'#E15241'" @click="() => filters[filter].on = ''" icon="mdi-close"></v-icon>
            </div>
            <div class="flex" v-else>
              {{ filters[filter].type }}
              <v-text-field 
                v-model="filters[filter].on"
              ></v-text-field>
              <v-icon class="mt-4" :color="'#E15241'" @click="() => filters[filter].on = ''" icon="mdi-close"></v-icon>
            </div>
          </template>
        </div>
        <v-btn color="primary" block @click="clearFilter">Clear filter</v-btn>
      </div> 
      <v-btn @click="() => filterShow = !filterShow" class="content-page__btn" prepend-icon="mdi-filter-variant-plus">
        Add filter
      </v-btn>
    </div>
    <v-btn class="content-page__btn" prepend-icon="mdi-plus" @click="getCreateData">
      Create
    </v-btn>
    <!-- <v-btn class="content-page__btn" prepend-icon="mdi-download">
      Export
    </v-btn> -->
  </div>
</div>
<div class="relative" v-click-outside-element="() => customizeFields = false">
  <div class="customize-fields" v-if="customizeFields">
    <div v-for="item in Object.keys(headersCustom[param])" :key="item" style="margin-bottom: -30px;">
      <v-checkbox
        v-if="item !== 'controls' && item !== 'actions' "
        :label="item"
        v-model="headersCustom[param][item]"
      ></v-checkbox>
    </div>
  </div>
  <v-btn color="primary" class="inline-block ml-8" @click="customizeFields = !customizeFields">Customize fields</v-btn>
</div>
<div v-if="showActs" class="flex actions-line">
  <div v-for="act in [...info.actions, ...info.global_actions]" class="mr-4">
    <v-btn color="primary" class="inline-block ml-8" @click="doAct(act)">{{ act.name }}</v-btn>
  </div>  
</div>
<div class="content-page-table">
  <template v-if="!data.results || data.results.length === 0">
    <div class="text-center">No data available</div>
  </template>
  <v-data-table
    v-else
    :headers="headerShow"
    :items="data.results"
    :hide-default-header="true"
    :hide-default-footer="true"
    disable-pagination    
  >
  <template v-slot:item="{ item }">
    <tr>
      <td v-for="i in headerShow" :class="{'checks' : i.key === 'control'}">
        <div v-if="i.key === 'control'">
          <input type="checkbox" v-model="selected[item.columns['id']]" />
        </div>
        <div v-else-if="i.key === 'user' && typeof item.columns[i.key] === 'object'" class="content-page-table__cell">
          {{ item.columns[i.key]?.value  }}
        </div>
        <div v-else-if="i.key === 'preview_image' || i.key === 'announce_image' || i.key === 'logo' ">
          <img width="100" :src="item.columns[i.key]" />
        </div>
        <template v-else-if="info.list_fields[i.key]?.type === 'datetime'">
          {{ moment(item.columns[i.key]).format('DD.MM.YYYY HH:MM:ss') }}
        </template>
        <template v-else-if="info.list_fields[i.key]?.type === 'choice'">
          {{ getChooseValue(i.key, item.columns[i.key]) }}
        </template>
        <div v-else-if="i.key === 'actions'" class="action-cell content-page-table__cell">
          <v-icon v-if="haveIcon('show')" :color="'#4994EC'" @click="getDetailData(item.columns['id'])" icon="mdi-eye"></v-icon>
          <v-icon v-if="haveIcon('edit')" :color="'#4994EC'" @click="getEditData(item.columns['id'])" icon="mdi-pencil"></v-icon>
          <v-icon v-if="haveIcon('create')" :color="'#67AD5B'" icon="mdi-content-duplicate"></v-icon>
          <v-icon v-if="haveIcon('delete')" :color="'#E15241'" @click="deleteItemDialog(item.columns['id'])" icon="mdi-delete"></v-icon>
        </div>
        <div v-else class="content-page-table__cell">{{ item.columns[i.key] }}</div>
        <div class="hidden">
          <template v-if="info.list_fields[i.key]?.attributes.read_only !== true && info.list_fields[i.key]?.type !== 'datetime' && i.key !== 'control' && i.key !== 'actions' && info.list_fields[i.key]?.type !== 'choice'">
            <template v-if="info.list_fields[i.key]?.type === 'boolean'">
              <v-checkbox
                @input="(event) => selectEditField(event, i.key)"
                :data-field="i.key"
              ></v-checkbox>
            </template>           
            <!-- <template v-else-if="info.list_fields[i.key]?.type === 'choice'">              
              <v-select
                item-title="text"
                item-value="value"
                :items="info.list_fields[i.key]?.attributes.choices"
                :label="info.list_fields[i.key]?.attributes.label"
                @update:modelValue="(event) => selectEditField(event, i.key)"
                :value="item.columns[i.key]"
              ></v-select>
            </template> -->
            <template v-else>
              <v-text-field 
                :hint="info.list_fields[i.key]?.attributes.hint"
                @input="(event) => selectEditField(event, i.key)"
                :value="item.columns[i.key]"
              ></v-text-field>
            </template>
          </template>
        </div>
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
import { watch, ref, onBeforeMount, computed } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useNavStore } from '@/stores/nav'
import Show from '@/components/Show.vue'
import Edit from '@/components/Edit.vue'
import Create from '@/components/Create.vue'
import localConfig from "@/local_config"
import _ from 'lodash'
import { splitAndReplace, endsWithList, removeListSuffix } from "@/plugins/helpers"
import moment from 'moment'

const nav = useNavStore()

const apiKey = localConfig.api
const baseUrl = localConfig.base

const search = ref('')
const perPage = ref(10)

const pageNum = ref(1)
const pageCount = ref(1)

const route = useRoute()
const router = useRouter()
const param = ref(route.params.page)

const infoDialog = ref(false)
const editDialog = ref(false)
const createDialog = ref(false)
const deleteDialog = ref(false)
const actDialog = ref(false)
const filterShow = ref(false)
const showData = ref({})
const deleteItemId = ref("")
const customizeFields = ref(false)
const headers = ref([])
const headersCustom = ref({})
const info = ref([])
const data = ref([])
const addition = ref([])
const filters = ref({})
const act = ref({})
const selected = ref({})
const lifeEdit = ref({})

onBeforeMount(() => {
  pageNum.value = 1
  pageCount.value = 1
  getData(param.value)
})

watch(
  () => route.params.page,
  (newValue) => {
      selected.value = {}
      param.value = newValue;
      getData(newValue)
  }  
)
watch(search, _.debounce((newVal) => {
  getPaginateData(param.value)
}, 1002))

const selectEditField = (target, elem) => {
  console.log(target, elem)
}

const getChooseValue = (field, value) => {
  let s = info.value.list_fields[field]?.attributes?.choices?.filter(i => i.value === value)?.[0]?.["text"]
  return s
}

const clearFilter = () => {
  Object.keys(filters.value).map($ => {
    filters.value[$]['on'] = ""
  })
}

const doAct = async (actObj) => {
  act.value = actObj
  actDialog.value = true
}

const submitAct = async () => {
  let ids = []
  Object.keys(selected.value).map($ => {
    if(selected.value[$]) ids.push(parseInt($))
  })
  try {
    await axios.post(`${act.value.url}`, {
      ids: ids,
    });
    selected.value = {}
    getPaginateData(param.value)
    actDialog.value = false
  } catch (error) {
    console.log(error.type);
    actDialog.value = false
  }
}

const showActs = computed(() => {
  let sh = false
  Object.keys(selected.value).map($ => {
    if(selected.value[$]) sh = true
  })
  return sh
})

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

const headerShow = computed(() => {
  localStorage.setItem('customize', JSON.stringify(headersCustom.value))
  return headers.value.filter($ => headersCustom.value?.[param.value]?.[$.key])
})

const filterStr = computed(() => {
  let str = ""
  Object.keys(filters.value).map($ => {
    if(filters.value[$]?.on !== "" && filters.value[$]?.on !== undefined) {
      str += `&${$}=${filters.value[$]?.on}`
    }
  })
  return str
})

watch(filterStr, () => {
  getPaginateData(param.value)
})

const getData = async (path) => { 
  let pathSepar = splitAndReplace(removeListSuffix(path))
  await getActions()
  addition.value = await nav.getResources.filter($ => $.name === removeListSuffix(path))  
  if(endsWithList(path)) 
    try {
      const options = await axios.options(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/`);
      info.value = options.data
      filters.value = options.data.filters
      Object.keys(filters.value).map($ => filters.value[$]['on'] = "")
      const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/?limit=${perPage.value}&offset=0`);
      data.value = response.data
      pageCount.value = response.data.count / 10
      headers.value = normFields(info.value.list_fields)
      const customizeFromString = localStorage.getItem('customize')
      if(customizeFromString.length > 3) {
        const customizeFrom = JSON.parse(customizeFromString)
        if(Object.keys(customizeFrom).length === 0) {
          headersCustom.value[param.value] = {}
          headers.value.map($ => {
            headersCustom.value[param.value][$.key] = true
          })
        } else {
          if(!customizeFrom[param.value] || Object.keys(customizeFrom?.[param.value]).length === 0) {
            headersCustom.value[param.value] = {}
            headers.value.map($ => {
              headersCustom.value[param.value][$.key] = true
            })
            localStorage.setItem('customize', JSON.stringify(headersCustom.value))
          } else {
            headersCustom.value = customizeFrom
          }
        }
      } else {
        headersCustom.value[param.value] = {}
        headers.value.map($ => {
          headersCustom.value[param.value][$.key] = true
        })
        localStorage.setItem('customize', JSON.stringify(headersCustom.value))
      }
      
      console.log(headers.value)
    } catch (error) {
      console.error(error.type);
    }
}

watch(pageNum, (newVal) => {
  getPaginateData(param.value)
})

const getPaginateData = async (path) => { 
  let pathSepar = splitAndReplace(removeListSuffix(path))
  if(endsWithList(path)) 
    try {
      const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/?limit=10&offset=${(pageNum.value - 1) * 10}${filterStr.value}&search=${search.value}`);
      data.value = response.data
      pageCount.value = response.data.count / 10
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
.filters-block {
  position: absolute;
  background: #FFF;
  padding: 20px;
  right: 32px;
  top: 147px;
  width: 400px;
  z-index: 2;
  border: 1px solid #ccc;
}
.customize-fields {
  position: absolute;
  background: #FFF;
  padding: 20px;
  left: 32px;
  top: 45px;
  min-width: 200px;
  z-index: 2;
  border: 1px solid #ccc;
}
.actions-line {
  padding: 20px;
  background: #CCC;
  margin-top: 10px;
}
</style>