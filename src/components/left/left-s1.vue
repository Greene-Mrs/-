<script setup>

import { ref, watch, computed } from 'vue';

import { useSelectStore } from '../../stores/select.js';
import { Feature } from 'ol';
import { useMapStore } from '../../stores/map.js';

const mapStore = useMapStore()
const selectStore = useSelectStore()

//先定义一个变量，用来存储查询结果
const show = ref()

watch(
    () => selectStore.featureResult, //后面为监听哪个数据
    (newValue) => {  //括号里有
        // 1. newValue：监听源变化后的「新值」（必选位置，但可不用）
        // 2. oldValue：监听源变化前的「旧值」（可选，非必需时可省略）
        // 3. onInvalidate：清理副作用的函数（如防抖、异步请求取消，极少用）
        //监听查询结果，如果查询结果有值，则显示查询结果，否则显示暂无数据

        // 只有当结果存在且类型为线型时才显示
        show.value = !!newValue && isLineString(newValue.geometry);
        console.log('监听查询结果featureResult', selectStore.featureResult)
    },
    // 可选的配置项（比如 immediate: true 表示立即执行一次回调）
    // { immediate: true } 
)

// 判断几何对象是否为线型
const isLineString = (geometry) => {
    if (!geometry) return false;
    // 常见的线型几何类型名称，根据实际使用的库调整
    const lineTypes = ['LineString', 'MultiLineString'];
    return lineTypes.includes(geometry.getType?.());
};

//定义经纬度范围变量
/* const minLng = ref()
const maxLng = ref()
const minLat = ref()
const maxLat = ref() */

// 用计算属性获取经纬度范围（基于公开 API，更稳健）
const latLngRange = computed(() => {

    const feature1 = selectStore.featureResult;
    // 仅处理线型要素
    if (!feature1 || !isLineString(feature1.geometry)) {
        return { minLng: '', maxLng: '', minLat: '', maxLat: '' };
    }

    // 获取查询结果的几何对象（geometry）的 extent 属性
    const geometry = feature1.geometry

    /* if (!geometry || !geometry.getExtent)
        return {
            minLng: '', maxLng: '', minLat: '', maxLat: ''
        } */

    // 调用 ArcGIS 公开方法 getExtent() 获取边界对象
    const extent = geometry.getExtent();

    if (geometry || geometry.getExtent)
        return {
            minLng: extent[0],
            minLat: extent[1],
            maxLng: extent[2],
            maxLat: extent[3],
        }
})

</script>
<template>
    <div class="content">
        <!-- 查询结果后 -->
        <!-- 仅当存在线型查询结果时显示 -->
        <div v-if="show">
            <p>管道名称：{{ selectStore.featureResult.Name }}</p>
            <p>管道长度：{{ selectStore.featureResult.Shape_Leng }}</p>
            <p>
                管道经度范围：{{ latLngRange.minLng }} - {{ latLngRange.maxLng }}
            </p>
            <p>
                管道纬度范围：{{ latLngRange.minLat }} - {{ latLngRange.maxLat }}
            </p>
        </div>
        <!-- 无查询结果后 -->
        <div v-else>
            <p>请先查询管道数据（暂无数据）</p>
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