//Im
let dataService = {
    getAllTrackIds() {
        return this.readProjects(true).map((projectId) => 
            this.readTaskIds(projectId.id).map((taskId) => 
                this.readTrackIds(taskId)
            )
        ).flat(3);
    },
    getAllTracks() {
        return this.getAllTrackIds().map(trackId => {
            return this.readTrack(trackId);
        }).flat(3);
    },

    getTracks(isDateFIlterActive = false, date) {

        let result = []
        this.readProjectIds().forEach((projectId) => {
            this.readTaskIds(projectId).forEach((taskId) => {
                const trackIds = localStorage.getItem(`${taskId}_tracks`);
                JSON.parse(trackIds).forEach(trackId => {

                    const trackDTO = this.readTrack(trackId)

                    
                    if(!isDateFIlterActive 
                        || (date.length == 2 && trackDTO.date.split("-")[1] == date[1] 
                            && trackDTO.date.split("-")[0] == date[0])
                        || (date.length == 3 && trackDTO.date == date.join("-"))
                    )
                    {
                        result.push({
                            projectId: projectId,
                            taskId: taskId,
                            id: trackId,
                            time: trackDTO.time,
                            date: trackDTO.date
                        })
                    }
                })  
            })
        })
        return result;
    },   

    getTimesStatisticForMonth(date) {
        
    },
    
    getTimeForDate (date) {
        let result = 0;
        this.getAllTracks().forEach(track => result+= ((track.date == date ? parseInt(track.time): 0)))
        return result;
    },

    readProjectsFull() {
        let projectIds = JSON.parse(localStorage.getItem('projects'));  
        return projectIds.map((projectId) => 
            JSON.parse(localStorage.getItem(projectId))
        );
    },

    readProjects(onlyNotEmpty = false) {
        let projectIds = JSON.parse(localStorage.getItem('projects'));  
        let result =  projectIds.map((projectId) => {
            return {
                id: projectId,
                name: JSON.parse(localStorage.getItem(projectId)).name
            }
        })
        if(onlyNotEmpty) {
            result.filter((project) => this.readTaskIds(project.id).filter((taskId)=> this.readTask(taskId).isActive));
            return result.filter((project) => this.readTaskIds(project.id).length > 0);
        }
        return result
    },
    
    readProjectIds() {
        return JSON.parse(localStorage.getItem('projects')) || [];      
    },

    updateProjectIds(projectIds) {
        localStorage.setItem('projects', JSON.stringify(projectIds));
    },

    readProject(projectId) {
        return JSON.parse(localStorage.getItem(projectId));
    },

    createProject(project) {
        let projectIdCounter = localStorage.getItem("projectIdCounter") || 1;
        
        let projectsDTA = [...this.readProjectIds("projects")];

        projectsDTA.push(`project_${projectIdCounter}`);

        localStorage.setItem("projects", JSON.stringify(projectsDTA));
        localStorage.setItem(`project_${projectIdCounter}`, JSON.stringify(project));
        localStorage.setItem(`project_${projectIdCounter}_tasks`, JSON.stringify([]));
        projectIdCounter++;
        localStorage.setItem('projectIdCounter', projectIdCounter);
        // localStorage.setItem(projectId, JSON.stringify(project));
    },

    updateProject(projectId, project) {
        localStorage.setItem(projectId, JSON.stringify(project));
    },

    deleteProject(projectId) {
        this.readTaskIds(projectId).forEach(taskId => {
            this.deleteTask(taskId, projectId);
        });
        localStorage.removeItem(`${projectId}_tasks`);
        localStorage.removeItem(`${projectId}`);

        let projectsDTA = [...this.readProjectIds()];
        projectsDTA.splice(projectsDTA.indexOf(projectId),1);
        localStorage.setItem('projects', JSON.stringify(projectsDTA));
        return JSON.parse(localStorage.getItem('projects'));


    },

    readTasksFull(projectId) {
        let taskIds = JSON.parse(localStorage.getItem(`${projectId}_tasks`));
        return projectId.map((taskId) => 
           JSON.parse(localStorage.getItem(taskId)) 
        );
    },

    readTaskIds(projectId) {
        return JSON.parse(localStorage.getItem(`${projectId}_tasks`));  
    },

    readTasks(projectId, onlyNotEmpty) {
        let taskIds = JSON.parse(localStorage.getItem(`${projectId}_tasks`));

        return taskIds.map((taskId) => {
            const taskDTO = JSON.parse(localStorage.getItem(taskId))
            return {
                id: taskId,
                name: taskDTO.name,
                isActive: taskDTO.isActive
            }
        }).filter((task) => task.isActive) ;
    },


    createTask(task, projectId) {
        let taskIdCounter = localStorage.getItem("taskIdCounter") || 1;
        
        let tasksDTA = [...this.readTaskIds(projectId)];

        tasksDTA.push(`task_${taskIdCounter}`);

        localStorage.setItem(`${projectId}_tasks`, JSON.stringify(tasksDTA));
        localStorage.setItem(`task_${taskIdCounter}`, JSON.stringify(task));
        localStorage.setItem(`task_${taskIdCounter}_tracks`, JSON.stringify([]));
        taskIdCounter++;
        localStorage.setItem('taskIdCounter', taskIdCounter);
    },

    readTask(taskId) {
        return JSON.parse(localStorage.getItem(taskId));
    },

    updateTask(taskId, task) {
        localStorage.setItem(taskId, JSON.stringify(task));
    },

    deleteTask(taskId, projectId) {
        this.readTrackIds(taskId).forEach(trackId => {
            localStorage.removeItem(`${trackId}`);
        });
        localStorage.removeItem(`${taskId}_tracks`);
        localStorage.removeItem(`${taskId}`);
        let tasksDTA = [...this.readTaskIds(projectId)];
        
        tasksDTA.splice(tasksDTA.indexOf(taskId),1);
        localStorage.setItem(`${projectId}_tasks`, JSON.stringify(tasksDTA));
        return JSON.parse(localStorage.getItem(`${projectId}_tasks`));
    },

    deleteTracks(taskId) {

    },
    
    readTrackIds(taskId) {
        return JSON.parse(localStorage.getItem(`${taskId}_tracks`)) || [];
    },

    createTrack(taskId, track) {

        let trackIdCounter = JSON.parse(localStorage.getItem('trackIdCounter')) || 1;
        let trackDTA = [...this.readTrackIds(taskId)];
        trackDTA.push(`track_${trackIdCounter}`);
        localStorage.setItem(`${taskId}_tracks`, JSON.stringify(trackDTA));

        localStorage.setItem(`track_${trackIdCounter}`, JSON.stringify(track));
    
        trackIdCounter++;
        localStorage.setItem('trackIdCounter', trackIdCounter);
    },

    readTrack(trackId) {
        return JSON.parse(localStorage.getItem(`${trackId}`));
    },

    updateTrack(trackId, track) {
        localStorage.setItem(trackId, JSON.stringify(track));    
    },
    
    deleteTrack(trackId, taskId) {
        localStorage.removeItem(`${trackId}`);
        let tracksDTA  = this.readTrackIds(taskId);
        tracksDTA.splice(tracksDTA.indexOf(trackId),1);
        localStorage.setItem(`${taskId}_tracks`, JSON.stringify(tracksDTA)); 
    }


}
export default dataService;