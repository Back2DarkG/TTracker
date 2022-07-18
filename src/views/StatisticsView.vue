<script setup>
import { onMounted, ref} from 'vue';
import TrackElement from '../components/TrackElement.vue';
import dataService from '@/dataService';
import { Calendar } from 'v-calendar'
import { reactive } from '@vue/reactivity';

const taskNameInput = ref(null);
const trackIds = ref([]);
const selectedDate = ref(new Date());

onMounted(() => {
    trackIds.value = dataService.getTracks();
    
    // console.log(trackIds);
});

const attributes = reactive([]);

const updatePerformance = (date ) => {
    let performanceData = {};
    if (date.value == null || date.value == '') {
        date.value = new Date();
    };
    dataService.getTracks(true, date.value.toISOString().slice(0, 7).split('-'))
    .forEach((track)=> {
        performanceData[track.date] = (performanceData[track.date] || 0) + parseInt(track.time);
    });

    const acc = [ { 
        highlight: {
            class: 'bg-yellow-300 w-14 h-14', 
            contentClass: ''
        }, 
        dates: [] 
    },
    { 
        highlight: { 
            class: 'bg-green-400 w-14 h-14', 
            contentClass: ''
        }, 
        dates: [] 
    },
    { 
        highlight: {
            class: 'bg-red-400 w-14 h-14', 
            contentClass: ''
        }, 
        dates: [] 
    },
        { 
        bar: {},
        dates: [new Date()] 
    }];
    //console.log(performanceData);
    for (let date in performanceData) {
            console.log(performanceData);
        if (performanceData[date] < 8) acc[0].dates.push(new Date(date.split('-')));
        if (performanceData[date] === 8) acc[1].dates.push(new Date(date.split('-')));
        if (performanceData[date] > 8) acc[2].dates.push(new Date(date.split('-')));
    }
    attributes.value = acc; 

}

const updateTracks = (period) => {
    if (selectedDate.value == null || selectedDate.value == '') {
        selectedDate.value = new Date();
    };
    switch(period) {
   
        case "Day" :
            trackIds.value = dataService.getTracks(true, selectedDate.value.toISOString().slice(0, 10).split("-"));
        break;
        case "Month":
            trackIds.value = dataService.getTracks(true, selectedDate.value.toISOString().slice(0, 7).split("-"));
        break;
        default:
            trackIds.value = dataService.getTracks();
        break;
    }
    updatePerformance(selectedDate);
}

const updateTracksDay = (beginDate, endDate) => {
    trackIds.value = dataService.getTracks(true, beginDate, endDate)
}

const onMonthChanged = (month, year) => {
    updatePerformance({value:new Date(year, month)});      
}

const trackDeleted = ((trackId, taskId) => {
    dataService.deleteTrack(trackId, taskId);
    dataService.readTask(taskId);
    trackIds.value = dataService.getTracks();
       
});
</script>

<template>
    <div class ="flex border-2 border- bg-slate-100 h-screen max-w-full  pb-5 overflow-x-auto" >
        <div class="mr-4 fixed h-screen w-64 border-x-slate-500 border-2">
            <div class="pb-2">

                <v-date-picker 
                    is-required 
                    :firstDayOfWeek="2" 
                    :attributes="attributes.value" 
                    class=" rounded-none" 
                    v-model="selectedDate"
                    @update:from-page="(e) => onMonthChanged(e.month, e.year)"
                />
               
            </div>
            <div>
                <div class=" pb-2">
                    <button @click="updateTracks('Day')"  class = " w-28 text-center ml-2 p-2 mr-3 rounded bg-cyan-200">День</button>
                    <button @click="updateTracks('Month')"  class = " w-28  text-center ml-1 p-2 rounded bg-cyan-200">Месяц</button>     
                </div>
                <button @click="updateTracks"  class = " w-60  text-center ml-2 p-2 rounded bg-cyan-200">Отобразить все проводки</button>
            </div>
        </div>
        <div class=" pl-64 pt-2 w-screen ">
        <div class=" flex flex-col justify-center items-center">
            <TrackElement
                v-for="track in trackIds" 
                @trackDeleted="trackDeleted"
                :key="track.id" 
                :value="track.id"
                :projectId="track.projectId"
                :taskId="track.taskId"
                :id="track.id"
            /> 
        </div>
        
        </div> 
       
    </div>
</template>


