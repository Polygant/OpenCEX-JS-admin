<template>
  <div class="detail-data">
    <div v-for="field in Object.keys(props.data.fields)" class="detail-data-item" :class="{'hidden': field === '_label'}">    
      <template v-if="props.data.fields[field].attributes.label === 'Links'">
        <strong>{{ props.data.fields[field].attributes.label }}:</strong>
        <div v-for="it in getObj(props.data.data[field])">
          {{ it.href }} - {{ it.title }}
        </div>
      </template>
      <template v-else-if="typeof props.data.data[field] === 'object'">
        <strong>{{ props.data.fields[field].attributes.label }}:</strong> {{ props.data.data[field]?.value }}
      </template>
      <template v-else>
        <strong>{{ props.data.fields[field].attributes.label }}:</strong> {{ props.data.data[field] }}
      </template>
    </div>
  </div>
  </template>
  <script setup>
  
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  })
  
  const getChooseValue = (field, value) => {
    let s = props.data.list_fields[field]?.attributes?.choices?.filter(i => i.value === value)?.[0]?.["text"]
    return s
  }
  
  const getObj = (str) => {
    try {
      return JSON.parse(str)
    } catch(e) {
      console.log(e)
    }
  }
  
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