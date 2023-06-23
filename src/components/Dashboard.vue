<template>
<div class="p-8">
	<div class="grid grid-cols-2 gap-8 mb-8">
    <v-card>
      <template v-slot:title>
        Latest Topups
      </template>
      <template v-slot:text>
        <TableBlock :path="'dashboard_rest/topups/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
      </template>
    </v-card>
		<v-card>
      <template v-slot:title>
        Latest Withdrawals
      </template>
      <template v-slot:text>
        <TableBlock :path="'dashboard_rest/withdrawals/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
      </template>
    </v-card>
	</div>
	<div class="grid grid-cols-2 gap-8 mb-8">
    <v-card>
      <template v-slot:title>
				Trading and Withdrawals Fee
      </template>
      <template v-slot:text>
        <TableBlock :path="'dashboard_rest/tradefee/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
      </template>
    </v-card>
		<div>
			<v-card class="mb-2">
				<template v-slot:title>
					Latest Withdrawals
				</template>
				<template v-slot:text>
					<TableBlock :path="'dashboard_rest/commonusersstats/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
				</template>
			</v-card>
		</div>
	</div>
	<div class="grid grid-cols-2 gap-8 mb-8">
    <v-card>
      <template v-slot:title>
        InOuts Stats
      </template>
      <template v-slot:text>
        <TableBlock :path="'dashboard_rest/commoninouts/?limit=10&offset=0'" :pagin="`?limit=10&offset=0`" />
      </template>
    </v-card>
	</div>
</div>
</template>
<script setup>
import TableBlock from './TableBlock.vue';

</script>