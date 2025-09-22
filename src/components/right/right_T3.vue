<script setup>
import { ref } from 'vue'
import { useMapStore } from '@/stores/map.js'
import { useSelectStore } from '@/stores/select.js'
const selectStore = useSelectStore()
const mapStore = useMapStore()

// 存储实时图层
const addOlLayer = (layerName) => {
    mapStore.setNewOlLayer(
        'https://tile.openweathermap.org/map/' + layerName + '/{z}/{x}/{y}.png?appid=6f9ad62836544a0aba94f47dd3baf767'
    )
    mapStore.setMapServer(3)
}

//移除图层
const removeLayer = (k) => {
    mapStore.setMapServer(k)
    mapStore.setNewOlLayer('')
}

// 实时洪涝风险
const nowFor = (k) => {
    selectStore.setNowSelect(k)
}
</script>
<template>
    <div>
        <div class="content">
            <div class="title_box">
                <dv-decoration7 class="dv_title"> &nbsp;实时数据&nbsp; </dv-decoration7>
            </div>
            <div class="btn_box">
                <el-button @click="addOlLayer('precipitation_new')" size="large">实时降水数据</el-button>
                <el-button @click="removeLayer(-1)" size="large">删除图层</el-button>
            </div>
            <div class="btn_box">
                <el-button @click="addOlLayer('clouds_new')" size="large">实时云层数据</el-button>
                <el-button @click="removeLayer(-1)" size="large">删除图层</el-button>
            </div>
            <div class="btn_box">
                <el-button @click="addOlLayer('wind_new')" size="large">实时风速数据</el-button>
                <el-button @click="removeLayer(-1)" size="large">删除图层</el-button>
            </div>
            <div class="btn_box">
                <el-button @click="addOlLayer('temp_new')" size="large">实时温度数据</el-button>
                <el-button @click="removeLayer(-1)" size="large">删除图层</el-button>
            </div>
            <div class="btn_box">
                <el-button @click="nowFor(1)" size="large">实时洪涝风险</el-button>
                <el-button @click="nowFor(0)" size="large">取消查询</el-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.el-button) {
    margin: 0 15px;
    width: 50%;
    height: 36px;
    font-size: 15px;
    border-radius: 10px;
    background-color: #0d5b57;
    color: #ecd9d9;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

:deep(el-button:hover) {
    background-color: #fff;
}

.content {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    width: 100%;
    height: 100%;

    .title_box {
        position: relative;
        width: 100%;
        margin: 5px;

        .dv_title {
            width: 100%;
            height: 30px;
            font-size: 21px;
        }
    }

    .btn_box {
        height: 20px;
        width: 90%;
        display: flex;
        justify-content: left;
        margin: 15px auto;
    }
}
</style>