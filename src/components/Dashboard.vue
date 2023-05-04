<template>
<div class="p-8">
	<div class="grid grid-cols-2 gap-8 mb-8">
    <v-card>
      <template v-slot:title>
        Latest Topups
      </template>
      <template v-slot:text>
        <TableBlock :path="'dashboard/topups/'" />
      </template>
    </v-card>
		<v-card>
      <template v-slot:title>
        Latest Withdrawals
      </template>
      <template v-slot:text>
        <TableBlock :path="'dashboard/withdrawals/'" />
      </template>
    </v-card>
	</div>
	<div class="grid grid-cols-3 gap-8 mb-8">
    <v-card>
      <template v-slot:title>
				Trading and Withdrawals Fee
      </template>
      <template v-slot:text>
        <TableBlock :path="'dashboard/tradefee/'" />
      </template>
    </v-card>
		<v-card>
      <template v-slot:title>
        Launchpad Fee
      </template>
      <template v-slot:text>
        <TableBlock :path="'dashboard/launchpadfee/'" />
      </template>
    </v-card>
		<div>
			<v-card>
				<template v-slot:title>
					Latest Withdrawals
				</template>
				<template v-slot:text>
					<TableBlock :path="'dashboard/commonusersstats/'" />
				</template>
			</v-card>
			<v-card>
				<template v-slot:title>
					Users Stats
				</template>
				<template v-slot:text>
					<TableBlock :path="'dashboard/launchpadunlocksstats/'" />
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
        <TableBlock :path="'dashboard/commoninouts/'" />
      </template>
    </v-card>
		<v-card>
      <template v-slot:title>
        Trade Volumes
      </template>
      <template v-slot:text>
        <TableBlock :path="'dashboard/tradevolume/'" />
      </template>
    </v-card>
	</div>
</div>
</template>
<script setup>
import TableBlock from './TableBlock.vue';

	// https://polyxdev.plgdev.com/apiadmin/dashboard/tradevolume/?limit=100&offset=0
	// https://polyxdev.plgdev.com/apiadmin/dashboard/withdrawals/?limit=10&offset=0
	// https://polyxdev.plgdev.com/apiadmin/dashboard/launchpadfee/?limit=10&offset=0
	// https://polyxdev.plgdev.com/apiadmin/dashboard/topups/?limit=10&offset=0
	// https://polyxdev.plgdev.com/apiadmin/dashboard/commonusersstats/?limit=100&offset=0
	// https://polyxdev.plgdev.com/apiadmin/dashboard/commoninouts/?limit=100&offset=0
	// https://polyxdev.plgdev.com/apiadmin/dashboard/tradefee/?limit=100&offset=0
	// https://polyxdev.plgdev.com/apiadmin/dashboard/launchpadunlocksstats/?limit=100&offset=0

</script>