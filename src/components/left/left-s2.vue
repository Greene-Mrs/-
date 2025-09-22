<script setup>
import { ref, watch } from 'vue'
import { useSelectStore } from '@/stores/select.js'

/* import { mapState } from 'pinia' */
const selectStore = useSelectStore()

const show = ref(false)
const ty = ref(1)
watch(
    () => selectStore.featureResult,
    (newVal) => {
        show.value = !!newVal && isPoint(newVal.geometry);
        if (newVal.day) {
            console.log('地震图层：', selectStore.featureResult)
            ty.value = 11
        } else if (newVal.disaster) {
            console.log('坍塌图层：', selectStore.featureResult)
            ty.value = 21
        }
    }
)

const isPoint = (geometry) => {
    if (!geometry) return false;
    // 常见的点型几何类型名称
    const pointTypes = ['Point', 'MultiPoint'];
    return pointTypes.includes(geometry.getType?.());
}



</script>

<template>
    <div class="content">
        <div v-if="show">
            <div v-show="ty == '11'">
                <p>地震中心点：{{ selectStore.featureResult.epicenter }}</p>
                <p>地震等级：{{ selectStore.featureResult.eqL }}</p>
                <p>地震深度：{{ selectStore.featureResult.depth }}km</p>
                <p>地震时间：{{ selectStore.featureResult.day }}</p>
                <p>
                    经度：{{ selectStore.featureResult.x }} 纬度：{{ selectStore.featureResult.y }}
                </p>
            </div>
            <div v-show="ty == 21">
                <p>事件位置：{{ selectStore.featureResult.location }}</p>
                <p>事件名称：{{ selectStore.featureResult.disaster_name }}</p>
                <p>灾害等级：{{ selectStore.featureResult.disasterL }}</p>
                <p>影响等级：{{ selectStore.featureResult.xianL }}</p>
                <p>经度：{{ selectStore.featureResult.x }} 纬度：{{ selectStore.featureResult.y }}
                </p>
            </div>
        </div>
        <div v-else>
            <p>请先查询历史点数据（暂无数据）</p>
        </div>
    </div>
</template>

<style scoped>
.content {
    width: 100%;
    height: 100%;
}

p {
    font-size: 14px;
    color: #fff;
    margin: 10px 0;
    text-align: left;
    padding-left: 20px;
}
</style>