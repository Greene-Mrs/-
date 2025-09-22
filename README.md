该项目将新疆地区的洪涝、地震、塌陷、温度预警等风险以可视化的方式展示，最后结合各个固定风险因子，加上实时数据，通过计算，得到管道沿线的总体风险等级
项目展示：
<img width="1231" height="628" alt="image" src="https://github.com/user-attachments/assets/c8e6b662-42f8-42c8-b761-dea01dacb5a5" />
<img width="1064" height="626" alt="image" src="https://github.com/user-attachments/assets/1dd78166-34ee-45fd-ad40-29997c66d276" />
<img width="527" height="617" alt="image" src="https://github.com/user-attachments/assets/f5f90edb-0969-4831-9282-7c909669ab48" /><img width="744" height="437" alt="image" src="https://github.com/user-attachments/assets/59f9a05f-8ced-4bec-ae58-9d9b919aaf84" />


该项目需要下载geoserver，该项目需要数据
geoserver部署到8080端口，创建test工作区
将earthquake.csv部署为earthquake矢量数据并发布
pipe.csv部署为xinjiangpipe矢量数据并发布
collapse.csv部署为taxiancha矢量数据并发布

将earthquake1.tif部署为earthquake1 GeoTIFF数据并发布 将样式设置为eqTifststyle1
将CaveIn1.tif部署为CaveIn1 GeoTIFF数据并发布 将样式设置为caveinStlye1
将flood2.tif部署为flood1 GeoTIFF数据并发布 将样式设置为floodTifStyle1
将flood3.tif部署为flood3 GeoTIFF数据并发布








# new_work

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```
