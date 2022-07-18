<script setup>
import {  ref, watch , onMounted, reactive, nextTick} from 'vue';
import TrackModalElement from './TrackModalElement.vue';
import dataService from '@/dataService';

const props = defineProps({
    id: String,
});

const task = reactive({ 
    isActive : false,
    name: '',
});

const taskNameInput = ref(null);

watch(task, () => {
    if(task.name.trim() === '') {
        alert('Название задачи не может быть пустым');
        return;
    };
    dataService.updateTask(props.id, task)
});

const emits = defineEmits(['taskDeleted', 'openModalWindow', 'activateProject']); 

const readTask = () => {
    const newTask = dataService.readTask(props.id);
    task.name = dataService.readTask(props.id)?.name|| '';
    task.isActive = newTask?.isActive|| false;

}

onMounted(() => {
    readTask();
    dataService.updateTask(props.id, task);

});

const onDelete = (() => {
    emits('taskDeleted', props.id);
});

const openModalWindow = () => {
    emits('openModalWindow', props.id);
};

const changeTaskStatus = () => {
    if(task.isActive) {
        taskNameInput.value.class = 'mr-2 mb-2 h-8  w-56'
    } else {
        taskNameInput.value.class = 'mr-2 mb-2 h-8 w-48'
        emits('activateProject');
    }
    task.isActive=!task.isActive;
}

</script>

<template>
    <div class=" bg-slate-100 border-1 border-cyan-600 p-1 pr-0 mb-1">
        <div class ='flex border-0'>
            <div class =''>
                <input @blur="nameInput" ref="taskNameInput" class = "mr-2 mb-2 h-8 w-48" placeholder="New task" v-model="task.name">
            </div>
            <div class='mr-5 flex '>
                <i v-if="task.isActive" @click="changeTaskStatus" class="far fa-eye fa-lg pt-2  pl-1 pr-1 w-8 h-8 cursor-pointer rounded hover:bg-slate-300 "></i>
                <i v-else @click="changeTaskStatus" class="far fa-eye-slash pt-2 pl-1 pr-1 w-8 h-8 fa-lg cursor-pointer rounded hover:bg-slate-300"></i>
                <i @click="openModalWindow" v-if="task.isActive" class="fas fa-stopwatch fa-lg pt-2  pl-1 w-7 h-8 cursor-pointer rounded hover:bg-slate-300"></i>
         
                <i @click="onDelete" class="fas fa-trash fa-lg pl-1 pr-2 pt-2 h-8 w-7  cursor-pointer rounded hover:bg-slate-300 opacity-5 hover:opacity-100"></i> 
                <div v-if="!task.isActive" class="pt-2 pl-1 w-7 h-8" ></div>
            </div>
        </div>
    </div>
</template>