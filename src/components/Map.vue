<script setup>

import { onMounted, ref, watch } from 'vue'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import Style from 'ol/style/Style.js'; // 样式容器
import Fill from 'ol/style/Fill.js';   // 填充样式（用于面、文本背景等）
import Stroke from 'ol/style/Stroke.js'; // 边框/线条样式（用于线、面边框等）
import Circle from 'ol/style/Circle.js'; // 圆形样式（用于点）
import { getVectorContext } from 'ol/render'
import { useMapStore } from '@/stores/map.js'// 导入图层配置(地图store管理)
import { useSelectStore } from '@/stores/select.js'// 导入查询地图的配置（查询store），实现交互存储功能
const selectStore = useSelectStore()
const mapStore = useMapStore()
//实现交互
import Select from 'ol/interaction/Select.js' // 导入ol的交互，用于选择要素
import { click } from 'ol/events/condition.js'; // 导入交互条件
import HeatmapLayer from 'ol/layer/Heatmap.js'//导入热力图
//添加tif

import myAddLayer from '@/utils/addLayers.js'//导入添加图层函数

// 天地图相关瓦片、标注
const key = 'c9bd81e21bc2755628e03b96b1cab6cb'
const tileURL = 'http://t{1-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk='
const markURL = 'http://t1.tianditu.gov.cn/cva_w/wmts?tk='//不能用
const markURL2 = 'http://t{1-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk='
const markURL3 = 'https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk='

// 导入本地GeoJSON文件
import Xinjiang from '@/assets/xinjiang.json'

// 创建矢量数据源，通过GeoJSON格式解析数据
const xinjiangSource = new VectorSource({
    //将 GeoJSON 数据转换为 OpenLayers 可识别的Feature对象
    features: new GeoJSON().readFeatures(Xinjiang, {
        dataProjection: 'EPSG:4326',  // 数据本身的坐标投影
        featureProjection: 'EPSG:4326'  // 地图使用的坐标投影
    })
})

// 地图实例（方面初始化底图、添加管道地图都是在一个map上） 
const map1 = ref(null)

// 创建矢量图层（VectorLayer）
const xinjiangLayer = new VectorLayer({
    source: xinjiangSource,
    style: new Style({
        fill: new Fill({
            color: 'rgba(25, 25, 255, 0.3)',
        }),
        stroke: new Stroke({
            color: '#319FD3',
            width: 1
        }),
    })
})

//瓦片图层
const tileURLs = ref('')

// 监听瓦片底图配置
watch(
    () => mapStore.dataType,//要监听哪个数据
    (newData) => {
        //newData为变化后的新值，
        // 根据新的底图类型设置对应的瓦片URL
        switch (newData) {
            case '1':
                tileURLs.value =
                    'http://t{1-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + key;
                break;
            case '2':
                tileURLs.value =
                    'http://t{1-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + key;
                break;
            case '3':
                tileURLs.value =
                    'http://t{1-7}.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=' + key;
                break;
            case '4':
                tileURLs.value =
                    'http://t{1-7}.tianditu.com/DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + key;
                break;
            default: console.log('未找到对应的数据源');
                break;
        }

        // 先获取所有图层的副本，避免遍历中修改数组导致问题
        const layers = [...map1.value.getLayers().getArray()];

        // 删除之前的底图
        if (map1.value) {
            layers.forEach(layer => {
                // 判断是否需要删除
                if (layer.get('isRemoveLayer')) {
                    layer.getSource().clear() // 清除图层数据源
                    map1.value.removeLayer(layer);
                }
            })
        }

        // 添加新的底图
        if (map1.value) {
            const CurrentTileLayer = new TileLayer({

                isRemoveLayer: true,// 标记为需要删除的图层
                source: new XYZ({
                    url: tileURLs.value
                })
            })// 插入到底部（索引0的位置）
            map1.value.getLayers().insertAt(0, CurrentTileLayer);
        }
    }
)

// 监听地图实例
onMounted(() => {
    initMap()
    // 地图初始化后延迟加载管道数据
    setTimeout(() => {
        addPipeData();
        console.log('管道数据加载完成');
    }, 1000);
})


//地震、塌陷点样式
const pointStyle = new Style({
    image: new Circle({
        radius: 5, //半径
        fill: new Fill({
            color: 'yellow'
        }), //填充颜色
        stroke: new Stroke({
            color: 'green',
            width: 1
        }) //外环颜色和粗细
    })
})
// 地震图层
const earthquakeURL = 'http://localhost/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Aearthquake&maxFeatures=5000&outputFormat=application%2Fjson'
const earthquakeSource = new VectorSource({
    url: earthquakeURL,
    format: new GeoJSON(),
    crossOrigin: 'anonymous'
})
const newEarthQuakeLayer = new VectorLayer({
    // 标记
    isNew: true,
    source: earthquakeSource,
    style: pointStyle
})

const isHeartLayerAdded = ref(false);
// 监视需要新添加的数据变化
watch(
    () => mapStore.newVLayer,
    (newData) => {
        if (newData === 10) {
            console.log('newData:', newData)
            if (!isHeartLayerAdded.value) {
                console.log('newData10（地震）:', newData);
                map1.value.addLayer(newEarthQuakeLayer)
                console.log('热力图10（地震）图层首次添加成功');
                isHeartLayerAdded.value = true;
            } else {
                // 容错：图层已添加时提示（避免重复操作）
                console.log('热力图10（地震）图层无需重复添加：已存在于地图中');
            }
            mapStore.newVLayer = null;
        }
        if (newData === 101) {
            console.log('newData:', newData)
            if (!isHeartLayerAdded.value) {
                console.log('newData101（坍塌）:', newData);
                map1.value.addLayer(newCaveInLayer)
                console.log('热力图101（坍塌）图层首次添加成功');
                isHeartLayerAdded.value = true;
            } else {
                // 容错：图层已添加时提示（避免重复操作）
                console.log('热力图101（坍塌）图层无需重复添加：已存在于地图中');
            }
            mapStore.newVLayer = null;
        }
    }
)

//历史沉降坍塌数据
const CaveInURL = 'http://localhost/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Ataxiancha&outputFormat=application%2Fjson&maxFeatures=5000'
const CaveInSource = new VectorSource({
    url: CaveInURL,
    format: new GeoJSON(),
    crossOrigin: 'anonymous'
})
const newCaveInLayer = new VectorLayer({
    // 标记
    isNew: true,
    source: CaveInSource,
    style: pointStyle
})


// 初始化地图
const initMap = () => {

    // 天地图视角
    const view = new View({
        center: [85.6167, 41.8267],
        zoom: 5,
        projection: 'EPSG:4326'
    })

    //  加载新疆瓦片(m默认第一张)
    const firstTileLayer = new TileLayer({
        isRemoveLayer: true,
        source: new XYZ({
            url: tileURL + key
        })
    })

    // 添加新疆注记瓦片
    const markTileLayer = new TileLayer({
        source: new XYZ({
            url: markURL2 + key
        })
    })

    // 创建地图实例
    map1.value = new Map({
        target: 'map',
        layers: [firstTileLayer, markTileLayer],
        view: view,
        // 禁用地图控件
        controls: []
        // 禁用所有默认交互
        //interactions: []
    })

    // 添加新疆矢量图层
    map1.value.addLayer(xinjiangLayer)
    // 添加注记图层到最顶层
    /* map1.value.addLayer(markTileLayer); */1

    //添加管道
    addPipeData();

    //天气点击查询坐标
    map1.value.on('click', (e) => {
        console.log('天气查询点击的坐标：', e.coordinate)
        selectStore.setWeatherCoordinate(e.coordinate)
    })

    myAddLayer(map1.value, 'test:flood3')
}

//管道数据（要先配置跨服务器请求，路径不能有空格）
const pipeData = 'http://localhost/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Apipe_clip&outputFormat=application%2Fjson&maxFeatures=50'

// 创建管道矢量数据源
const pipeSource = new VectorSource({
    url: pipeData,
    crossOrigin: 'anonymous',// 允许跨域请求
    format: new GeoJSON({
        dataProjection: 'EPSG:4326',  // 根据实际数据投影修改
        featureProjection: 'EPSG:4326'  // 与地图投影保持一致
    })
})

// 创建管道矢量图层
const pipeLayer = new VectorLayer({
    source: pipeSource,
    style: new Style({
        stroke: new Stroke({
            /* color: 'rgba(255, 255, 0, 0.5)', */
            /* color: 'rgba(255, 165, 0, 0.5)', */
            color: 'rgb(139, 69, 19)',
            width: 2
        })
    })
})

//添加管道数据
const addPipeData = () => {

    // 添加管道矢量图层到地图
    map1.value.addLayer(pipeLayer)
    /* console.log('管道图层正在添加到地图', pipeLayer); */

    // 新增：管道图层加载完成后，初始化Select交互（确保图层存在后再绑定）
    // featuresloadend：数据源成功加载并解析所有Feature后触发
    pipeSource.once('featuresloadend', () => {
        initSelectInteraction();
        console.log('管道图层数据源加载完成，Select交互已初始化');
    });

    // 可选：添加加载失败监听（用于调试）
    pipeSource.once('loaderror', (error) => {
        console.error('管道数据加载失败：', error);
        alert('管道图层加载失败，请检查GeoServer连接或跨域配置');
    });
}

//1.被选中的要素的样式为边缘高亮(管道的高亮样式)
const selectedHighlightStyle = () => {
    return new Style({
        image: new Circle({
            radius: 8, // 选中后点的半径（比默认5大，更醒目）
            fill: new Fill({
                color: 'rgba(255, 255, 0, 1)' // 点内部填充色（亮黄色，突出）
            }),
            stroke: new Stroke({
                color: 'rgba(255, 0, 0, 1)', // 点边框色（红色，强化对比）
                width: 2 // 点边框宽度
            })
        }),
        //面要素
        fill: new Fill({
            //  color: 'rgba(255, 255, 255, 1)', 轻微白色填充，不影响主体
            color: 'black',
        }),
        //  线要素重点：设置白色边框（白边效果）
        stroke: new Stroke({
            color: 'rgba(255, 0, 0, 1)', //红色边框
            width: 3, // 边框宽度，适当加大更明显
            lineCap: 'round', // 线条端点圆润（可选）
            lineJoin: 'round' // 线条拐角圆润（可选）
        }),
    })
}

let select1 = null;// 用于存储选择交互的变量
const highlightStyle = selectedHighlightStyle();  // 初始化高亮样式

// 2.创建「只作用于管道图层」的Select交互（核心：添加filter筛选图层）
const createSelectInteraction = () => {
    return select1 = new Select({
        condition: click,
        //layers: [pipeLayer],// 只作用于管道图层
        style: highlightStyle,
        multi: false, // 禁止多选（默认false，单击一次选一个要素）
        filter: (feature, layer) => {
            console.log('selectStore.featureSelect：', selectStore.featureSelect);
            if (selectStore.featureSelect == 1) {
                console.log('1此时为管道查询');
                return layer === pipeLayer;
            }
            else if (selectStore.featureSelect == 2) {
                console.log('2此时为点查询');
                return layer.get('isNew')
            }
        },
    });
}

// 3. 初始化选择交互（在地图和管道图层加载完成后执行）
const initSelectInteraction = () => {

    //移除原有，防止出现2个及以上选择交互
    if (select1) {
        map1.value.removeInteraction(select1);
    }
    select1 = createSelectInteraction();
    map1.value.addInteraction(select1);

    //4. 监听选择事件（可选：添加选中状态提示/数据存储）
    select1.on('select', (e) => {
        const selectedFeatures = e.selected;// 选中的要素
        const deselectedFeatures = e.deselected;

        // （可选）控制台打印选中状态（方便调试）
        if (selectedFeatures.length > 0) {
            console.log('选中的管道（历史点）要素：', selectedFeatures[0].getProperties());

            // 若需存储到selectStore，可在此处添加：
            selectStore.setFeatureResult(selectedFeatures[0].getProperties());
            console.log('选中的要素已存储到selectStore.featureResult', selectStore.featureResult);

        } else if (deselectedFeatures.length > 0) {
            console.log('取消选中的管道要素：', deselectedFeatures[0].getProperties());

            // （可选）取消选中时清空store：
            selectStore.setFeatureResult(null);
            console.log('取消选中后的管道要素应该为空：', selectStore.featureResult)
            /* selectStore.setFeatureSelect(null);
             console.log('取消选中后的选择要素应该为空：', selectStore.featureSelect)   */
        }
        //（可选）页面显示选中状态（需在模板中添加id为status的元素）
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.innerHTML = `选中要素：${selectedFeatures.length}个 |
               取消选中：${deselectedFeatures.length}个 `;
        }
    });// 交互为点击（click），双击会选中要素并放大（单击（altKeyOnly）不选中，双击后放大地图，这里用的是点击），pointerMove 为悬浮
}


// 新增：组件内局部标记（默认未创建）
const isHeatmapCreated = ref(false)
//实时数据标记
const isNowLayers = ref(false)

const handlerCilck = ref(null)

//设置地图服务（热力图）
watch(
    () => mapStore.mapServer,
    (newVal) => {
        if (mapStore.mapServer == 1 && !isHeatmapCreated.value) {
            console.log('地图服务发生变化:现在为添加地震热力图，mapStore.mapServer应该为1:', newVal);
            // 添加热力图层
            const HeatMapLayer1 = new HeatmapLayer({
                source: earthquakeSource,
                blur: 25,
                radius: 10,
                opacity: 0.76
            })
            console.log('地震热力图已加载完成：', HeatMapLayer1)
            map1.value.addLayer(HeatMapLayer1);
            // 关键：将“地震热力图已创建”标记设为 true（后续触发会跳过）
            isHeatmapCreated.value = true;
            //重置地图存储为空
            mapStore.setMapServer(0)

        } else if (mapStore.mapServer == 2 && !isHeatmapCreated.value) {
            console.log('地图服务发生变化:现在为添加坍塌热力图，mapStore.mapServer应该为2:', newVal);
            // 添加热力图层
            const HeatMapLayer2 = new HeatmapLayer({
                source: CaveInSource,
                blur: 25,
                radius: 10,
                opacity: 0.76
            })
            console.log('坍塌热力图已加载完成：', HeatMapLayer2)
            map1.value.addLayer(HeatMapLayer2);
            // 关键：将“地震热力图已创建”标记设为 true（后续触发会跳过）
            isHeatmapCreated.value = true;
            //重置地图存储为空
            mapStore.setMapServer(0)

        } else if (mapStore.mapServer == -1) {
            const mapLayers = map1.value.getLayers().getArray()
            const listLength = mapLayers.length
            console.log('地图图层数量：', listLength)
            for (let i = 0; i < listLength; i++) {
                if (i >= mapLayers.length) {
                    break
                }
                const layer = mapLayers[i]
                if (
                    layer instanceof HeatmapLayer || layer.get('isNew') || (layer instanceof TileLayer && !layer.get('isRemoveLayer'))
                ) {

                    map1.value.removeLayer(layer)
                    console.log('已移除地震（坍塌）图层');

                    isHeartLayerAdded.value = false;
                    console.log('将地震（坍塌）图层已添加标记设为 false');
                    i--;
                }
                console.log('该图层正在移除：', layer)
            }
            // 关键：将“热力图已创建”标记设为 false(能再次添加热力图)
            isHeatmapCreated.value = false;
            if (map1.value) {
                map1.value.un('singleclick', handlerCilck.value);
            }
            const listInteractions = map1.value.getInteractions().getArray()
            console.log('listInteractions:', listInteractions)
            mapStore.setMapServer(0)
            // 关键：将“热力图已创建”标记设为 false(能再次添加热力图)
            console.log('mapServer:', mapStore.mapServer);
            const listLength1 = mapLayers.length
            console.log('删除后地图图层数量：', listLength1)
        } else if (mapStore.mapServer == 3 && !isNowLayers.value) {
            console.log('地图服务发生变化:现在为添加实时天气图层，mapStore.mapServer应该为3:', newVal);
            const olWeatherLayer = new TileLayer({
                source: new XYZ({
                    url: mapStore.newOlLayer,

                }),
                //透明度为0.8
                opacity: 0.7
            })
            map1.value.addLayer(olWeatherLayer)
            mapStore.setMapServer(0)
            console.log('实时图层已加载完成11111111111111：', olWeatherLayer)
        } else if (mapStore.mapServer == 4 && !isNowLayers.value) {
            console.log('地图服务发生变化:现在为天机tif，mapStore.mapServer应该为4:', newVal);
            //加载geoServer数据，tif数据
            handlerCilck.value = myAddLayer(map1.value, mapStore.geoServerLayerName)
            mapStore.setMapServer(0)
        }
    }
)


</script>

<template>
    <div id="map" class="map1"></div>
</template>

<style scoped>
.map1 {
    width: 100%;
    height: 400px;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    background-color: #ffffff4f;
}
</style>
