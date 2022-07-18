<script setup>
import { ref, watch , onMounted, reactive, nextTick} from 'vue';
import dataService from '@/dataService';
const props = defineProps({
    id: String,
    projectId: String,
    taskId: String,
});
const projectId = ref('');
const taskId = ref('');
const dateInput = ref(null);

watch(projectId, () => {
    taskOptions.value = dataService.readTasks(projectId.value).filter(task => task.isActive)
    if(taskOptions.value.length > 0) {
    } else {
        taskSelect.disabled = true;
        projectSelect.disabled = true;
    };
});

const emits = defineEmits('trackDeleted');

const readTrack = () => {
    const newTrack = dataService.readTrack(props.id);
    // let newTrack = JSON.parse(localStorage.getItem(props.id));
    track.date = newTrack.date;
    track.time= newTrack.time;
    track.description= newTrack.description;
}

const taskOptions = ref([]);
const projectOptions = ref([]);

const taskSelect = ref(null);
const projectSelect = ref(null);

taskId.value = props.taskId;
projectId.value = props.projectId;

const track = reactive({
    date: new Date().toISOString().slice(0, 7).split('-'),
    time:'1',
    description: ''
});
 
watch(track, () => {

    dataService.updateTrack(props.id, track);
    readTrack();
});

onMounted(() => {
    readTrack();
    const newTrack = dataService.readTrack(props.id);
    // let newTrack = JSON.parse(localStorage.getItem(props.id));
    track.date = newTrack.date;
    track.time= newTrack.time;
    track.description= newTrack.description;

    if (!dataService.readTask(props.taskId).isActive) {
        taskSelect.value.disabled = true;
        projectSelect.value.disabled = true;
        taskId.value = props.taskId;
        projectId.value = props.projectId;
        projectOptions.value = [{
                id : props.projectId,
                name: dataService.readProject(props.projectId).name
            }];
        taskOptions.value = [{
                id : props.taskId,
                name: dataService.readTask(props.taskId).name
            }];
    } else {
        projectOptions.value = dataService.readProjects(true);
        taskOptions.value = dataService.readTasks(props.projectId, true);
    }
   
})

const handleTime = () => {
    if (!/^([1-9]|(1[0-9]|2[0-4]))$/.test(track.time)) {
      track.time = track.time.slice(0, -1);
    }
};

const performanceCheck = (isDateChanged) => {
    if(dataService.getTimeForDate(track.date) > 24) {
        alert('Суммарное число часов для выбранной даты превышает 24');
        if(isDateChanged) {  
            track.date = '0001-01-01';
            nextTick(() => dateInput.value.focus());
        } else {
            track.time = '1';     
        }
    }

}

const onDelete  = () => {
    emits('trackDeleted', props.id, props.taskId);
}

</script>

<template>
    <div class=" p-2 max-h-10 max-w-max bg-slate-100">
    <div></div>
        <select disabled ref="projectSelect" v-model="projectId" class="h-8 w-48 text-center mr-2 bg-white">
            <option 
                v-for="projectOption in projectOptions" 
                :key="projectOption.id" 
                :value="projectOption.id"
            > {{projectOption.name}}</option>
        </select>
        <select disabled ref="taskSelect" v-model="taskId" class="h-8 w-48 text-center mr-2 bg-white">
            <option 
                v-for="taskOption in taskOptions" 
                :key="taskOption.id" 
                :value="taskOption.id"
            > {{taskOption.name}}</option>
        </select>
        <input ref="dateInput" required v-model="track.date" type="date" @blur="performanceCheck(true)" class="text-center w-48 h-8 mr-2 ">
        <input v-model="track.time" @input="handleTime" @blur="performanceCheck(false)" class="h-8 w-48 text-center mr-2" placeholder="Количество часов">
        <input v-model="track.description" placeholder="Описание проводки" class="h-8 w-48 text-center ">
        <i @click="onDelete" class="fas fa-trash fa-lg pl-2 pr-2 pt-2 h-8 w-9 cursor-pointer rounded opacity-5 hover:bg-slate-200 hover:opacity-100"></i>
    </div>
</template>