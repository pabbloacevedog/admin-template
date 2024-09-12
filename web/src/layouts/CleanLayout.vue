<template>
	<q-page-container>
		<router-view />
	</q-page-container>
</template>

<script>
import { defineComponent} from 'vue';

export default defineComponent({
    name: 'CleanLayout',
});
</script>

<style scoped>
.bg-primary {
    background-color: #6200ea;
}

.text-white {
    color: white;
}

.drawer {
    background-color: #6200ea;
    color: white;
}
.q-drawer {
    background: rgba(255, 255, 255, .3);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    border: 1.5px solid rgba(209, 213, 219, 0.3);
    color: white;
}
</style>
