<script setup>

import { useMapStore } from '@/stores/map.js'
// 地图状态管理pinia
const mapStore = useMapStore()

</script>

<template>
    <div>
        <div flex class="menu_item">
            <dv-button @click="mapStore.setBoxData(0)" border="Border5" color="#e18a3b" class="btn">图源切换</dv-button>
            <dv-button @click="mapStore.setBoxData(1)" border="Border5" color="#e18a3b" class="btn">历史数据</dv-button>
            <dv-button @click="mapStore.setBoxData(2)" border="Border5" color="#e18a3b" class="btn">切换数据</dv-button>
        </div>
    </div>
</template>

<style scoped>
.menu_item {
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn {
    margin: 25px 15px 0;
}
</style>