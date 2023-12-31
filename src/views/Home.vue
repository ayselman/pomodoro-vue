<template>
  <div class="hero min-h-screen bg-dark">
    <div class="w-full h-full items-center justify-center flex flex-col space-y-6">
        <!-- Menu -->
        <div class="flex space-x-4">
          
          <div class="p-2 rounded-btn cursor-pointer"  :class="pomodoro.type == 'pomodoro' ? 'bg-primary':'text-white'" @click="pomodoro.type = 'pomodoro'"> Pomodoro </div>
          <div class="p-2 rounded-btn cursor-pointer"  :class="pomodoro.type == 'short_break' ? 'bg-primary':'text-white'" @click="pomodoro.type = 'short_break'"> Short Break </div>
          <div class="p-2 rounded-btn cursor-pointer"  :class="pomodoro.type == 'long_break' ? 'bg-primary':'text-white'" @click="pomodoro.type = 'long_break'"> Long Break </div>

      
        </div>
        <!-- timer -->
        <div class="relative">
          <div class="text-white text-12xl font-semibold leading-none px-4">

            <vue-countdown :auto-start="start" :time="pomodoro.currentTime" @end="onCountdownEnd"  @progress="timeProgress" v-slot="{hours, minutes, seconds }" v-if="start">
                <div>{{ hours > 0 ? formatNumber(hours) + ':': '' }}{{ formatNumber(minutes) }}:{{ formatNumber(seconds) }} </div> 
            </vue-countdown>
            <div v-else>{{ formatTimestamp(pomodoro.lastTime) }}</div>

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
              <RefreshIcon class="w-10 text-gray-800" @click="setReset"/>
            </button>

            <button class="bg-primary p-1 rounded-full cursor-pointer hover:opacity-80" v-if="pomodoro.time != pomodoro.lastTime">
              <TrashIcon class="w-10 text-gray-800" @click="setResetAll"/>
            </button>
          </div>
        </div>
    </div>

  </div>


</template>


<script setup>
import {ref, watch, onMounted} from 'vue'
import { PlayIcon, PauseIcon, CogIcon, RefreshIcon, TrashIcon } from "@heroicons/vue/solid";
import VueCountdown from '@chenfengyuan/vue-countdown';
import store from '../store/index'


const defaultPomodoro = 1;
const start     = ref(false)
const settiongs = ref(false)

const pomodoro = ref({
  pomodoro: defaultPomodoro,
  long_break: 10,
  short_break: 5,
  period: 2,
  currentPeriod: 1,
  time: defaultPomodoro * 60 * 1000,
  currentTime: defaultPomodoro * 60 * 1000,
  lastTime: defaultPomodoro * 60 * 1000,
  type: 'pomodoro'
})

const pomodoroDefault = ref(pomodoro.value)
onMounted(() => {
  const storePomodoro = store.getters._getPomodoro
  if (storePomodoro) {
    pomodoro.value = storePomodoro
  }
})

watch(pomodoro, (cPomodoro) => {
  store.commit("setPomodoro", cPomodoro)
}, {deep: true})

watch(start, (cStart) => {
  if (cStart) {
    pomodoro.value.currentTime = pomodoro.value.lastTime
  }
})


const onCountdownEnd = () => {
console.log("bitti");
}


const timeProgress = (data) => {
pomodoro.value.lastTime = data.totalMilliseconds
}

const formatNumber = (n) => {
return n.toString().length == 1 ? `0${n}` : n
}



const formatTimestamp = (durationInMillis) => {
    const hours = Math.floor(durationInMillis / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((durationInMillis % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((durationInMillis % (1000 * 60)) / 1000).toString().padStart(2, '0');
    const arr = []
    if (Math.floor(durationInMillis / (1000 * 60 * 60)) > 0) arr.push(hours)
    arr.push(minutes)
    arr.push(seconds)

    return arr.join(":");
}


const setReset = () => {
  start.value = false
  pomodoro.value = {...pomodoro.value, currentTime: pomodoro.value.time, lastTime: pomodoro.value.time}

}

const setResetAll = () => {
  start.value = false
  pomodoro.value = {...pomodoroDefault.value, currentTime: pomodoroDefault.value.time, lastTime: pomodoroDefault.value.time}
}


</script>