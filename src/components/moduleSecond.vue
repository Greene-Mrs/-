<script setup>

import { ref, computed, watch, onMounted } from 'vue'
import { useSelectStore } from '@/stores/select.js'
import { useMapStore } from '@/stores/map.js'
import { getWeather, getWeatherDay, getDisaster } from '@/api/weather.js'


//地图pinia
const mapStore = useMapStore()
//天气查询结果pinia
const selectStore = useSelectStore()

const selectRank = ref('风险等级')
const eqRiskArray = [0.07, 0.23, 0.51, 1]
const caveRiskArray = [0.04, 0.36, 0.64, 1]
const floodRiskArray = [0.14, 0.36, 0.58, 0.7, 1]

//实时风险等级
const nowWeatherFor = ref([40, 40, 40, 50, 50])
const dayArray = ref([])
const colorArray = ref(['#32c5e9', '#32c5e9', '#32c5e9', '#32c5e9', '#32c5e9'])

// 初始化日期数组
const initDayArray = () => {
    const days = ['今天', '明天', '后天']
    const date = new Date()

    for (let i = 0; i < 5; i++) {
        if (i < 3) {
            dayArray.value.push(days[i])
        } else {
            date.setDate(date.getDate() + 1)
            dayArray.value.push(`${date.getMonth() + 1}月${date.getDate()}日`)
        }
    }
}

// 在组件挂载时初始化日期
onMounted(() => {
    initDayArray()
})

let resArray = []
//设置等级
const setRank = () => {
    const res = Number(selectStore.selectResult)
    if (mapStore.geoServerLayerName == 'test:earthquake1') {
        //地震等级数组
        resArray = eqRiskArray
    } else if (mapStore.geoServerLayerName == 'test:CaveIn1') {
        // 坍塌等级数组
        resArray = caveRiskArray
    } else if (mapStore.geoServerLayerName == 'test:flood1') {
        // 洪水等级数组
        resArray = floodRiskArray
    }
    if (res < resArray[0]) {
        selectRank.value = '历史风险等级:低风险地区'
    } else if (res < resArray[1]) {
        selectRank.value = '历史风险等级:中风险地区'
    } else if (res < resArray[2]) {
        selectRank.value = '历史风险等级:高风险地区'
    } else if (res < resArray[3]) {
        selectRank.value = '历史风险等级:极高风险地区'
    }
}
watch(
    () => selectStore.selectResult,
    () => {
        setRank()
    }
)


//根据地址获取天气信息
watch(
    () => selectStore.weatherCoordinate,
    async (newVal) => {
        if (newVal.length > 0) {

            //天气查询
            const res = await getWeather(newVal)

            selectStore.setWeatherResult(res.data.now)

            //T3显示3天
            if (selectStore.nowSelect == 1) {
                //天气三天预报查询
                const res2 = await getWeatherDay(newVal)
                console.log(res2.data.daily)
                selectStore.setWeatherDayResult(res2.data.daily)
            }
            //天气灾害预警
            const res3 = await getDisaster(newVal)
            console.log(res3)
            selectStore.setNowDisaster(res3.data)
        }
    }
)

//根据最终结果设置等级颜色
watch(
    () => selectStore.weatherDayResult,
    (newVal) => {
        for (let i = 0; i < 5; i++) {
            nowWeatherFor.value[i] = getDayFloodFor(
                newVal[0].precip,
                newVal[1].precip,
                newVal[2].precip
            ).toFixed(2)
            if (nowWeatherFor.value[i] < 0.3) {
                colorArray.value[i] = '#32c5e9'
            } else if (nowWeatherFor.value[i] < 0.45) {
                colorArray.value[i] = '#54B94D'
            } else if (nowWeatherFor.value[i] < 0.6) {
                colorArray.value[i] = '#F2DF54'
            } else {
                colorArray.value[i] = '#D03246'
            }
        }
    }
)

const getDayFloodFor = (k1, k2, k3) => {
    const all = +k1 + +k2 + +k3
    let x1 = 0
    let x2 = 0
    if (+k1 <= 50) {
        x1 = 0
    } else if (+k1 <= 150) {
        x1 = (3 * +k1) / 400
    } else {
        x1 = 1
    }
    if (all <= 100) {
        x2 = 0
    } else if (all <= 250) {
        x2 = (3 * +all) / 200
    } else {
        x2 = 1
    }
    return +(x1 * +k1) + +(x2 * all) + +selectStore.nowFloodSelect
}

/* 油表图 */
const option1 = computed(() => ({
    title: {
        text: selectRank.value,
        style: {
            fill: '#fff',
        }
    },
    series: [
        {
            type: 'gauge',
            data: [{ name: 'itemA', value: selectStore.selectResult * 100 }],
            center: ['50%', '55%'],
            axisLabel: {
                formatter: '{value}%',
                style: {
                    fill: '#fff'
                }
            },
            axisTick: {
                style: {
                    stroke: '#fff'
                }
            },
            animationCurve: 'easeInOutBack'
        }
    ]
}))

/* 胶囊图 */
const config1 = computed(() => ({
    data: [
        {
            name: dayArray.value[0] || '今日风险',
            value: nowWeatherFor.value[0]
        },
        {
            name: dayArray.value[1] || '明天',
            value: nowWeatherFor.value[1]
        },
        {
            name: dayArray.value[2] || '后天',
            value: nowWeatherFor.value[2]
        },
        {
            name: dayArray.value[3] || '第4天',
            value: nowWeatherFor.value[3]
        },
        {
            name: dayArray.value[4] || '第5天',
            value: nowWeatherFor.value[4]
        },
    ],
    colors: colorArray.value,
    showValue: true,
}))


</script>

<template>
    <div class="module-box">
        <!-- 左边天气 -->
        <div style="flex: 0 1 25%">
            <dv-border-box12 style="width: 100%; height: 240px ">
                <div class="content">

                    <div class="weather-card">
                        <div class="top-info">
                            <div class="weather-status">
                                天气状况：{{ selectStore.weatherResult.text }}
                            </div>
                            <div class="wind-info">
                                <span>风向：{{ selectStore.weatherResult.windDir }}</span>
                                <span>风速： {{ selectStore.weatherResult.windSpeed }}公里/小时</span>
                            </div>
                        </div>
                        <div class="Coord">
                            位置：{{ selectStore.weatherCoordinate }}
                        </div>

                        <div class="data-cards">
                            <div class="data-card">
                                <p>温度</p>
                                <p class="value">
                                    {{ selectStore.weatherResult.temp }}
                                </p>
                                <p class="sub-value">单位：摄氏度</p>
                            </div>
                            <div class="data-card">
                                <p>大气压强</p>
                                <p class="value">
                                    {{ selectStore.weatherResult.pressure }}
                                </p>
                                <p class="sub-value">单位：百帕</p>
                            </div>
                            <div class="data-card">
                                <p>过去一小时降雨量</p>
                                <p class="value">{{ selectStore.weatherResult.precip }}</p>
                                <p class="sub-value">单位：毫米</p>
                            </div>
                            <div class="data-card">
                                <p>能见度</p>
                                <p class="value">{{ selectStore.weatherResult.vis }}</p>
                                <p class="sub-value">单位：公里</p>
                            </div>
                        </div>
                    </div>

                </div>
            </dv-border-box12>
        </div>
        <!-- 中间部分 -->
        <div style="flex: 0 1 50%">
            <dv-border-box12 style="width: 100%; height: 240px ">
                <div class="content">
                    <!-- 油表 -->
                    <div>
                        <dv-charts :option="option1" class="chart1" />
                    </div>
                    <!-- 胶囊表 -->
                    <div>
                        <dv-capsule-chart :config="config1" class="chart2" />
                    </div>
                    <!-- 图例 -->
                    <div class="legend">
                        <div class=" legend-item">
                            <div class="legend-color" style="background-color: #32c5e9"></div>
                            <span>无风险</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #54b94d"></div>
                            <span>低风险</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #f2df54"></div>
                            <span>中风险</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #d03246"></div>
                            <span>高风险</span>
                        </div>
                    </div>
                </div>
            </dv-border-box12>
        </div>
        <!-- 右边部分 -->
        <div style="flex: 0 1 25%">
            <dv-border-box12 style="width: 100%; height: 240px ">
                <div class="disaster" v-if="selectStore.nowDisaster.warning.length == 0">
                    <div class="unDis">暂无气象灾害预警</div>
                </div>
                <div class="warning" v-else>
                    <div class="warning_box">
                        预警类型：{{ selectStore.nowDisaster.warning[0].level + selectStore.nowDisaster.warning[0].typeName
                        }}预警
                    </div>
                    <div class="warning_box">
                        危险等级：{{ selectStore.nowDisaster.warning[0].severity }}
                    </div>
                    <div class="warning_box">
                        发布单位：{{ selectStore.nowDisaster.warning[0].sender }}
                    </div>
                    <div class="warning_box">
                        发布时间：{{ selectStore.nowDisaster.warning[0].pubTime }}
                    </div>
                </div>
                <div class="toLink">
                    <a :href="selectStore.nowDisaster.fxLink || ''">详细数据</a>
                </div>

            </dv-border-box12>
        </div>

    </div>


</template>

<style scoped>
.content {
    display: flex;
    width: 100%;
    height: 100%;
}

.weather-card {
    background-color: #0b1b3a;
    color: #fff;
    border-radius: 5px;
    width: 95%;
    height: 90%;
    margin: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    overflow: hidden;

    /* 顶部信息区域样式 */
    .top-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 12px;
        background-color: #081227;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .weather-status {
        font-size: 14px;
        font-weight: bold;
    }

    .wind-info {
        font-size: 12px;
        display: flex;
        gap: 10px;
    }

    .Coord {
        font-size: 12px;
        display: flex;
        text-align: center;
        margin-left: 8px 0;

    }

    /* 数据卡片容器样式 */
    .data-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        padding: 1px;
        background-color: rgba(255, 255, 255, 0.1);
    }

    /* 单个数据卡片样式 */
    .data-card {
        background-color: #0b1b3a;
        text-align: center;
        padding: 3px;
    }

    /*  .data-card p {} */

    /* 数据卡片容器样式 */
    .data-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        padding: 1px;
        background-color: rgba(255, 255, 255, 0.1);
    }

    /* 单个数据卡片样式 */
    .data-card {
        background-color: #0b1b3a;
        text-align: center;
        padding: 3px;
    }

    .data-card p {
        margin: 5px 0;
    }

    .value {
        font-size: 16px;
        font-weight: bold;
    }

    .sub-value {
        font-size: 14px;
        opacity: 0.8;
    }
}

.chart1 {
    width: 250px;
    height: 110%;
    padding: 3px;
    font-size: 20px;
}

.chart2 {
    width: 360px;
    height: 90%;
    margin-top: 15px;
    font-size: 2px;
}

.legend {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100px;
    height: 100%;
    padding: 10px;
    gap: 8px;
    margin-left: 30px;
}

.legend-item {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 14px;
}

.legend-color {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.disaster {
    padding: 4px;
    display: flex;
    width: 100%;
    height: 20px;

    .unDis {
        margin: auto;
        font-size: 20px;
    }
}

.warning {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.warning_box {
    font-size: 20px;
    margin: 5px;
}

.toLink {
    font-size: 20px;
    margin: 5px;
    text-align: center
}
</style>