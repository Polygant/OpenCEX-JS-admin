<template>  
  <div class="breadcrumbs">
    <router-link class="breadcrumbs__link" to="/page/dashboard">Home</router-link>
    <span class="ml-2 mr-3">/</span>
    <template  v-if="param !== 'dashboard'">
    {{ info.name }}
    </template>
  </div>
  <v-dialog
    v-model="infoDialog"
    width="auto"
  >
    <v-card prepend-icon="mdi-home">
      <Show :data="showData" />
      <div class="flex justify-center mb-6">
        <v-btn color="rgba(0, 0, 0, 0.52)" variant="outlined" @click="infoDialog = false">Close</v-btn>
      </div>
    </v-card>
  </v-dialog>
  
  <v-dialog
    v-model="editDialog"
    width="auto"
  >
    <v-card prepend-icon="mdi-home">
      <Edit :data="showData" :type="param" @close="editDialog = false" />
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
      <Create :data="showData" :type="param" @close="createDialog = false"/>
    </v-card>
  </v-dialog>
  
  <v-dialog
    v-model="actDialog"
    width="auto"
  >
    <v-card>
      <div class="p-8" style="min-width: 300px;">
        Do {{  act.name }} ?
        <div v-for="field in act.fields" :key="field.name">
          <div class="flex" v-if="field.type === 'integer'">
            <v-text-field
              variant="underlined"
              color="secondary"
              type="number"
              v-model="actFields[field.name].value"
              :label="actFields[field.name].label"
            ></v-text-field>
          </div>             
          <div class="flex" v-else-if="field.type === 'boolean'">
            <v-switch
              v-model="actFields[field.name].value"
              :label="actFields[field.name].label"
              hide-details
              inset
            ></v-switch>
          </div>
          <div class="flex" v-else>
            <v-text-field 
              variant="underlined"
              color="secondary"
              v-model="actFields[field.name].value"
              :label="actFields[field.name].label"
            ></v-text-field>
          </div>
        </div>
      </div>
      <v-card-actions class="flex-wrap">
        <v-btn color="primary" variant="flat" @click="submitAct()">Do</v-btn>
        <v-btn color="primary" variant="flat" @click="actDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
  <v-dialog
    v-model="actGlobalDialog"
    width="auto"
  >
    <v-card>
      <div class="p-8">
        Do {{  actGlobal.name }} ?      
        <div v-for="field in actGlobal.fields" :key="field.name">
          <div class="flex" v-if="field.type === 'integer'">
            <v-text-field
              variant="underlined"
              color="secondary"
              type="number"
              :label="actGlobalFields[field.name].label"
              v-model="actGlobalFields[field.name].value"
            ></v-text-field>
          </div>      
          <div class="flex" v-else-if="field.type === 'boolean'">
            <v-switch
              :label="actGlobalFields[field.name].label"
              v-model="actGlobalFields[field.name].value"
              hide-details
              inset
            ></v-switch>
          </div>
          <div class="flex" v-else>
            <v-text-field 
              variant="underlined"
              color="secondary"
              :label="actGlobalFields[field.name].label"
              v-model="actGlobalFields[field.name].value"
            ></v-text-field>
          </div>
        </div>
      </div>
      <v-card-actions class="flex-wrap">
        <v-btn color="primary" variant="flat" @click="submitGlobalAct()">Do</v-btn>
        <v-btn color="primary" variant="flat" @click="actGlobalDialog = false">Close</v-btn>
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
          <v-btn color="primary" variant="flat" @click="deleteItem">Yes</v-btn><br/>
          <v-btn color="primary" variant="flat" @click="deleteDialog = false">Close</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
  <div v-if="param === 'dashboard'">
    <Dashboard />
  </div>
  <v-card v-else class="mx-8 pb-3 overflow-visible" variant="elevated">
    <card-heading :title="info.name" color="rgb(var(--v-theme-primary))" :icon="currentIcon || 'mdi-view-grid'" />
    <div class="grid grid-cols-2 gap-8" style="align-items: center; padding-left: 20px;">
      <div class="flex">
        <v-text-field
          v-model="search"
          variant="underlined"
          color="secondary"
          clearable
          prepend-icon="mdi-magnify"
          label="Search"
          class="content-page__search"
        >
        </v-text-field>  
        <div class="relative pt-3" ref="filterBtn">
          <div class="customize-fields" v-if="customizeFields">
            <div v-for="item in Object.keys(headersCustom[param])" :key="item" style="margin-bottom: -30px;">
              <v-checkbox
                color="secondary"
                v-if="item !== 'controls' && item !== 'actions' "
                :label="item"
                v-model="headersCustom[param][item]"
              ></v-checkbox>
            </div>
          </div>
          <v-btn color="secondary" variant="text" class="inline-block ml-8" @click="customizeFields = !customizeFields">Customize fields</v-btn>
        </div> 
      </div>
      <div class="flex justify-end p-8">    
        <div class="flex">
          <div ref="filterBtn">
            <div v-if="filterShow" class="filters-block">
              <div v-for="filter in Object.keys(filters)" :key="filter">
                <template v-if="filters[filter].type !== 'datetime'">
                  <div class="flex" v-if="filters[filter].type === 'integer'">
                    <v-text-field
                      variant="underlined"
                      color="primary"
                      type="number"
                      :label="filters[filter].attributes.label"
                      v-model="filters[filter].on"
                    ></v-text-field>
                    <v-icon class="mt-4" :color="'#E15241'" @click="() => filters[filter].on = ''" icon="mdi-close"></v-icon>
                  </div>      
                  <div class="flex" v-else-if="filters[filter].type === 'choice'">
                    <v-select
                      variant="underlined"
                      color="primary"
                      item-title="text"
                      item-value="value"
                      v-model="filters[filter].on"
                      :label="filters[filter].attributes.label"
                      :items="[{ value: '', text: 'Not Set' }, ...filters[filter].attributes.choices]"
                    ></v-select>
                    <v-icon class="mt-4" :color="'#E15241'" @click="() => filters[filter].on = ''" icon="mdi-close"></v-icon>
                  </div>
                  <div class="flex" v-else-if="filters[filter].type === 'boolean'">
                    <v-switch
                      variant="underlined"
                      color="primary"
                      v-model="filters[filter].on"
                      :label="filters[filter].attributes.label"
                      hide-details
                    ></v-switch>
                    <v-icon class="mt-4" :color="'#E15241'" @click="() => filters[filter].on = ''" icon="mdi-close"></v-icon>
                  </div>
                  <div class="flex" v-else>
                    <v-text-field 
                      variant="underlined"
                      color="secondary"
                      :label="filters[filter].type"
                      v-model="filters[filter].on"
                    ></v-text-field>
                    <v-icon class="mt-4" :color="'#E15241'" @click="() => filters[filter].on = ''" icon="mdi-close"></v-icon>
                  </div>
                </template>
              </div>
              <v-btn color="primary" block variant="flat" @click="clearFilter">Clear filter</v-btn>
            </div> 
            <v-btn color="secondary" @click="() => filterShow = !filterShow" variant="text" class="content-page__btn" prepend-icon="mdi-filter-variant-plus">
              Add filter
            </v-btn>
            <v-btn color="secondary" class="content-page__btn" prepend-icon="mdi-plus" variant="text" @click="getCreateData">
              Create
            </v-btn>
          </div>
          <!-- <v-btn class="content-page__btn" variant="flat" prepend-icon="mdi-download">
            Export
          </v-btn> -->
        </div>
      </div>  
    </div>
    <div v-if="info?.global_actions?.length > 0 || (info?.actions?.length > 0 && showActs)" class="flex actions-line">
      <div v-for="act in info.global_actions" class="mr-4">
        <v-btn color="primary" variant="flat" class="inline-block ml-8" @click="doGlobalAct(act)">{{ act.name }}</v-btn>
      </div> 
      <div v-for="act in info.actions" class="mr-4">
        <v-btn color="primary" variant="flat" class="inline-block ml-8" @click="doAct(act)">{{ act.name }}</v-btn>
      </div>  
    </div>    
    <div class="flex justify-center" v-if="tableLoading">
      <v-progress-circular
          :size="70"
          :width="7"
          color="secondary"
          indeterminate
        ></v-progress-circular>
    </div>  
    <div class="content-page-table relative" v-else>
      <input type="checkbox" style="position: absolute; top: 20px; left: 15px;" v-model="checkAll" />
      <template v-if="!data.results || data.results.length === 0">
        <div class="text-center">No data available</div>
      </template>      
      <v-data-table        
        v-else
        :headers="headerShow"
        :items="data.results"
        :hide-default-header="true"
        :hide-default-footer="true"
      >
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="i in headerShow" :class="{'checks' : i.key === 'control'}" @click="() => selectEditField(item.id, i.key)">
              <div v-if="i.key === 'links'">
                <div v-for="it in getObj(item[i.key])">
                  {{ it.href }} - {{ it.title }}
                </div>
              </div>
              <div v-else-if="i.key === 'control'">
                <input type="checkbox" v-model="selected[item['id']]" />
              </div>
              <div v-else-if="i.key === 'user' && typeof item[i.key] === 'object'" class="content-page-table__cell">
                {{ item[i.key]?.value  }}
              </div>
              <div v-else-if="i.key === 'preview_image' || i.key === 'announce_image' || i.key === 'logo' ">
                <img width="100" :src="item[i.key]" />
              </div>
              <template v-else-if="info.list_fields[i.key]?.type === 'datetime'">
                {{ item[i.key] ? moment(item[i.key]).format('DD.MM.YYYY HH:mm:ss') : '-' }}
              </template>
              <template v-else-if="info.list_fields[i.key]?.source === 'two_fa'">
                <div class="content-page-table__cell-edit relative pl-8" v-if="isPageEditable && ifFieldCanEdit(i.key) && editionId === item.id" ref="target">
                  <v-checkbox class="inline-block absolute top-0 left-0 -mt-4" @input="updateBoolStringValue" label-position="right" v-model="editingFields[i.key]" label=" "></v-checkbox>
                  <v-icon :color="'#67AD5B'" @click.stop="() => saveLifeMode()" icon="mdi-content-save"></v-icon>
                  <!-- <v-icon :color="'#E15241'" @click.stop="() => cancelLifeSaving()" icon="mdi-cancel"></v-icon> -->
                </div>
                <div class="content-page-table__cell-value" v-if="!ifFieldCanEdit(i.key) || !isPageEditable || editionId !== item.id">
                  {{ item[i.key] }}
                </div>
              </template>
              <template v-else-if="info.list_fields[i.key]?.type === 'choice'">
                {{ getChooseValue(i.key, item[i.key]) }}              
              </template>
              <template v-else-if="info.list_fields[i.key]?.source === 'pair'">
                {{ item[i.key].value }}
              </template>
              <div v-else-if="i.key === 'actions'" class="action-cell content-page-table__cell">
                <div class="action-icons">
                  <v-menu v-if="info?.actions?.length > 0">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        size="small"
                        color="primary"
                        variant="text"
                        v-bind="props"
                      >
                        Action
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(action, index) in actions"
                        :key="index"
                        @click="doActWithId(action.value, item.id)"
                      >
                        <v-list-item-title>{{ action.text }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-btn density="comfortable" variant="text" v-if="haveIcon('show')" :color="'#4994EC'" @click="getDetailData(item['id'])" icon="mdi-eye"></v-btn>
                  <v-btn density="comfortable" variant="text" v-if="haveIcon('edit')" :color="'#4994EC'" @click="getEditData(item['id'])" icon="mdi-pencil"></v-btn>
                  <v-btn density="comfortable" variant="text" v-if="haveIcon('delete')" :color="'#E15241'" @click="deleteItemDialog(item['id'])" icon="mdi-delete"></v-btn>
                </div>
              </div>
              <template v-else-if="info.list_fields[i.key]?.type === 'boolean'">
                <div class="content-page-table__cell-edit relative pl-8" v-if="isPageEditable && ifFieldCanEdit(i.key) && editionId === item.id">
                  <!-- <input class="edit-input" v-model="editingFields[i.key]" type="checkbox" /> -->
                  <v-checkbox class="inline-block absolute top-0 left-0 -mt-4" label-position="right" v-model="editingFields[i.key]" label=" "></v-checkbox>
                  <v-icon :color="'#67AD5B'" @click.stop="() => saveLifeMode()" icon="mdi-content-save"></v-icon>
                  <!-- <v-icon :color="'#E15241'" @click.stop="() => cancelLifeSaving()" icon="mdi-cancel"></v-icon> -->
                </div>
                <div class="content-page-table__cell-value" v-if="!ifFieldCanEdit(i.key) || !isPageEditable || editionId !== item.id">
                  {{ item[i.key] }}
                </div>
              </template>
              <div v-else class="content-page-table__cell" v-click-out-side="cancelLifeSaving">
                <div class="content-page-table__cell-edit" v-if="isPageEditable && ifFieldCanEdit(i.key) && editionId === item.id" ref="target">
                  <input class="edit-input" v-model="editingFields[i.key]" />
                  <v-icon :color="'#67AD5B'" @click.stop="() => saveLifeMode()" icon="mdi-content-save"></v-icon>
                  <!-- <v-icon :color="'#E15241'" @click.stop="() => cancelLifeSaving()" icon="mdi-cancel"></v-icon> -->
                </div>
                <div class="content-page-table__cell-value" v-if="!ifFieldCanEdit(i.key) || !isPageEditable || editionId !== item.id">
                  {{ item[i.key] }}
                </div>
              </div>            
            </td>
          </tr>
        </template>
        <template #bottom></template>
      </v-data-table>
      <div class="text-center">
        <v-pagination
          v-model="pageNum"
          :length="pageCount"
          size="small"
        ></v-pagination>
      </div>
    </div>
</v-card>
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
  import { splitAndReplace, endsWithList, removeListSuffix, findErrMessage } from "@/plugins/helpers"
  import moment from 'moment'
  import Dashboard from '@/components/Dashboard.vue'
  import { onClickOutside } from '@vueuse/core'
  import CardHeading from "@/components/CardHeading.vue"

  const target = ref(null)
  const filterBtn = ref(null)
  onClickOutside(target, (event) => {
    if(event.srcElement.localName !== "input" && event.srcElement.localName !== "i") {
      cancelLifeSaving()
    }
  })

  onClickOutside(filterBtn, (event) => {
    customizeFields.value = false

    if (!document.querySelector('.v-overlay-container')?.contains(event.target))
      filterShow.value = false
  })

  const nav = useNavStore()
  const alert = ref(false)
  const alertText = ref('')
  
  const tableLoading = ref(false)
  
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
  const actFields = ref({})
  const actGlobalDialog = ref(false)
  const actGlobalFields = ref({})
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
  const actGlobal = ref({})
  const selected = ref({})
  const resources = ref([])

  const editingItem = ref({})
  const editingFields = ref({})
  const editionId = ref("")
  const checkAll = ref(false)
  const editingKey = ref("")

  const actions = computed(() => {
    const res = []
    info.value.actions.map(act => {
      res.push({
        text: act.name,
        value: act
      })
    })
    return res
  })

  watch(checkAll, (val) => {
    data.value.results.map($ => {
      selected.value[$.id] = val
    })
  })

  onBeforeMount(() => {
    pageNum.value = 1
    pageCount.value = 1
    getData(param.value)
  })
  
  const getObj = (str) => {
    try {
      return JSON.parse(str)
    } catch(e) {
      console.log(e)
    }
  }
  
  watch(
    () => route.params.page,
    (newValue) => {
        cancelLifeSaving()
        selected.value = {}
        param.value = newValue;
        getData(newValue)
        alert.value = false
        alertText.value = ''
    }  
  )
  watch(search, _.debounce((newVal) => {
    getPaginateData(param.value)
  }, 1002))
  
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
    act.value.fields.map($ => {
      actFields.value[$.name] = $
    })
    actDialog.value = true
  }
  
  const doGlobalAct = async (actObj) => {
    actGlobal.value = actObj
    actGlobal.value.fields.map($ => {
      actGlobalFields.value[$.name] = $
    })
    actGlobalDialog.value = true
  }

  const doActWithId = async (actObj, id) => {
    console.log(actObj, id)
    selected.value = {}
    selected.value[id] = true    
    act.value = actObj
    act.value.fields.map($ => {
      actFields.value[$.name] = $
    })
    actDialog.value = true
  }
  
  const doGlobalActWithId = async (actObj, id) => {
    selected.value = {}
    selected.value[id] = true
    actGlobal.value = actObj
    actGlobal.value.fields.map($ => {
      actGlobalFields.value[$.name] = $
    })
    actGlobalDialog.value = true
  }
  
  const submitAct = async () => {
    let ids = []
    Object.keys(selected.value).map($ => {
      if(selected.value[$]) ids.push(parseInt($))
    })
    console.log(ids)
    try {
      let resObject = {}
      if(Object.keys(actFields.value).length > 0) {
        Object.keys(actFields.value).map($ => {
          resObject[$] = actFields.value[$].value
        })
      }
      await axios.post(`${act.value.url}`, {
        ids: ids,
        ...resObject
      });
      selected.value = {}
      getPaginateData(param.value)
      Object.keys(actFields.value).map($ => {
        actFields.value[$].value = ""
      })
      actDialog.value = false
    } catch (error) {    
      showAlert(error)
      Object.keys(actFields.value).map($ => {
        actFields.value[$].value = ""
      })
      actDialog.value = false
    }
  }
  
  const submitGlobalAct = async () => {
    try {
      let resObject = {}
      if(Object.keys(actGlobalFields.value).length > 0) {
        Object.keys(actGlobalFields.value).map($ => {
          resObject[$] = actGlobalFields.value[$].value
        })
      }
      await axios.post(`${actGlobal.value.url}`, resObject);
      selected.value = {}
      getPaginateData(param.value)
      Object.keys(actGlobalFields.value).map($ => {
        actGlobalFields.value[$].value = ""
      })
      actGlobalDialog.value = false
    } catch (error) {    
      showAlert(error)
      Object.keys(actGlobalFields.value).map($ => {
        actGlobalFields.value[$].value = ""
      })
      actGlobalDialog.value = false
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
      console.log(error)
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
    tableLoading.value = true
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
        pageCount.value = Math.ceil(response.data.count / 10)
        headers.value = normFields(info.value.list_fields)
        const customizeFromString = localStorage.getItem('customize') || '{}'
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
        tableLoading.value = false
      } catch (error) {         
        showAlert(error)
        tableLoading.value = false
      }
  }
  
  watch(pageNum, (newVal) => {
    getPaginateData(param.value)
  })
  
  const getPaginateData = async (path) => { 
    tableLoading.value = true
    let pathSepar = splitAndReplace(removeListSuffix(path))
    if(endsWithList(path)) 
      try {
        const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/?limit=10&offset=${(pageNum.value - 1) * 10}${filterStr.value}&search=${search.value}`);
        data.value = response.data
        pageCount.value = Math.ceil(response.data.count / 10)
        tableLoading.value = false
      } catch (error) {      
        showAlert(error)
        tableLoading.value = false
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
        showAlert(error)      
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
        showAlert(error)
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
        showAlert(error)
      }
  }

///// Edition in live mode

  const isPageEditable = computed(() => {
    const notEditable = [
      "admin_rest_allordernobot_list",
      "admin_rest_allorder_list",
      "admin_rest_balance_list",
      "admin_rest_match_list",
      "admin_rest_transaction_list",
      "admin_rest_userdailystat_list",
      "seo_coinstaticpage_list",
      "seo_coinstaticsubpage_list",
      "notifications_mailing_list",
      "core_withdrawaluserlimit_list",
      "cryptocoins_depositswithdrawalsstats_list",
      "core_inoutsstats_list",
      "core_accesslog_list",
      "core_userwallet_list",
      "core_difbalance_list",
      "cryptocoins_btcwithdrawalapprove_list",
      "cryptocoins_ethwithdrawalapprove_list",
      "cryptocoins_trxwithdrawalapprove_list",
      "cryptocoins_bnbwithdrawalapprove_list",
      "core_wallettransactions_list",
      "core_paygatetopup_list",
      "bots_botconfig_list",
      "otp_totp_totpdevice_list",
      "cryptocoins_scoringsettings_list",
      "cryptocoins_transactioninputscore_list",
      "admin_logentry_list",
      "core_settings_list",
      "core_smsconfirmationhistory_list",
    ]
    if(notEditable.includes(param.value)) return false
    return true
  })

  const admin_rest_exchangeuser_list = ["email", "is_staff", "is_superuser", "kyc", "kyc_reject_type", "withdrawals_count", "orders_count"]
  const core_userkyc_list = ["forced_approve"]
  const core_pairsettings_list = ["pair"]
  const admin_rest_withdrawalrequest_list = ["blockchain", "amount", "details", "sci_gate", "txid", "is_freezed"]


  const ifFieldCanEdit = (key) => {
    if(key === 'id') return false
    if(editingKey.value !== key) return false
    if(param.value === "admin_rest_exchangeuser_list") return !admin_rest_exchangeuser_list.includes(key)
    if(param.value === "core_userkyc_list") return core_userkyc_list.includes(key)
    if(param.value === "core_pairsettings_list") return !core_pairsettings_list.includes(key)
    if(param.value === "admin_rest_withdrawalrequest_list") return !admin_rest_withdrawalrequest_list.includes(key)
    return true
  }

  const cancelLifeSaving = () => {
    editionId.value = ""
    editingItem.value = {}
    editingFields.value = {}
    editingKey.value = ""
  }

  const saveLifeMode = async () => {
    console.log(editingItem.value)
    let pathSepar = splitAndReplace(removeListSuffix(param.value))
    console.log(pathSepar)
    if(endsWithList(param.value)) {
      try {
        console.log(editingFields.value)
        const values = {} 
        Object.keys(editingItem.value.list_fields).forEach((field) => {
          values[field] = editingFields.value[field];
        });
        await axios.patch(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${editionId.value}/`, values)
        location.reload()
      } catch (error) {
        showAlert(error)      
      }
    }
  }

  const selectEditField = async (elem, key) => {
    if(!editionId.value) {
      editingItem.value = {}
      editingFields.value = {}
      editionId.value = elem
      editingKey.value = key
      await getEditDataInField(elem)
    // } else {
      // cancelLifeSaving()
    }
  }

  const getEditDataInField = async (id) => {
    let pathSepar = splitAndReplace(removeListSuffix(param.value))
    if(endsWithList(param.value)) 
      try {
        const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${id}/?`);
        editingItem.value = {
          list_fields: info.value.list_fields, 
          fields: info.value.fields, 
          data: response.data 
        }
        editingFields.value = editingItem.value.data
      } catch (error) {      
        showAlert(error)
      }
  }

/////

  const deleteItem = async () => {
    let pathSepar = splitAndReplace(removeListSuffix(param.value))
    if(endsWithList(param.value)) 
      try {
        await axios.delete(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${deleteItemId.value}/?`);
        deleteDialog.value = false
        location.reload()
      } catch (error) {      
        showAlert(error)
      }
  }
  
  const deleteItemDialog = (id) => {
    deleteItemId.value = id
    deleteDialog.value = true
  }

  const currentIcon = computed(() => nav.getNavigation?.find(navEl => navEl?.link?.name === route.params.page)?.icon || null)
  
  </script>

<style>
.v-list-item-title {
  font-size: 14px !important;
}
.v-list-item__spacer {
  width: 16px !important;
}
</style>
  
<style scoped>
.content-page-table {
  overflow-x: auto;
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
  position: relative;
}
.content-page-table__cell-edit {
  /* position: absolute; */
  top: 0;
  width: 133px;
  left: -17px;
}
.content-page-table__cell-edit input {
  background: #fff;
  max-width: 90px;
  text-align: center;
  min-width: 0;
  width: auto;
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
  color: rgba(0, 0, 0, 0.38);
  display: flex;
  background: white;
  margin-bottom: 50px;
}
.breadcrumbs__link {
  color: rgb(var(--v-theme-primary));
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
  margin-top: 10px;
}
.alert-block {
  position: fixed !important;
  bottom: 0 !important;
  right: 0 !important;
  width: 520px !important;
  z-index: 22 !important;
}
.edit-input {
  border: 1px solid #ccc;
}
.action-icons {
  display: flex;
  align-items: center;
  min-width: 100px;
  gap: 5px;
}
</style>