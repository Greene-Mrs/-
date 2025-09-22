import { defineStore } from 'pinia'
import { ref } from 'vue'

//添加地图状态
export const useMapStore = defineStore('map1', () => { 

    const map1 = ref(null)
    const setMap = (m1) => {
        map1.value = m1
    }

    //地图中要显示的数据类型 1-4分别为矢量、影像、地形、深色
    const dataType = ref(1)
    const setDataType = (key) => {
        dataType.value = key
    }
    
    //右侧橙色按钮盒子要显示的组件
    const boxData = ref(0)
    const setBoxData = (key) => {
        boxData.
            value = key 
    }

   //需要添加的新图层
   const newVLayer = ref(null)
   const setNewVLayer = (k) => {
      newVLayer.value = k
    }
    
    //添加地图数据服务。目前只支持热力图
    const mapServer  = ref (0)
    const setMapServer = (data) => {
        // console.log(data)
        mapServer.value = data
    }

      //新添加的在线实时服务
    const newOlLayer = ref(null)
    const setNewOlLayer = (key) => {
        newOlLayer.value = key
    }

    //当前图层用于获取图名
    const nowLayer = ref('')
    const setNowLayer = (k) => {
        nowLayer.value = k
    }

    //设置从geoserver服务器中获取的数据 
    const geoServerLayerName = ref('')
    const setGeoServerLayerName = (k) => {  
        geoServerLayerName.value = k
    }

    return {
        map1,
        setMap,

        dataType,
        setDataType,
        
        boxData,
        setBoxData,

        newVLayer,
        setNewVLayer,

        mapServer,
        setMapServer,

        newOlLayer,
        setNewOlLayer,

        nowLayer,
        setNowLayer,
        
        geoServerLayerName,
        setGeoServerLayerName,
    }

})