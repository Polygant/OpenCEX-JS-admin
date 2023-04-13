<template>
    <div @click="getUser">GET</div>
    <div @click="getNavigation">GET</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from '@/plugins/axios';

const getUser = async () => {
    try {
        const response = await axios.get('https://polyxdev.plgdev.com/apiadmin/user/');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

const getNavigation = async () => {
    try {
        const response = await axios.get('https://polyxdev.plgdev.com/apiadmin/navigation/');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}
</script>