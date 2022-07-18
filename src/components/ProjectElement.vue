<script setup>
import TaskElement from './TaskElement.vue';
import { ref, watch , onMounted, reactive, nextTick} from 'vue';
import dataService from '@/dataService';
const props = defineProps({
    id: String,
});

const project = reactive({
    name: '',
    code: '',
    isActive: false,
});

const newTask = reactive({ 
    isActive : false,
    name: '',
});

const taskNameInput = ref(null);
const projectNameInput = ref(null);
const projectCodeInput = ref(null);
const taskIds = ref([]);
// const taskIds = ref([]);
// const 
// const tasks = [];

watch(project, () => {
    if( project.code.trim() == '' || project.name.trim() == '') {
        alert('Название задачи или код проекта не могут быть пустыми');
        return;
    };

    dataService.updateProject(props.id, project);
});

const emits = defineEmits(['projectDeleted', 'openModalWindow']);

const readProject = () => {
    let newProject = dataService.readProject(props.id);
    project.name = newProject?.name || '';
    project.code = newProject?.code || '';
    project.isActive = newProject?.isActive || false;

    dataService.updateProject(props.id, project);
};


onMounted(() => {
    readProject();
    taskIds.value = dataService.readTaskIds(props.id)

});

const onDelete = () => {
    
    emits('projectDeleted', props.id);
};

const createTask = (() => {
    // taskIdCounter.value = JSON.parse(localStorage.getItem('taskIdCounter')) || 1;
    if(newTask.name.trim() == '') {
        alert('Для создания задачи необходимо указать ее название');
       
        return;
    }

    dataService.createTask(newTask, props.id);
    taskIds.value = dataService.readTaskIds(props.id);
    
    newTask.isActive = false;
    newTask.name = '';
    project.isActive = true;

    changeProjectStatus
})

const showTaskNameInput = (()=> {
    newTask.isActive = true;
    nextTick(() => {
        taskNameInput.value.focus();
    });
})

const taskDeleted = ((taskId)=> {
    taskIds.value = dataService.deleteTask(taskId, props.id)
});

const openModalWindow = ((taskId) => {
    emits('openModalWindow',taskId, props.id);
});

const changeProjectStatus =() => {
    project.isActive =!project.isActive
    taskIds.value.forEach(taskId => {
        const newTask = dataService.readTask(props.id);
        newTask.isActive = false;
        dataService.updateTask(taskId, newTask);
    })
    taskIds.value = [];
    nextTick(() =>taskIds.value = dataService.readTaskIds(props.id));
}

</script>

<template>
    <div class ="flex flex-col sticky border-2 rounded  bg-slate-200 mr-5 h-min max-h-full min-w-min p-1 pb-0">
        <div class ="flex">
            <div class ="pl-1 max-w-min">
                <input v-model=project.name @blur="nameCodeInput" 
                    class = "mb-2 mt-2 resize-none h-8 w-56 bg-slate-200 cursor-pointer focus:bg-slate-50' 
                    placeholder='New Project' autofocus"
                >
                <input v-model=project.code @blur="nameCodeInput" 
                    class = 'mb-2 w-56 h-8 bg-slate-200 cursor-pointer focus:bg-slate-50' 
                    placeholder='New Project Code'
                >
            </div>
            <div class ="pt-2 ml-2 flex  min-w-min mr-6">
                <i v-if="project.isActive" @click="changeProjectStatus" 
                    class="far fa-eye fa-lg pt-2  pl-1 pr-2 w-8 h-8 cursor-pointer rounded hover:bg-slate-300 ">
                </i>
                <i v-else @click="project.isActive =!project.isActive" 
                    class="far fa-eye-slash pt-2 pl-1 pr-2 w-8 h-8 fa-lg cursor-pointer rounded hover:bg-slate-300">
                </i>
                <!-- <button type="button"  class="h-8  mr-2 w-8 rounded " @click="onDelete">╳</button> -->
                <i @click="onDelete" class="fas fa-trash fa-lg pl-2 pr-2 pt-2 h-8 w-9 cursor-pointer rounded hover:bg-slate-300 opacity-5 hover:opacity-100"></i>
            </div>
            <!-- {{id,name,code}} -->
        </div>
        <div class="overflow-y-auto max-w-min scroll">
                <TaskElement 
                    @taskDeleted="taskDeleted" 
                    @openModalWindow="openModalWindow"
                    @activateProject="project.isActive=true"
                    v-for="taskId in taskIds" 
                    :id="taskId" :key="taskId"/>
        </div>
        <div class=" p-1 bg-slate-200  mb-1 rounded border-cyan-600">
                <div class="flex flex-col" v-if="newTask.isActive">
                    <input 
                        autofocus
                        ref = "taskNameInput"
                        class = 'mr-2 mb-2 mt-2 resize-none h-8 w-56' 
                        v-model="newTask.name" 
                        placeholder='Новая задача'
                    >
                    <div class = 'flex'>
                        <button @click="createTask" class = " h-9 mb-1 mr-2 w-56 rounded bg-cyan-200"> Добавить задачу</button>
                        <button @click="newTask.isActive = !newTask.isActive" class = " h-8 mb-1 mr-2 w-8"> ╳</button>
                    </div>          
                </div>

                <div v-else class="bg-slate-200 max-w-min rounded-md ">
                <div @click="showTaskNameInput" class="cursor-pointer flex pt-1 pl-3 hover:bg-slate-300">
                    <i class="fas fa-plus h-7 mb-1 mr-2 pt-1 w-6 fa-lg bg-slate-200 bg-inherit  "></i>
                    <p class="w-56">Добавить новую задачу</p>
                </div>
                </div>
            </div>
    </div>
</template>