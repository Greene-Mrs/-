<script setup>

import { ref } from 'vue'
import { useMapStore } from '@/stores/map.js'

// 地图状态管理pinia
const mapStore = useMapStore()

const radio = ref('1')


//改变底图3
const changeFn = (Event) => {
    //console.log(p.target._value)
    if (Event.target._value == radio.value) {
        return
    }
    mapStore.setDataType(Event.target._value)
}

</script>

<template>
    <div class="content">
        <div class="title_box">
            <dv-decoration7 class="dv_title">&nbsp;&nbsp;图源切换&nbsp;&nbsp;</dv-decoration7>
        </div>
        <!-- 切换图层1 -->
        <div class="box">
            <div class="btn_box">
                <img src="@/assets/map_logo/t_map_1.png" class="image" />
                <p>
                    矢量底图&nbsp;&nbsp;<el-radio v-model="radio" @input="changeFn" label="1"><span></span></el-radio>
                </p>
            </div>

            <!-- 切换图层2 -->
            <div class="btn_box">
                <img src="@/assets/map_logo/t_map_2.png" class="image" />
                <p>
                    影像底图&nbsp;&nbsp;<el-radio v-model="radio" @input="changeFn" label="2"><span></span></el-radio>
                </p>
            </div>
            <!-- 切换图层3 -->
            <div class="btn_box">
                <img src="@/assets/map_logo/t_map_3.png" class="image" />
                <p>
                    地形眩晕&nbsp;&nbsp;<el-radio v-model="radio" @input="changeFn" label="3"><span></span></el-radio>
                </p>
            </div>
            <!-- 切换图层4 -->
            <div class="btn_box">
                <img src="@/assets/map_logo/t_map_4.png" class="image" />
                <p>
                    全球境界&nbsp;&nbsp;<el-radio v-model="radio" @input="changeFn" label="4"><span></span></el-radio>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
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
    height: 25px;
    font-size: 21px;
}

/* 图片盒子 */
.box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
}

/* 分开的盒子 */
.btn_box {
    width: 43%;
    height: 130px;
    border-radius: 8px;
    margin-bottom: 5px;
    background-color: #30358c8a;
    /* transition: 0.3s linear; */
}

.image {
    width: 100%;
    height: 70%;
    border-radius: 8px;
}

p {
    height: 20%;
    margin: 0;
    text-align: center;
    font-size: 15px;
    color: #fff;
}
</style>