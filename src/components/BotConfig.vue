<template>
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
<v-tabs
  v-model="tab"
  bg-color="primary"
>
  <v-tab value="1">Main</v-tab>
  <v-tab value="2">Settings</v-tab>
  <v-tab value="3">Alert settings</v-tab>
  <v-tab value="4">Alert enable</v-tab>
</v-tabs>

<v-card-text>
  <v-window v-model="tab">
    <v-window-item value="1">
      <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
        <div v-if="inTab(field) === 1">
          <template v-if="props.data.fields[field].attributes.read_only === true"></template>
          <template v-else-if="props.data.fields[field].attributes.label === 'User'">
            <v-autocomplete
              label="Users"
              clearable
              :items="users"
              item-title="text"
              item-value="value"
              v-model="values[field]"
              @update:search="fetchUsers"
            ></v-autocomplete>
          </template>
          <template v-else-if="props.data.fields[field].type === 'boolean'">
            <v-checkbox
              :label="props.data.fields[field].attributes.label"
              v-model="values[field]"
            ></v-checkbox>
          </template>
          <template v-else-if="props.data.fields[field].attributes.label === 'Pair'">
            <v-select
              item-title="text"
              item-value="value"
              :items="pairs"
              :label="props.data.fields[field].attributes.label"
              v-model="values[field]"
            ></v-select>
          </template>
          <template v-else-if="props.data.fields[field].type === 'choice'">
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
      </div>
    </v-window-item>

    <v-window-item value="2">
      <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
        <div v-if="inTab(field) === 2">
          <template v-if="props.data.fields[field].attributes.read_only === true"></template>
          <template v-else-if="props.data.fields[field].type === 'boolean'">
            <v-checkbox
              :label="props.data.fields[field].attributes.label"
              v-model="values[field]"
            ></v-checkbox>
          </template>
          <template v-else-if="props.data.fields[field].type === 'choice'">
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
      </div>
    </v-window-item>

    <v-window-item value="3">
      <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
        <div v-if="inTab(field) === 3">
          <template v-if="props.data.fields[field].attributes.read_only === true"></template>
          <template v-else-if="props.data.fields[field].type === 'boolean'">
            <v-checkbox
              :label="props.data.fields[field].attributes.label"
              v-model="values[field]"
            ></v-checkbox>
          </template>
          <template v-else-if="props.data.fields[field].type === 'choice'">
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
      </div>
    </v-window-item>

    <v-window-item value="4">
      <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
        <div v-if="inTab(field) === 4">
          <template v-if="props.data.fields[field].attributes.read_only === true"></template>
          <template v-else-if="props.data.fields[field].type === 'boolean'">
            <v-checkbox
              :label="props.data.fields[field].attributes.label"
              v-model="values[field]"
            ></v-checkbox>
          </template>
          <template v-else-if="props.data.fields[field].type === 'choice'">
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
      </div>
    </v-window-item>
  </v-window>
</v-card-text>

<v-btn color="primary" variant="tonal" block @click="save">Save</v-btn>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import localConfig from "@/local_config"
import axios from '../plugins/axios'
import { splitAndReplace, endsWithList, removeListSuffix, findErrMessage } from "../plugins/helpers"
const apiKey = localConfig.api

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const values = ref({})
const valuesCore = ref({})
const route = useRoute()
const headers = ref([])
const info = ref([])
const dataC = ref([])
const alert = ref(false)
const alertText = ref('')
const param = ref(route.params.page)

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
const users = ref([])
const chips = ref([])
const fetchUsers = async (searchValue) => {
  users.value = []
  try {
    const response = await axios.get(`${apiKey}auth/user/`,{ params: { search: searchValue } })
    response.data.results.map($ => {
      users.value.push({value: $.id, text: $.email})
    })
  } catch (error) {
    showAlert(error)    
  }
}

const pairs = ref([])

const fetchPairs = async () => {
  try {
    const response = await axios.get(`${apiKey}core/pair/`)
    response.data.results.map($ => {
      pairs.value.push({value: $.id, text: $._label})
    })
  } catch (error) {
    console.log(error) 
  }
}

const save = async () => {
  let pathSepar = splitAndReplace(removeListSuffix(param.value))
  if(endsWithList(param.value)) 
    try {
      delete values.value['binance_apikey']
      delete values.value['binance_secret']
      delete values.value['_label']
      if(props?.data?.data?.id) { 
        await axios.patch(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${props?.data?.data?.id}`, values.value)
      }
      else {
        await axios.post(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/`, values.value)
      }      
      location.reload()
    } catch (error) {
      showAlert(error)      
    }
}

const getData = async () => { 
  let pathSepar = splitAndReplace(removeListSuffix(param.value))
	try {
    const options = await axios.options(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/`);
    info.value = options.data    
    const response = await axios.get(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${props.data.data['id']}`);
    dataC.value = response.data
    headers.value = normFields(info.value.fields)
    users.value = []
    await fetchUsers()
    Object.keys(info.value.fields).forEach((field) => {
      values.value[field] = dataC.value[field];
    });
	} catch (error) {
    showAlert(error)			
	}
}

const normFields = (arr) => {
  let res = []
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
  return res
}

const tab = ref(1)

const inTab = (key) => {
  if([
      'name', 
      'user', 
      'pair', 
      'strategy', 
      'match_user_orders', 
      'instant_match', 
      'ohlc_period', 
      'enabled'
    ].includes(key)) return 1
  if([
    'loop_period', 
    'loop_period_random', 
    'min_period',
    'max_period',
    'ext_price_delta',
    'min_order_quantity',
    'max_order_quantity',
    'use_custom_price',
    'low_orders_match',
    'low_orders_min_order_size',
    'low_orders_match_greater_order',
    'symbol_precision',
    'quote_precision',
  ].includes(key)) return 2
  if([
    'liquidity_buy_order_size', 
    'liquidity_sell_order_size', 
    'liquidity_order_step',
    'liquidity_min_btc_balance',
    'liquidity_min_eth_balance',
    'liquidity_min_usdt_balance',
  ].includes(key)) return 3  
  if([
    'low_spread_alert', 
  ].includes(key)) return 4
}

onMounted(() => {
  if(props?.data?.data?.id) {
    Object.keys(props.data.list_fields).forEach((field) => {
      values.value[field] = props.data.data[field];
    });
    getData()
    fetchPairs()
  }

});

</script>