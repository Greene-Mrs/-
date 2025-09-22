<script setup>

import { ref } from 'vue'

import left_s1 from './left-s1.vue'
import left_s2 from './left-s2.vue'
import { useSelectStore } from '../../stores/select.js'

const selectStore = useSelectStore()

const featureSetlect = ref(1)

//要素查询，1为管道查询，2为历史点查询
const select = (value1) => {
    featureSetlect.value = value1
    selectStore.setFeatureSelect(value1)
}
</script>

<template>
    <div class="b2_content">
        <div class="btn_box">
            <el-button type="primary" class="btn" @click="select(1)">管道查询</el-button>
            <el-button type="primary" class="btn" @click="select(2)">历史点查询</el-button>
            <el-button type="primary" class="btn">取消查询</el-button>
        </div>
        <div class="res_box">
            <left_s1 v-show="featureSetlect == 1"></left_s1>
            <left_s2 v-show="featureSetlect == 2"></left_s2>
        </div>
    </div>
</template>

<style scoped>
.b2_content {
    display: flex;
    flex-direction: row;
    width: 100%;

    .btn_box {
        width: 24%;
        display: flex;
        flex-direction: column;
        justify-content: left;
        margin-top: 15px;
        margin-left: 2px;

        .btn {
            width: 80%;
            margin: 10px;

            display: flex;
            height: 40px;
            /* 先给按钮设置固定高度（可根据需求调整） */
            line-height: 40px;
            /* 行高 = 按钮高度，实现垂直居中 */
        }
    }

    .res_box {
        width: 90%;
        height: 170px;
        display: flex;
        margin: 15px 10px;
        background-color: #ac10dc57;
        border-radius: 8px;
    }
}
</style>