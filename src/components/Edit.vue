<template>
<div v-if="props.type === 'auth_user_list'" class="p-5">
  <v-btn class="mb-3" color="primary" variant="tonal" @click="openEditBlock = true">Edit</v-btn>
  <div v-if="openEditBlock">
    <div class="detail-data">
      <div v-for="field in Object.keys(props.data.list_fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
        <template v-if="props.data.list_fields[field].attributes.read_only === true">
         
        </template>
        <template v-else-if="props.data.list_fields[field].type === 'boolean'">
          <v-checkbox
            :label="props.data.list_fields[field].attributes.label"
            v-model="values[field]"
          ></v-checkbox>
        </template>
        <template v-else-if="props.data.list_fields[field].type === 'choice'">
          <label>{{ props.data.list_fields[field].attributes.label }}</label>
          <v-select
            item-title="text"
            item-value="value"
            :items="props.data.list_fields[field].attributes.choices"
            :label="props.data.list_fields[field].attributes.label"
            v-model="values[field]"
          ></v-select>
        </template>
        <template v-else-if="props.data.list_fields[field].type === 'datetime'">
          <v-date-picker v-model="values[field]"></v-date-picker>
        </template>
        <template v-else>
          <v-text-field 
            :label="props.data.list_fields[field].attributes.label"
            v-model="values[field]"
            :hint="props.data.list_fields[field].attributes.hint"
          ></v-text-field>
        </template>
      </div>
      <v-btn color="primary" block @click="save" variant="tonal">Save</v-btn>
    </div>
    <div class="flex justify-center pb-6">
      <v-btn color="primary" variant="tonal" @click="openEditBlock = false">Close</v-btn>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-8 mb-8">    
    <v-card>
      <template v-slot:title>
        Details
      </template>
      <template v-slot:text>
        <TableBlock :path="`core/profile/?user_id=${props.data.data.id}`" />
      </template>
    </v-card>
    <v-card>
      <template v-slot:title>
        Latest Topups
      </template>
      <template v-slot:text>
        <TableBlock :path="`dashboard/topups/?user_id=${props.data.data.id}`" pagin="?limit=10&offset=0" />
      </template>
    </v-card>
  </div>
  <v-card class="mb-8">
      <template v-slot:title>
        Last withdrawals
      </template>
      <template v-slot:text>
        <TableBlock :path="`dashboard/topups/?user_id=${props.data.data.id}`" pagin="?limit=10&offset=0" />
      </template>
  </v-card>
  <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab value="1">MAIN</v-tab>
      <v-tab value="2">FULL PROFILE</v-tab>
      <v-tab value="3">KYC</v-tab>
      <v-tab value="4">SOURCE OF FUNDS</v-tab>
      <v-tab value="5">BALANCE</v-tab>
      <v-tab value="6">ORDERS</v-tab>
      <v-tab value="7">WALLETS</v-tab>
      <v-tab value="8">HISTORY</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="1">
          <TableBlock :path="`auth/user/?user_id=${props.data.data.id}&limit=10&offset=0`" />
        </v-window-item>
        <v-window-item value="2">
          <TableBlock :path="`core/profile/?user_id=${props.data.data.id}&limit=10&offset=0`" />
        </v-window-item>
        <v-window-item value="3">
          <TableBlock :path="`core/userkyc/?user_id=${props.data.data.id}&limit=10&offset=0`" />
        </v-window-item>
        <v-window-item value="4">
          <TableBlock :path="`core/sourceoffunds/?user_id=${props.data.data.id}&limit=10&offset=0`" />
        </v-window-item>
        <v-window-item value="5">
          <TableBlock :path="`admin_rest/balance/?user_id=${props.data.data.id}`" />
        </v-window-item>
        <v-window-item value="6">
          <TableBlock :path="`admin_rest/allordernobot/?user_id=${props.data.data.id}&limit=10&offset=0`" />
        </v-window-item>
        <v-window-item value="7">
          <TableBlock :path="`core/userwallet/?user_id=${props.data.data.id}&limit=10&offset=0`" />
        </v-window-item>
        <v-window-item value="8">
          <TableBlock :path="`core/loginhistory/?user_id=${props.data.data.id}&limit=10&offset=0`" />
          <div class="grid grid-cols-2">
            <TableBlock :path="`core/smshistory/?user_id=${props.data.data.id}&limit=10&offset=0`" />
            <TableBlock :path="`core/twofactorsecrethistory/?user_id=${props.data.data.id}&limit=10&offset=0`" />
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
</div>
<div v-else class="detail-data">
  <div v-for="field in Object.keys(props.data.list_fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">
    <template v-if="props.data.list_fields[field].attributes.read_only === true">
     
    </template>
    <template v-else-if="props.data.list_fields[field].type === 'boolean'">
      <v-checkbox
        :label="props.data.list_fields[field].attributes.label"
        v-model="values[field]"
      ></v-checkbox>
    </template>
    <template v-else-if="props.data.list_fields[field].type === 'choice'">
      <label>{{ props.data.list_fields[field].attributes.label }}</label>
      <v-select
        item-title="text"
        item-value="value"
        :items="props.data.list_fields[field].attributes.choices"
        :label="props.data.list_fields[field].attributes.label"
        v-model="values[field]"
      ></v-select>
    </template>
    <template v-else-if="props.data.list_fields[field].type === 'datetime'">
      <v-date-picker v-model="values[field]"></v-date-picker>
    </template>
    <template v-else>
      <v-text-field 
        :label="props.data.list_fields[field].attributes.label"
        v-model="values[field]"
        :hint="props.data.list_fields[field].attributes.hint"
      ></v-text-field>
    </template>
  </div>
  <v-btn color="primary" block variant="tonal" @click="save">Save</v-btn>
</div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import localConfig from "@/local_config"
import axios from '../plugins/axios'
import { splitAndReplace, endsWithList, removeListSuffix } from "../plugins/helpers"
import TableBlock from './TableBlock.vue';

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

const tab = ref(1)
const openEditBlock = ref(false)
const values = ref({})
const route = useRoute()
const param = ref(route.params.page)

const save = async () => {
  let pathSepar = splitAndReplace(removeListSuffix(param.value))
  if(endsWithList(param.value)) 
    try {
      await axios.patch(`${apiKey}${pathSepar[0]}/${pathSepar[1]}/${props.data.data.id}/`, values.value)
      location.reload()
    } catch (error) {
      console.error(error.type);
    }
}

onMounted(() => {
  Object.keys(props.data.list_fields).forEach((field) => {
    values.value[field] = props.data.data[field];
  });
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