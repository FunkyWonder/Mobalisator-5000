export function getAllGitLabProjects() {
    var api_endpoint: string = `https://gitlab.moba.net/api/v4/projects/`;
    var response = [ 
        {
              "id": 381,
              "description": "",
              "name": "mloader-image",
              "name_with_namespace": "Moba Developers / Handling Solutions projects / mloader-image",
              "path": "mloader-image",
              "path_with_namespace": "moba-developers/handling-solutions-projects/mloader-image",
              "created_at": "2023-05-08T11:30:46.893Z",
              "default_branch": "develop",
              "tag_list": [],
              "topics": [],
              "ssh_url_to_repo": "ssh://git@gitlab.moba.net:2222/moba-developers/handling-solutions-projects/mloader-image.git",
              "http_url_to_repo": "https://gitlab.moba.net/moba-developers/handling-solutions-projects/mloader-image.git",
              "web_url": "https://gitlab.moba.net/moba-developers/handling-solutions-projects/mloader-image",
              "readme_url": "https://gitlab.moba.net/moba-developers/handling-solutions-projects/mloader-image/-/blob/develop/README.md",
              "forks_count": 0,
              "avatar_url": null,
              "star_count": 0,
              "last_activity_at": "2023-05-08T11:30:46.893Z",
              "namespace": {
                  "id": 255,
                  "name": "Handling Solutions projects",
                  "path": "handling-solutions-projects",
                  "kind": "group",
                  "full_path": "moba-developers/handling-solutions-projects",
                  "parent_id": 51,
                  "avatar_url": "/uploads/-/system/group/avatar/255/play_store_512.png",
                  "web_url": "https://gitlab.moba.net/groups/moba-developers/handling-solutions-projects"
              },
              "_links": {
                  "self": "https://gitlab.moba.net/api/v4/projects/381",
                  "issues": "https://gitlab.moba.net/api/v4/projects/381/issues",
                  "merge_requests": "https://gitlab.moba.net/api/v4/projects/381/merge_requests",
                  "repo_branches": "https://gitlab.moba.net/api/v4/projects/381/repository/branches",
                  "labels": "https://gitlab.moba.net/api/v4/projects/381/labels",
                  "events": "https://gitlab.moba.net/api/v4/projects/381/events",
                  "members": "https://gitlab.moba.net/api/v4/projects/381/members",
                  "cluster_agents": "https://gitlab.moba.net/api/v4/projects/381/cluster_agents"
              },
              "packages_enabled": true,
              "empty_repo": false,
              "archived": false,
              "visibility": "private",
              "resolve_outdated_diff_discussions": false,
              "container_expiration_policy": {
                  "cadence": "1d",
                  "enabled": false,
                  "keep_n": 10,
                  "older_than": "90d",
                  "name_regex": ".*",
                  "name_regex_keep": null,
                  "next_run_at": "2023-05-09T11:31:02.579Z"
              },
              "issues_enabled": true,
              "merge_requests_enabled": true,
              "wiki_enabled": true,
              "jobs_enabled": true,
              "snippets_enabled": true,
              "container_registry_enabled": true,
              "service_desk_enabled": false,
              "service_desk_address": null,
              "can_create_merge_request_in": true,
              "issues_access_level": "enabled",
              "repository_access_level": "enabled",
              "merge_requests_access_level": "enabled",
              "forking_access_level": "enabled",
              "wiki_access_level": "enabled",
              "builds_access_level": "enabled",
              "snippets_access_level": "enabled",
              "pages_access_level": "private",
              "operations_access_level": "enabled",
              "analytics_access_level": "enabled",
              "container_registry_access_level": "enabled",
              "security_and_compliance_access_level": "private",
              "releases_access_level": "enabled",
              "environments_access_level": "enabled",
              "feature_flags_access_level": "enabled",
              "infrastructure_access_level": "enabled",
              "monitor_access_level": "enabled",
              "emails_disabled": null,
              "shared_runners_enabled": true,
              "group_runners_enabled": true,
              "lfs_enabled": true,
              "creator_id": 180,
              "import_url": null,
              "import_type": "gitlab_custom_project_template",
              "import_status": "finished",
              "open_issues_count": 0,
              "ci_default_git_depth": 20,
              "ci_forward_deployment_enabled": true,
              "ci_job_token_scope_enabled": false,
              "ci_separated_caches": true,
              "ci_opt_in_jwt": false,
              "ci_allow_fork_pipelines_to_run_in_parent_project": true,
              "public_jobs": true,
              "build_timeout": 3600,
              "auto_cancel_pending_pipelines": "enabled",
              "ci_config_path": "",
              "shared_with_groups": [],
              "only_allow_merge_if_pipeline_succeeds": false,
              "allow_merge_on_skipped_pipeline": null,
              "restrict_user_defined_variables": false,
              "request_access_enabled": true,
              "only_allow_merge_if_all_discussions_are_resolved": false,
              "remove_source_branch_after_merge": true,
              "printing_merge_request_link_enabled": true,
              "merge_method": "merge",
              "squash_option": "default_off",
              "enforce_auth_checks_on_uploads": true,
              "suggestion_commit_message": null,
              "merge_commit_template": null,
              "squash_commit_template": null,
              "issue_branch_template": null,
              "auto_devops_enabled": false,
              "auto_devops_deploy_strategy": "continuous",
              "autoclose_referenced_issues": true,
              "repository_storage": "default",
              "keep_latest_artifact": true,
              "runner_token_expiration_interval": null,
              "approvals_before_merge": 0,
              "mirror": false,
              "external_authorization_classification_label": null,
              "marked_for_deletion_at": null,
              "marked_for_deletion_on": null,
              "requirements_enabled": false,
              "requirements_access_level": "enabled",
              "security_and_compliance_enabled": true,
              "compliance_frameworks": [],
              "issues_template": null,
              "merge_requests_template": null,
              "merge_pipelines_enabled": false,
              "merge_trains_enabled": false,
              "allow_pipeline_trigger_approve_deployment": false,
              "permissions": {
                  "project_access": null,
                  "group_access": null
              }
          }
      ]
    return response;
}

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
        "queued_duration": 4463,
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

export function getQueueDuration() : {"minutes": Number, "seconds": Number} {
    var projectPipeline = getAllGitLabProjects();
    var queueDurations = [];
    for (let project of projectPipeline) {
        var GitLabProject = getGitLabProjectById(project["id"]);
        var queueDuration = GitLabProject["queued_duration"]; // in seconds
        queueDurations.push(Number(queueDuration));
    }
    queueDurations.sort();
    var maxDuration = queueDurations[queueDurations.length-1];
    var minutes = Math.floor(maxDuration / 60);
    var seconds = maxDuration % 60;
    return {"minutes": minutes, "seconds": seconds};
}

export function getLastActivity(projectId: number) : string {
    var projectPipeline = getAllGitLabProjects();
    for (let project of projectPipeline) {
        if (project["id"] == projectId) {
            var last_activity_at = project["last_activity_at"];
            var converted_date = new Date(last_activity_at);
            return `${converted_date.toLocaleDateString()} ${converted_date.toLocaleTimeString()}`;
            break;
        }
    }
    return "Never"
}