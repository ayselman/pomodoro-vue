<template>
  <div class="hero min-h-screen bg-dark">
    <div class="w-full h-full items-center justify-center flex flex-col lg:space-y-14 space-y-8">

        <div class="py-4">
          <img class="w-16 lg:w-28" src="/logo.png" alt="">
        </div>

        <!-- Menu -->
        <div class="flex lg:space-x-4 space-x-2">
          <div class="lg:p-2 p-1 rounded-btn cursor-pointer text-sm lg:text-xl"  :class="pomodoro.type == 'pomodoro' ? 'bg-primary':'text-white'"> Pomodoro </div>
          <div class="lg:p-2 p-1 rounded-btn cursor-pointer text-sm lg:text-xl"  :class="pomodoro.type == 'short_break' ? 'bg-red-500':'text-white'"> Short Break </div>
          <div class="lg:p-2 p-1 rounded-btn cursor-pointer text-sm lg:text-xl"  :class="pomodoro.type == 'long_break' ? 'bg-red-800':'text-white'"> Long Break</div>
        </div>

        <!-- timer -->
        <div class="relative">
          <div class="text-white text-8xl lg:text-12xl font-semibold leading-none px-4">
            <div v-if="start">
              <vue-countdown :auto-start="start" :time="pomodoro.currentTime" @end="onCountdownEnd"  @progress="timeProgress" v-slot="{hours, minutes, seconds }" >
                  <div>{{ hours > 0 ? formatNumber(hours) + ':': '' }}{{ formatNumber(minutes) }}:{{ formatNumber(seconds) }} </div> 
              </vue-countdown>
            </div>
            
            <div v-else>{{ formatTimestamp(pomodoro.lastTime) }}</div>

          </div>
          <div class="w-full  lg:h-16 lg:-mt-16 h-6 -mt-6">
            <div class="flex items-end justify-end bg-white opacity-20 w-full lg:rounded-t-box rounded-t-lg  h-6 -mt-6 lg:h-20 lg:-mt-20"></div>
            <!--slider-->
            <div class="w-full h-1 flex">
                <div class="flex overflow-hidden relative" v-for="(p,k) in pomodoroArr" :key="p" :style="`width: ${calculatePercentage(p)}%`" :class="getBg(p)">
                  <div class="bg-gray-400 absolute left-0 top-0 h-full" :class="pomodoro.total_part > k ? 'w-full' : 'w-0'" ></div>
                  <div class="bg-gray-400 absolute left-0 top-0 h-full" v-if="pomodoro.total_part == k" :style="setPercentage()"></div>
                </div>
            </div>
          </div>
        </div>

        <!-- options -->
        <div class="pt-12">
          <div class="w-full flex lg:space-x-4 space-x-3 justify-end">
            <button class="bg-primary p-1 w-10 h-10 lg:w-12 lg:h-12 rounded-full cursor-pointer hover:opacity-80" @click="settiongs = !settiongs">
              <CogIcon class=" text-gray-800" />
            </button>

            <button class="bg-primary p-1 w-10 h-10 lg:w-12 lg:h-12 rounded-full cursor-pointer hover:opacity-80" >
              <PlayIcon class="text-gray-800" @click="start = !start" v-if="!start"/>
              <PauseIcon class="text-gray-800" @click="start = !start" v-else/>
            </button>

            <button class="bg-primary  p-1 w-10 h-10 lg:w-12 lg:h-12 rounded-full cursor-pointer hover:opacity-80" >
              <RefreshIcon class=" text-gray-800" @click="setReset"/>
            </button>

            <button class="bg-primary  p-1 w-10 h-10 lg:w-12 lg:h-12 rounded-full cursor-pointer hover:opacity-80">
              <TrashIcon class=" text-gray-800" @click="setResetAll"/>
            </button>
          </div>
        </div>


      <div v-if="settiongs">
        <div class="flex items-end justify-end">
          <button class="btn btn-square btn-sm btn-primary rounded-none" @click="settiongs = !settiongs">
            <XIcon class="w-6"/>
          </button>
        </div>

        <div class="bg-white p-3  flex flex-col space-y-10 space-x-0 lg:flex-row lg:space-x-10 lg:space-y-0 rounded-b-box rounded-l-box">
            <div class="flex flex-col space-y-8">
              <!-- Pomodoro -->
              <div class="flex space-x-2 items-center justify-center">
                <div class="text-gray-400 w-32">Pomodoro(dk)</div>
                <div class="text-2xl w-8 text-center">{{ pomodoro.pomodoro }}</div>
                <div class="flex space-x-1">             
                  <button class="btn btn-square btn-sm btn-primary" :class="pomodoro.pomodoro <= 0 ? 'invisible':''" @click="setPomodoro('pomodoro',-5)">
                    <MinusIcon class="w-6"/>
                  </button>
                  <button class="btn btn-square btn-sm btn-primary" @click="setPomodoro('pomodoro',5)">
                    <PlusIcon class="w-6"/>
                  </button>
                </div>
              </div>

              <!-- short_break -->
              <div class="flex space-x-2 items-center justify-center">
                <div class="text-gray-400 w-32">Short Break</div>
                <div class="text-2xl w-8 text-center">{{ pomodoro.short_break }}</div>
                <div class="flex space-x-1">             
                  <button class="btn btn-square btn-sm btn-primary" :class="pomodoro.short_break == 0 ? 'invisible':''" @click="setPomodoro('short_break',-1)">
                    <MinusIcon class="w-6"/>
                  </button>
                  <button class="btn btn-square btn-sm btn-primary" @click="setPomodoro('short_break',1)">
                    <PlusIcon class="w-6"/>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col space-y-8">
              <!-- long_break -->
              <div class="flex space-x-2 items-center justify-center">
                <div class="text-gray-400 w-32">Long Break</div>
                <div class="text-2xl w-8 text-center">{{ pomodoro.long_break }}</div>
                <div class="flex space-x-1">             
                  <button class="btn btn-square btn-sm btn-primary" :class="pomodoro.long_break == 0 ? 'invisible':''" @click="setPomodoro('long_break',-1)">
                    <MinusIcon class="w-6"/>
                  </button>
                  <button class="btn btn-square btn-sm btn-primary" @click="setPomodoro('long_break',1)">
                    <PlusIcon class="w-6"/>
                  </button>
                </div>
              </div>

              <!-- Period -->
              <div class="flex space-x-2 items-center justify-center">
                <div class="text-gray-400 w-32">Period</div>
                <div class="text-2xl w-8 text-center">{{ pomodoro.period }}</div>
                <div class="flex space-x-1">             
                  <button class="btn btn-square btn-sm btn-primary" :class="pomodoro.period == 0 ? 'invisible':''" @click="setPomodoro('period',-1)">
                    <MinusIcon class="w-6"/>
                  </button>
                  <button class="btn btn-square btn-sm btn-primary" @click="setPomodoro('period',1)">
                    <PlusIcon class="w-6"/>
                  </button>
                </div>
              </div>
            </div>
            
          </div>
      </div>
    </div>

  </div>


</template>


<script setup>
import {ref, watch, onMounted} from 'vue'
import { PlayIcon, PauseIcon, CogIcon, RefreshIcon, TrashIcon, PlusIcon, MinusIcon, XIcon} from "@heroicons/vue/solid";
import VueCountdown from '@chenfengyuan/vue-countdown';
import store from '../store/index'

const start     = ref(false)
const settiongs = ref(false)
const pomodoroArr = ref([])

const defaultPomodoro = 45;
const pomodoroDefault = {
  sort_pomodoro: ["pomodoro", "short_break", "long_break"],
  finish_count: 0,
  pomodoro: defaultPomodoro,
  long_break: 10,
  short_break: 5,
  period: 2,
  current_period: 1,
  time: defaultPomodoro * 60 * 1000,
  currentTime: defaultPomodoro * 60 * 1000,
  lastTime: defaultPomodoro * 60 * 1000,
  type: 'pomodoro',
  total_part: 0
}



const pomodoro = ref({...pomodoroDefault})

onMounted(() => {
    const storePomodoro = store.getters._getPomodoro
    
    if (storePomodoro) {
      pomodoro.value = {...storePomodoro}
      setPomodoroArr(storePomodoro)
    }else{
      setPomodoroArr(pomodoroDefault)
    }
})

watch(pomodoro, (cPomodoro, lPomodoro) => {
  setPomodoroArr(cPomodoro)
  store.commit("setPomodoro", cPomodoro)
}, {deep: true})


watch(start, (cStart) => {
  if (cStart) {
    pomodoro.value.currentTime = pomodoro.value.lastTime
  }
})


const setPomodoroArr = (cPomodoro) => {
  let newArr = []
  for (let p = 0; p < cPomodoro['period']; p++) {
      newArr.push('pomodoro')
      newArr.push(cPomodoro['sort_pomodoro'][(p % (cPomodoro['sort_pomodoro'].length - 1)) + 1])
  }

  pomodoroArr.value = [...newArr]
}


const setPomodoro = (type,number) => {
  if (pomodoro.value.type == type) {
    let newTimeDk = pomodoro.value[pomodoro.value.type] + number;
    let newPomodor = {...pomodoro.value, time: newTimeDk * 60 * 1000, currentTime: newTimeDk * 60 * 1000, lastTime: newTimeDk * 60 * 1000}
    newPomodor[type] = newTimeDk;
    
    pomodoro.value = {...newPomodor}
  }else{
    pomodoro.value[type] = pomodoro.value[type] + number
  }
}


const onCountdownEnd = () => { 
  let newPomodoro = {...pomodoro.value}
  
  
  newPomodoro['finish_count'] = newPomodoro['finish_count'] + 1
  const newType = pomodoroArr.value[newPomodoro['finish_count']]

  newPomodoro['type']          = newType
  newPomodoro['time']          = newPomodoro[newType] * 60 * 1000
  newPomodoro['currentTime']   = newPomodoro['time']
  newPomodoro['lastTime']      = newPomodoro['time']
  newPomodoro['total_part']    = newPomodoro['total_part'] + 1
  


  if (newPomodoro['finish_count'] % newPomodoro['sort_pomodoro'].length - 1 == 0) {
    //console.log("period bitti");
    newPomodoro['current_period']= newPomodoro['current_period'] + 1
  }
  

  if (newPomodoro['current_period'] == newPomodoro['period'] + 1) {
    start.value = false
    //console.log("tamamen bitti");
  }else{
    start.value = false
    pomodoro.value = {...newPomodoro}
    setTimeout(() => start.value = true, 1000);
  }

}


const timeProgress = (data) => {
  //pomodoro.value = {...pomodoro.value, lastTime: data.totalMilliseconds, total_seconds: pomodoro.value.total_seconds + 1}
  pomodoro.value = {...pomodoro.value, lastTime: data.totalMilliseconds}
}

const formatNumber = (n) => {
return n.toString().length == 1 ? `0${n}` : n
}


const calculatePercentage = (type) => {
  let totalNumber = pomodoroArr.value.map(x => pomodoro.value[x]).reduce((x, y) => x + y)
  if( totalNumber <= 0)  return 0
  return Math.ceil((100 * pomodoro.value[type]) / totalNumber)
}

const setPercentage = () => {
  let time = pomodoro.value.time
  let lastTime = pomodoro.value.lastTime
  let percentage = (100 * lastTime) / time

  
  return `width: ${100 - percentage}%`
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


const getBg = (type) => {
  let bg = {
    'pomodoro':'bg-primary',
    'short_break':'bg-red-500',
    'long_break':'bg-red-800'
  }   

  return bg[type]
}

const setResetAll = () => {
  start.value = false
  pomodoro.value = {...pomodoroDefault}
}


</script>