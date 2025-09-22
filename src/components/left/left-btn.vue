<script setup>
import { onUnmounted } from 'vue';
import { onMounted } from 'vue';
import { useMapStore } from '../../stores/map'
import { ref } from 'vue';
// 日期和时间数据
const currentDate = ref('')
const currentTime = ref('')
const mapStore = useMapStore()

// 获取当前日期和时间
const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')//确保日期时间各部分为两位数格式
    const date = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    currentDate.value = `${year}-${month}-${date}`
    currentTime.value = `${hours}:${minutes}:${seconds}`
}

// 每秒更新日期和时间
// 1. 存储定时器 ID（setInterval 调用后返回的唯一标识）
const timerId = ref(null);


// 2.要在组件销毁时清除定时器防止内存泄漏

// 2. 组件销毁时清除定时器
onUnmounted(() => {
    clearInterval(timerId.value);  // 通过定时器 ID 停止定时循环
});

// 3. 在组件挂载时获取当前日期和时间
onMounted(() => {
    getCurrentDateTime()
    timerId.value = setInterval(getCurrentDateTime, 1000);
});
</script>

<template>
    <div class="content">
        <!-- 右标 -->
        <div class="title_box">
            <dv-decoration7 class="dv_title"> &nbsp;实时信息&nbsp; </dv-decoration7>
        </div>
        <!-- 雷达图 -->
        <dv-decoration-12 style="width: 120px; height: 120px; margin-left: 10px" />
        <!-- 日期时间 -->
        <div class="txt_box">
            <p>日期：{{ currentDate }}</p>
            <p>时间：{{ currentTime }}</p>
            <p v-show="mapStore.nowLayer != ''">当前图层：{{ mapStore.nowLayer }}</p>
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
    /* 居中 */
    text-align: center;
}

.txt_box {
    position: absolute;
    top: 35px;
    right: 0;
    display: inline-block;
    width: 250px;
    height: 100%;
    text-align: left;
}

p {
    padding: 2px;
    margin: 0;
    font-size: 20px;
}
</style>