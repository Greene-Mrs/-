<script setup>

import { ref } from 'vue'
import { useMapStore } from '@/stores/map.js'

const mapStore = useMapStore()
const selectEarthquake = () => {
    mapStore.newVLayer = 10
}

//设置热力图
const setHeatmap = (k) => {
    //设置地图服务
    mapStore.setMapServer(k)
    if (k == -1) {
        /* mapStore.setNowLayer('') */
        mapStore.newVLayer = null
    }
    //mapStore.setMapServerKey(featureName)
}

const selectCaveIn = () => {
    mapStore.newVLayer = 101
}

//用于设置名字
const layerArray = ['test:earthquake1', 'test:CaveIn1', 'test:flood1']
const setGeoServerLayer = (layerName) => {
    mapStore.setMapServer(4)//用于设置地图服务，目前支持tif栅格
    /* mapStore.setGeoServerLayerName(layerName) */
    //获取图层名字
    if (layerName == layerArray[0]) {
        mapStore.setNowLayer('地震热力图')
    } else if (layerName == layerArray[1]) {
        mapStore.setNowLayer('沉降坍塌风险图')
    } else if (layerName == layerArray[2]) {
        mapStore.setNowLayer('洪涝风险图')
    }
    mapStore.setGeoServerLayerName(layerName)//设置名字的
}

</script>
<template>

    <div class="content">
        <!-- 标题 -->
        <div class="title_box">
            <dv-decoration7 class="dv_title"> &nbsp;历史数据&nbsp; </dv-decoration7>
        </div>
        <!-- 内容 -->
        <div class="box">
            <el-collapse v-model="activeName" accordion class="collapse_item" style="width: 100% ">
                <el-collapse-item title="历史地震数据" name="1">
                    <el-button type="primary" @click="selectEarthquake">查询</el-button>
                    <el-button type="primary" @click="setHeatmap(1)">生成热力图</el-button>
                    <el-button type="primary" @click="setGeoServerLayer(layerArray[0])">热力图(GeoServer)</el-button>
                    <el-button type="primary" @click="setHeatmap(-1)">删除数据</el-button>
                </el-collapse-item>
                <el-collapse-item title="历史沉降坍塌数据" name="2">
                    <p></p>
                    <el-button type="primary" @click="selectCaveIn">查询</el-button>
                    <el-button type="primary" @click="setHeatmap(2)">生成热力图</el-button>
                    <el-button type="primary" @click="setGeoServerLayer(layerArray[1])">风险图(GeoServer)</el-button>
                    <el-button type="primary" @click="setHeatmap(-1)">删除数据</el-button>
                </el-collapse-item>
                <el-collapse-item title="历史洪涝数据" name="3">
                    <p></p>
                    <el-button type="primary" @click="selectCaveIn">查询</el-button>
                    <el-button type="primary" @click="setHeatmap(1)">生成热力图</el-button>
                    <el-button type="primary" @click="setGeoServerLayer(layerArray[2])">风险图(Geoserver)</el-button>
                    <el-button type="primary" @click="setHeatmap(-1)">删除数据</el-button>
                </el-collapse-item>
            </el-collapse>
        </div>

    </div>
</template>
<style scoped>
:deep(.el-collapse-item__header) {
    padding: 1px 0;
    margin: 0;
    font-size: 16px;
    width: 100%;
}

:deep(.el-collapse-item__content) {
    width: 100%;
    padding: 1px 0;
    background-color: #f5f5f5;
}

:deep(.el-button) {
    padding: 3px 2px;
    margin-right: 2px;
    margin-left: 2px;

}

.content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
}

.title_box {
    position: relative;
    width: 100%;
    margin: 5px;
}

.dv_title {
    width: 100%;
    height: 30px;
    font-size: 21px;
}

.box {
    /* 位于中间 */

    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    /*  padding-left: 10px; */
    width: 90%;
}
</style>