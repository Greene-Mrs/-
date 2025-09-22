<script setup>
</script>

<template>
    <div class="module-box">
        <!-- 左流线 -->
        <div style="flex: 0 1 30%">
            <div small-bg>
                <dv-decoration-10 style="width: 100%; height: 5px" />
            </div>
        </div>

        <!-- 中间流线与标题-->
        <div style="flex: 0 1 40%">
            <div class="d-flex">

                <div small-bg>
                    <dv-decoration8 style="width:300px;height:50px;" />
                </div>
                <!-- 标题-->
                <div class="index-title">风险评估</div>

                <div small-bg>
                    <dv-decoration8 :reverse="true" style="width:300px;height:50px;" />
                </div>

            </div>
        </div>

        <!-- 右流线 -->
        <div style="flex: 0 1 30%">
            <div small-bg>
                <dv-decoration-10 style="width: 100%; height: 5px" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.index-title {
    font-size: 20px;
    white-space: nowrap;
    flex: 1;
    text-align: center;
}
</style>
