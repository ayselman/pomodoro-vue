<template>
    <div class="hero min-h-screen bg-dark">
      <div class="w-full h-full items-center justify-center flex flex-col space-y-6">
          <!-- Menu -->
          <div class="flex space-x-4">
            
            <div 
              v-for="t,key in tab" :key="key"
              class="p-2 rounded-btn cursor-pointer" 
              :class="t.active ? 'bg-primary':'text-white'"
              @click="setTabActive(key)"
              >
              {{ t.title }}
            </div>
        
          </div>

          <!-- timer -->
          <div class="relative">
            {{ cMinutes }} {{ cSeconds }} {{ start }} {{ currentTime }}
            <div class="text-white text-12xl font-semibold leading-none px-4">


              <vue-countdown :auto-start="start" :time="currentTime" @end="onCountdownEnd"  @progress="timeProgress" v-slot="{ minutes, seconds }" v-if="start">
                  <div>{{ formatNumber(minutes) }}:{{ formatNumber(seconds) }} </div> x
              </vue-countdown>
              <div v-else>{{ formatNumber(cMinutes) }}:{{ formatNumber(cSeconds) }}</div>

            </div>
            <div class="bg-white opacity-20 w-full rounded-box  h-16 -mt-16"></div>
            
            
          </div>

          <!-- options -->
          <div class="pt-5">
            <div class="w-full flex space-x-4 justify-end">
              <button class="bg-primary p-1 rounded-full cursor-pointer hover:opacity-80" @click="end = true">
                <CogIcon class="w-10 text-gray-800" />
              </button>

              <button class="bg-primary p-1 rounded-full cursor-pointer hover:opacity-80" >
                <PlayIcon class="w-10 text-gray-800" @click="start = !start" v-if="!start"/>
                <PauseIcon class="w-10 text-gray-800" @click="start = !start" v-else/>
              </button>

              <button class="bg-primary p-1 rounded-full cursor-pointer hover:opacity-80" >
                <RefreshIcon class="w-10 text-gray-800" @click="currentTime = currentTime - 1"/>
              </button>
            </div>
          </div>
      </div>

    </div>


</template>


<script setup>
import {ref, watch} from 'vue'
import { PlayIcon, PauseIcon, CogIcon, RefreshIcon } from "@heroicons/vue/solid";
import VueCountdown from '@chenfengyuan/vue-countdown';


const cMinutes = ref(60)
const cSeconds = ref(60)
const time = ref(cMinutes.value * cSeconds.value * 1000) //ms
const currentTime = ref(time.value)
const lastTime    = ref(time.value)

const start  = ref(false)
const pause  = ref(false)


const tab = ref([
  {
    title: "Pomodoro",
    active: true
  },
  {
    title: "Short Break",
    active: false
  },
  {
    title: "Long Break",
    active: false
  }
])

watch(start, (cStart) => {
    if (cStart) {
      console.log();
      currentTime.value = lastTime.value
    }
})

const onCountdownEnd = () => {
  if (!start) {
      console.log("bitti");
  }else{
    console.log("durdu ama devam edecek");
  }
  
}


const timeProgress = (data) => {
  //console.log("Zaman Bitti", data.seconds);
  console.log("devam ediytor");
  cMinutes.value = data.minutes
  cSeconds.value = data.seconds
  lastTime.value = data.minutes * data.seconds * 1000
}

const formatNumber = (n) => {
  return n.toString().length == 1 ? `0${n}` : n
}

const setTabActive = key => {
  tab.value = tab.value.map((i, k) => {
    i.active = k == key 
    return i
  })
}


</script>