<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import 'echarts-extension-amap'
import { EffectScatterChart, PieChart, ScatterChart } from 'echarts/charts'
import { GeoComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'

import { CanvasRenderer } from 'echarts/renderers'
import { computed, ref, watchEffect } from 'vue'
// 引入高德地图官方提供的 2.0 类型定义文件
import '@amap/amap-jsapi-types'
import axios from 'axios'
import { registerMap } from 'echarts'
window._AMapSecurityConfig = {
  securityJsCode: 'c7736ae9d9d38f29f4e381db37af98e0'
}
use([
  CanvasRenderer,
  PieChart,
  ScatterChart,
  EffectScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GeoComponent
])

const option = ref<any>()
const chartRef = ref()
const Key = '3a8fba195e7666da013aeb740a6a356b'
const amapUrl = 'https://restapi.amap.com/v3/config/district'
const amapName = ref('中国')

const { data: amapData, isSuccess: amapIsSuccess } = useQuery({
  queryKey: [{ key: 'amapAdcode', amapName }],
  queryFn: async () =>
    (await axios.get(`${amapUrl}?key=${Key}&subdistrict=0&keywords=${amapName.value}`)).data
})
const aliAdcode = computed(() => amapData.value?.districts[0].adcode)
const aliEnabled = computed(() => !!amapData.value)

const { data: aliData, isSuccess: aliIsSuccess } = useQuery({
  queryKey: [{ key: 'aliGeo', aliAdcode }],
  queryFn: async ({ queryKey: [{ aliAdcode }] }) =>
    (await axios.get(`https://geo.datav.aliyun.com/areas_v3/bound/${aliAdcode}_full.json`)).data,
  enabled: aliEnabled
})

watchEffect(() => {
  if (aliIsSuccess.value) {
    registerMap('map', aliData.value)
    option.value = {
      backgroundColor: '#404a59',
      tooltip: {
        trigger: 'item'
      },
      geo: {
        map: 'map',
        emphasis: {
          label: {
            show: false
          },
          itemStyle: {
            areaColor: '#2a333d'
          }
        },
        itemStyle: {
          areaColor: '#323c48',
          borderColor: '#111'
        }
      }
    }
  }
})

const handleChangeGeo = (event: any) => {
  console.log(event)
  amapName.value = event.name
}
</script>

<template>
  <v-charts
    class="chart"
    :option="option"
    autoresize
    :ref="
      (el: any) => {
        if (el.chart && el.chart.getModel()) {
          chartRef = el
        }
      }
    "
    @geoselectchanged="handleChangeGeo"
  />
</template>

<style scoped>
.chart,
#map-container {
  height: 100vh;
}
</style>
