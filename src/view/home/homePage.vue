<script setup>

import moduleTitle from '@/components/moduleTitle.vue';
import moduleFirst from '@/components/moduleFirst.vue';
import moduleSecond from '@/components/moduleSecond.vue';

</script>


<template>
    <dv-full-screen-container class="content bg">
        <!-- 标题 -->
        <moduleTitle></moduleTitle>

        <!-- 上边 -->
        <moduleFirst></moduleFirst>

        <!-- 下边 -->
        <moduleSecond></moduleSecond>


    </dv-full-screen-container>
</template>

<style scoped>
.bg {
    background: url(@/assets/bg.jpg) no-repeat center / cover;
}
</style>