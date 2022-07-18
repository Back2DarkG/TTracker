<script setup>
import { ref, watch , onMounted, reactive, nextTick} from 'vue';
import dataService from '@/dataService';
const props = defineProps({
    taskId: String,
    projectId: String
});

const formatDate = ((date) => {
    return date.toISOString().slice(0, 10);
});

const newTrack = reactive({
    date: formatDate(new Date()),
    time: '',
    description: ''
});

const taskId = ref('');
const projectId = ref('');

taskId.value = props.taskId;
projectId.value = props.projectId;

const taskOptions = ref([]);
const projectOptions = ref([]);
const trackIds = ref([]);
const timeOptions = [];


watch(taskId, () => {
    // console.log(props.id)
    // localStorage.setItem(props.id, JSON.stringify(task));
});

watch(projectId, () => {
    taskOptions.value = dataService.readTasks(projectId.value);
    taskId.value = taskOptions.value[0].id;
});

const emits = defineEmits(['closeModalWindow']); 

const closeModalWindow = ((taskId) => {
    emits('closeModalWindow');
});

onMounted(() => {
    projectOptions.value = dataService.readProjects(true);
    taskOptions.value = dataService.readTasks(projectId.value);

    newTrack.date = formatDate(new Date);

    trackIds.value = dataService.readTrackIds(taskId.value);
    // trackIdCounter.value = JSON.parse(localStorage.getItem('trackIdCounter')) || 1;

    localStorage.setItem(`${taskId.value}_tracks`, JSON.stringify(trackIds.value));
    // localStorage.setItem('trackIdCounter', trackIdCounter.value);

});

const onDelete = () => {

};

const timeTracked = ((date = newTrack.date) => {
    let result = 0;

    return result; 
});

const trackCreation = (() => {
       
    if(newTrack.time == '') {
        alert('Для добавление проводки необходимо укзаать количество часов');
        return;
    }

    if(newTrack.date == '') {
        alert('Для добавление проводки неободимимо укзать дату');
        return;
    }
    if(dataService.getTimeForDate(newTrack.date) + parseInt(newTrack.time) > 24) {
        alert('Суммарное число часов для выбранной даты превышает 24');
        return;
    }

    dataService.createTrack(taskId.value, newTrack);
    
    newTrack.name = '';
    newTrack.id = '';
    newTrack.date = '';
    newTrack.time = '';
    newTrack.description = '';

    closeModalWindow();
});

const handleTime = () => {
    if (!/^([1-9]|(1[0-9]|2[0-4]))$/.test(newTrack.time)) {
      newTrack.time = newTrack.time.slice(0, -1);
    }
};

</script>

<template>
    <div class="flex justify-center items-center h-3/4"> 
        
        <div class="flex-column items-end pl-4 opacity-100 bg-slate-200 rounded p-1 h-72 w-72">
            <div class="flex justify-end">
                <h3 class="text-center w-56 pr-2 text-zinc-600">Добавление проводки</h3>
                <button @click="closeModalWindow" class = "h-7 mb-2 mr-2 w-8"> ╳</button>
            </div>
            <!-- <input v-model="task.id" class="mb-2 w-72 h-8 "> -->
            <select required v-model="projectId" class="h-8 w-64 text-center mb-2 bg-white">
                <option 
                    v-for="projectOption in projectOptions" 
                    :key="projectOption.id" 
                    :value="projectOption.id"
                > {{projectOption.name}}</option>
            </select>
            <select required v-model="taskId" class="h-8 w-64 text-center mb-2 bg-white">
                <option 
                    v-for="taskOption in taskOptions" 
                    :key="taskOption.id" 
                    :value="taskOption.id"
                > {{taskOption.name}}</option>
            </select>
            <input  required v-model="newTrack.date" type="date"  class="text-center h-8 mr-4 w-64 mb-2">
            <input v-model="newTrack.time" @input="handleTime" class="h-8 w-64 text-center mb-2 " placeholder="Количество часов">
            <input v-model="newTrack.description" placeholder="Описание проводки" class="h-8 mr-4 w-64 text-center ">
                    
            <button @click="trackCreation"  class = " w-64 text-center pt-3 pb-3 hover:bg-slate-300"> Добавить проводку</button>
            
        </div> 
    </div>
</template>