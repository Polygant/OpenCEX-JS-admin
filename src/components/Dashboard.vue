<template>
<div class="px-8">
	<div class="grid grid-cols-2 gap-8 mb-12">
    <v-card class="overflow-visible">
      <card-heading title="Latest Topups" color="cyan" icon="mdi-arrow-collapse-down" />
      <TableBlock class="mt-6 mb-1" :path="'dashboard_rest/topups/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
    </v-card>
		<v-card class="overflow-visible">
      <card-heading title="Latest Withdrawals" color="orange" icon="mdi-arrow-expand-up" />
      <TableBlock class="mt-6 mb-1" :path="'dashboard_rest/withdrawals/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
    </v-card>
	</div>
	<div class="grid grid-cols-2 gap-8 mb-12">
    <v-card class="overflow-visible">
      <card-heading title="Trading and Withdrawals Fee" color="green" icon="mdi-percent" />
      <TableBlock class="mt-6 mb-1" :path="'dashboard_rest/tradefee/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
    </v-card>
		<div>
			<v-card class="overflow-visible mb-2">
        <card-heading title="Latest Withdrawals" color="green" icon="mdi-arrow-expand-up" />
				<TableBlock class="mt-6 mb-1" :path="'dashboard_rest/commonusersstats/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
			</v-card>
		</div>
	</div>
	<div class="grid grid-cols-2 gap-8 mb-12">
    <v-card class="overflow-visible">
      <card-heading title="InOuts Stats" color="blue" icon="mdi-account-group" />
      <TableBlock class="mt-6 mb-1" :path="'dashboard_rest/commoninouts/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
    </v-card>
	</div>
</div>
</template>
<script setup>
import CardHeading from "@/components/CardHeading.vue"
import TableBlock from './TableBlock.vue';

</script>