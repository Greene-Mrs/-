<script setup>

import { ref, watch } from 'vue'
import Map from '@/components/Map.vue'
import right_btn from '@/components/right/right-btn.vue'
import right_T1 from './right/right_T1.vue'
import right_T2 from './right/right_T2.vue'
import right_T3 from './right/right_T3.vue'

import left_btn from '@/components/left/left-btn.vue'
import left_btn2 from '@/components/left/left-btn2.vue'

import { useMapStore } from '@/stores/map.js'

//store管理
const mapStore = useMapStore()
//切换右边按钮跟随显示
const boxData = ref(0)

//监听store中boxData的变化，控制页面切换
watch(
    () => mapStore.boxData,
    (newValue) => {
        boxData.value = newValue
    }
)
</script>

<template>
    <div class="module-box">
        <!-- 左主件 -->
        <div style="flex: 0 1 25%">
            <div>
                <dv-border-box12 style="width: 100%; height: 200px">
                    <left_btn />
                </dv-border-box12>
            </div>

            <div>
                <dv-border-box12 style="width: 100%; height: 200px">
                    <left_btn2 />
                </dv-border-box12>
            </div>

        </div>

        <!-- 中间地图 -->
        <div style="flex: 0 1 50%">
            <div>
                <dv-border-box8 :dur="5" style="width: 100%; height: 400px; position: relative;">
                    <div
                        style="width: 96%; height: 94%;position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); ">
                        <Map />
                    </div>
                </dv-border-box8>
            </div>
        </div>

        <!-- 右主件 -->
        <div style="flex: 0 1 25%">
            <div>
                <dv-border-box12 style="width: 100%; height: 80px; overflow: hidden">
                    <right_btn />
                </dv-border-box12>
            </div>
            <div>
                <dv-border-box12 style="width: 100%; height: 320px; overflow: hidden">
                    <right_T1 v-show="boxData === 0"></right_T1>
                    <right_T2 v-show="boxData === 1"></right_T2>
                    <right_T3 v-show="boxData === 2"></right_T3>
                </dv-border-box12>
            </div>
        </div>

    </div>
</template>

<style scoped></style>