<template>
	<v-data-table
    class="table-block"
		:headers="headers"
		:items="data.results"
		:hide-default-header="true"
		:hide-default-footer="true"
		disable-pagination    
	>
    <template v-slot:item="{ item }">
	  	<tr>
        <td v-for="i in headers" class="table-block__td">
          <div v-if="i.key === 'user' && typeof item[i.key] === 'object'" class="content-page-table__cell">
            {{ item[i.key]?.value  }}
          </div>
          <template v-else-if="info.list_fields[i.key]?.type === 'datetime'">
            {{ item[i.key] !== null ? moment(item[i.key]).format('DD.MM.YYYY HH:mm:ss') : '' }}
          </template>
          <template v-else-if="info.list_fields[i.key]?.type === 'choice'">
            {{ getChooseValue(i.key, item[i.key]) }}
          </template>
          <div v-else class="content-page-table__cell">{{ item[i.key] }}</div>
        </td>
      </tr>
    </template>
    <template #bottom></template>
  </v-data-table>
</template>

<script setup >
import { VDataTable } from 'vuetify/labs/VDataTable'
import localConfig from "@/local_config"
import { ref, onBeforeMount } from 'vue'
import _ from 'lodash'
import { splitAndReplace, endsWithList, removeListSuffix } from "@/plugins/helpers"
import moment from 'moment'
import { useNavStore } from '@/stores/nav'
import axios from '@/plugins/axios'

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  pagin: {
    type: String,
    required: false
  }
})

const apiKey = localConfig.api
const headers = ref([])
const info = ref([])
const data = ref([])


onBeforeMount(() => {
  getData()
})

const nav = useNavStore()
const getChooseValue = (field, value) => {
  let s = info.value.list_fields[field]?.attributes?.choices?.filter(i => i.value === value)?.[0]?.["text"]
  return s
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

const getData = async () => { 
	try {
			const options = await axios.options(`${apiKey}${props.path}`);
			info.value = options.data
			const response = await axios.get(`${apiKey}${props.path}${props.pagin ? props.pagin : ''}`);
			data.value = response.data
			headers.value = normFields(info.value.list_fields)
	} catch (error) {
			console.log(error.message);
	}
}

</script>

<style>
.table-block {
  font-size: 14px;
  font-weight: 300;
}

.table-block th {
  height: 32px !important;
}

.table-block__td {
  height: 32px !important;
}
</style>