<script setup>
import ProjectElement from "./ProjectElement.vue";
import TrackModalElement from './TrackModalElement.vue';
import {ref , onMounted, watch, reactive, nextTick} from 'vue';
import { root } from 'postcss';
import dataService from '@/dataService';

const newProject = reactive({ 
    isActive : false,
    name: '',
    code: ''
});

const newTrack = reactive({
    taskId : ''
});

const isModalActive = ref(false);
const projectNameInput = ref(null);
const projectIds = ref([]);

onMounted(() => {
    projectIds.value = dataService.readProjectIds();
    dataService.updateProjectIds(projectIds.value);
});

const projectDeleted = ((projectId)=> {
    projectIds.value = dataService.deleteProject(projectId);
});

const createProject = (() => {
  
    if( newProject.code == '' || newProject.name == '') {
        alert("Для создания проекта необходимо указать его название и код");
        return;
    };
    dataService.createProject(newProject);

    projectIds.value =  dataService.readProjectIds();
    newProject.isActive = false;
    newProject.name = '';
    newProject.code = '';
    
    // $refs.projectId.$el.focus;
})

const showProjectDataInputs = (() => {
    newProject.isActive = true;
    nextTick(() => {
        projectNameInput.value.focus();
    });
})

const hideProjectDataInputs = (() => {
    newProject.isActive = false;
    newProject.name = '';
    newProject.code = '';
})

const openModalWindow = ((taskId, projectId) => {
    isModalActive.value = true;
    newTrack.taskId = taskId;
    newTrack.projectId = projectId;
});

const closeModalWindow = ((taskId) => {
    isModalActive.value = false;
});

</script>

<template>

    <div v-if='isModalActive' 
        class="absolute inset-0 z-20 opacity-40 bg-black h-screen"
    > 
    </div>
    <div v-if="isModalActive" class="absolute inset-0 h-screen z-30"
    > 
        <TrackModalElement 
            @closeModalWindow="closeModalWindow" 
            :taskId="newTrack.taskId"
            :projectId="newTrack.projectId" 
        />
    </div>
    

    <div class ='flex bg-slate-100 h-screen absolute max-w-full  min-w-full pl-5 pt-4 mr-4 pb-5 overflow-x-auto' >
    
        <ProjectElement ref="projectId" 
            @projectDeleted="projectDeleted"
            @openModalWindow="openModalWindow" 
            v-for='projectId in projectIds' 
            :id="projectId" 
            :key="projectId"
        />
        <div class="flex-block flex-col sticky  rounded pr-4 h-min max-h-full overflow-y-auto min-w-min ">
            <div class=" max-w-min">
                <div v-if="newProject.isActive" class="p-1 pt-2 border-2 rounded bg-slate-300">
                    <input 
                        autofocus
                        ref = "projectNameInput"
                        class = 'mr-2 mb-2 mt-2 resize-none h-8 w-72' 
                        v-model="newProject.name" 
                        placeholder='New Project'
                    >
                    <input class = 'mr-2 h-8 mb-2 w-72 ' v-model="newProject.code" placeholder='New Project Code'>
                    <div class = 'flex'>
                        <button @click="createProject" class = " h-9 mb-1 w-64 mr-1 rounded bg-cyan-200"> Создать проект</button>
                        <button @click="hideProjectDataInputs" class = " h-9 mb-1 mr-1 w-8"> ╳</button>
                    </div>
                </div>
                <button 
                    v-else @click="showProjectDataInputs" 
                    class = " h-9 w-72 rounded bg-cyan-200"
                > Создать новый проект</button>
            </div>
        </div>
    </div>

    
</template>