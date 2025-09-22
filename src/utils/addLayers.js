import TileLayer from 'ol/layer/Tile'
import { WMTS } from 'ol/source'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { View } from 'ol'
import { get as getProjection } from 'ol/proj'
import { getWidth } from 'ol/extent'
import 'ol/ol.css'
import { Tile } from 'ol/layer'
import { useSelectStore } from '@/stores/select.js'



export default function myAddLayer(map, layerName1) {
    const selectStore = useSelectStore()
    var baseUrl = 'http://localhost/geoserver/gwc/service/wmts';
    var projection = getProjection('EPSG:4326'); //投影坐标系信息
    var projectionExtent = projection.getExtent(); //投影坐标系范围
    var size = getWidth(projectionExtent) / 256; //分辨率
    var resolutions = new Array(15); //分辨率数组
    var matrixIds = new Array(15); //缩放等级数组

    for (var i = 1; i < 16; i++) {
      resolutions[i - 1] = size / Math.pow(2, i);
      matrixIds[i - 1] = 'EPSG:4326:' + (i - 1);
    }

    var source = new WMTS({
      url: baseUrl,
      layer: layerName1,
      matrixSet: 'EPSG:4326', //投影坐标系设置矩阵
      format: 'image/png', //影像格式
      projection: projection, //投影坐标系
      tileGrid: new WMTSTileGrid({
        tileSize: [256, 256],//瓦片大小
        origin: [-180.0, 90.0], //原点
        extent: projectionExtent, //范围，与视图对应，此处也可用[-180.0,-90.0,180.0,90.0]
        resolutions: resolutions, //分辨率数组
        matrixIds: matrixIds //缩放等级数组，需要与分辨率数组相匹配。
      }),
      wrapX: true //是否在x方向上平铺
    });

    var layer = new Tile({
        source: source,
        isRemoveTile: true//是否移除瓦片
    })

    let views = new View({
        center: [112.66, 29.92],
        projection: "EPSG:4326",
        zoom: 9,
    });

    if (layerName1 != 'test:flood3') {
        map.addLayer(layer)
    }
    
    var resolution = views.getResolution(); //获取视图分辨率

    var tilegrid = source.getTileGrid(); //获取瓦片网格
    var tileResolutions = tilegrid.getResolutions(); //获取瓦片分辨率数组
    var zoomIdx, diff = Infinity; //缩放等级索引，分辨率差值无穷大

    for (var i = 0; i < tileResolutions.length; i++) {
      var tileResolution = tileResolutions[i];//瓦片分辨率
      var diffP = Math.abs(resolution - tileResolution);//视图-瓦片  分辨率差值
      if (diffP < diff) {
        diff = diffP;  // 保存更小的差值
        zoomIdx = i;  // 保存当前更匹配的层级索引
        }
      //关键终止条件：当瓦片分辨率 < 视图分辨率时，直接退出循环
      if (tileResolution < resolution) {
        break;
      }
    }

    //计算瓦片大小和原点
    var tileSize = tilegrid.getTileSize(zoomIdx);
    var tileOrigin = tilegrid.getOrigin(zoomIdx);
 
    var layerName = layerName1;   //图层或者图层组的名称
    var style = '';
    var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5',
      'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12',
      'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18',
      'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'
    ];
    var gridsetName = 'EPSG:4326';
    var format = 'image/png';

    var params = {
      'VERSION': '1.0.0',
      'LAYER': layerName,
      'STYLE': style,
      'TILEMATRIX': gridNames,
      'TILEMATRIXSET': gridsetName,
      'SERVICE': 'WMTS',
      'FORMAT': format
    };

    const handlerC = (evt) => {
        // console.log(evt);
        // 1. 计算点击位置相对于“瓦片原点”的**归一化坐标**（fx、fy）
        var fx = (evt.coordinate[0] - tileOrigin[0]) / (resolution * tileSize[0]);
        var fy = (tileOrigin[1] - evt.coordinate[1]) / (resolution * tileSize[1]);
        // 2. 根据之前计算的 zoomIdx，获取当前匹配的**瓦片矩阵 ID**（matrixIds）
        var matrixIds = tilegrid.getMatrixIds()[zoomIdx];
 
        var infoFormat = 'text/html';
        // 4. 计算点击位置所在的**瓦片列号（tileCol）**和**行号（tileRow）**
        var tileCol = Math.floor(fx);
        var tileRow = Math.floor(fy);
        // 5. 计算点击位置在**单个瓦片内部的像素坐标（tileI、tileJ）**
        var tileI = Math.floor((fx - tileCol) * tileSize[0]);
        var tileJ = Math.floor((fy - tileRow) * tileSize[1]);

        var url = baseUrl + '?'
        // 循环拼接params到URL中，其中TILEMATRIX会替换为当前匹配的层级（如EPSG:4326:9）
        for (var param in params) {
            if (param.toUpperCase() == 'TILEMATRIX') {
          url = url + 'TILEMATRIX=' + matrixIds + '&';// matrixIds是当前匹配的层级ID
            } else {
                url = url + param + '=' + params[param] + '&';
            }
        }
        
        // 最后补充GetFeatureInfo的关键参数（查询请求类型、返回格式、点击位置等）
        url = url +'SERVICE=WMTS&REQUEST=GetFeatureInfo' +
        '&INFOFORMAT=' + infoFormat +'&TileCol=' + tileCol +
        '&TileRow=' + tileRow +'&I=' + tileI +'&J=' + tileJ;
        
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function (e) {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    // 使用正则表达式获取<td>xxx</td>中的值，即是灰度值
                    // \ 转义字符
                    // . 匹配除换行符之外的任何单个字符
                    // + 匹配前面一个表达式1次或者多次
                  let reg1 = /<td>(.+)<\/td>/g
                  const num = reg1.exec(xmlhttp.responseText)[1]
                    //console.log(num) //灰度值
                  console.log("灰度值",num);  //灰度值
                    if (layerName1 == 'test:flood3') {
                        selectStore.setNowFloodSelect(num)
                    }else {
                        selectStore.setSelectResult(num)    
                    }
                } else {
                    console.log('error')
                }
            }
        }

        //拼接字符串url，通过get方式访问接口链接，返回结果  
        xmlhttp.open('GET', url, true);    
        xmlhttp.send();

  };
  
   map.on('singleclick', handlerC)
}