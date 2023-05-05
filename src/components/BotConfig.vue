<template>

<v-tabs
  v-model="tab"
  bg-color="primary"
>
  <v-tab value="1">Item One</v-tab>
  <v-tab value="2">Item Two</v-tab>
  <v-tab value="3">Item Three</v-tab>
  <v-tab value="4">Item Three</v-tab>
</v-tabs>

<v-card-text>
  <v-window v-model="tab">
    <v-window-item value="1">
      <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
        <div v-if="inTab(field) === 1">
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
import { splitAndReplace, endsWithList, removeListSuffix } from "../plugins/helpers"
const apiKey = localConfig.api

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const values = ref({})
  const route = useRoute()
  const param = ref(route.params.page)


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
    'low_orders_match_greater_order'
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

</script>