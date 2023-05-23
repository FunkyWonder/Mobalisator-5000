
export function getGitLabProjectById(projectId: number) {
    var api_endpoint: string = `https://gitlab.moba.net/api/v4/projects/${projectId}/latest`;
    var response = {
        "id": 38319,
        "iid": 20,
        "project_id": 381,
        "sha": "dd44813bc93bb191e7a13a5ddaf14c7c4571ecda",
        "ref": "develop",
        "status": "success",
        "source": "push",
        "created_at": "2023-02-16T12:24:51.992Z",
        "updated_at": "2023-02-16T13:40:05.485Z",
        "web_url": "https://gitlab.moba.net/moba-developers/handling-solutions-projects/mloader-image/-/pipelines/38319",
        "before_sha": "a4c0f72c01180763081932bab32d42493a64a394",
        "tag": false,
        "yaml_errors": null,
        "user": {
            "id": 180,
            "username": "Some.User",
            "name": "Some User",
            "state": "active",
            "avatar_url": "https://gitlab.moba.net/uploads/-/system/user/avatar/180/avatar.png",
            "web_url": "https://gitlab.moba.net/Some.User"
        },
        "started_at": "2023-02-16T13:39:45.531Z",
        "finished_at": "2023-02-16T13:40:05.481Z",
        "committed_at": null,
        "duration": 19,
        "queued_duration": 4493,
        "coverage": 100,
        "detailed_status": {
            "icon": "status_failed",
            "text": "failed",
            "label": "failed",
            "group": "failed",
            "tooltip": "failed",
            "has_details": false,
            "details_path": "/moba-developers/handling-solutions-projects/mloader-image/-/pipelines/38319",
            "illustration": null,
            "favicon": "/assets/ci_favicons/favicon_status_failed-41304d7f7e3828808b0c26771f0309e55296819a9beea3ea9fbf6689d9857c12.png"
        }
    }

    return response;
}

export function getProjectStatus(projectId: number) : string {
    var projectPipeline = getGitLabProjectById(projectId);
    var projectStatus = projectPipeline["status"];
    return projectStatus;
}

export function getProjectCoverage(projectId: number): number | null {
    var projectPipeline = getGitLabProjectById(projectId);
    var projectCoverage: number | null = projectPipeline.coverage;
    return projectCoverage;
}

export function projectCoverageToHexColor(coverage: number | null) : string {
    if (coverage == null) {
        return "#717171";
    }
    if (coverage > 80) { 
        return "#43B45E";
    }
    if (coverage > 50) {
        return "#FD990D";
    }
    if (coverage <= 50) {
        return "#DF4B45";
    }
    return "#717171";
}