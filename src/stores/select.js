
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSelectStore = defineStore("select", () => {

    //查询天气坐标
    const weatherCoordinate = ref([]);
    const setWeatherCoordinate = (k) => { 
        weatherCoordinate.value = k;
    };

     //天气查询结果
  const weatherResult = ref({
      obsTime: "",   
      temp: "",   
      feelsLike: "",  
      icon: "",  
      text: ""  ,
      wind360: "",
      windDir: "",
      windScale: "",
      windSpeed: "",
      humidity: "",
      precip: "",
      pressure: "",
      vis: "",
      cloud: "",
      dew: "",
    });
    const setWeatherResult = (k) => {
    weatherResult.value = k;
    };
     
     
  //天气三天预报查询结果
  const weatherDayResult = ref({})
  const setWeatherDayResult = (k) => {
    weatherDayResult.value = k
  }


    //查询结果,存放灰度值
  const selectResult = ref(0)
  const setSelectResult = (k) => {
    selectResult.value = k
    }
    
    //当前天气灾害信息
    const nowDisaster = ref({
        fxLink: "",
        warning: [],
    });
    const setNowDisaster = (k) => {   
        nowDisaster.value = k; 
    };

    //实时查询功能
    const nowSelect = ref(0);
    const setNowSelect = (k) => { 
        nowSelect.value = k;
    };
    
    //洪涝专用
    const nowFloodSelect = ref(0);
    const setNowFloodSelect = (k) => {
        nowFloodSelect.value = k;
    };


    //要素查询
    const featureSelect = ref(1);
    const setFeatureSelect = (value1) => {
        featureSelect.value = value1;
    };

    //要素图层查询结果
    const featureResult = ref("");
    const setFeatureResult = (value1) => {
        featureResult.value = value1;
    };

    //清除查询结果
    const clearSelectedData =() => {
      featureResult.value = null;
      featureSelect.value = null;
    }

    return {
        //查询要素
        featureSelect,
        setFeatureSelect,

        //要素图层查询结果
        featureResult,
        setFeatureResult,

        clearSelectedData,

        //天气查询坐标
        weatherCoordinate,
        setWeatherCoordinate,

        //天气查询结果
        weatherResult,
        setWeatherResult,

        //当前天气灾害信息
        nowDisaster,
        setNowDisaster,

        //实时查询功能
        nowSelect,
        setNowSelect,

        //洪涝专用
        nowFloodSelect,
        setNowFloodSelect,

        //天气三天预报查询结果
        weatherDayResult,
        setWeatherDayResult,

        selectResult,
        setSelectResult
    };

});