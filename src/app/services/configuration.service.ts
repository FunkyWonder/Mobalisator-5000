import { Injectable } from '@angular/core';
import { Slide } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
    slidesArray: Array<Slide> = this.getConfig();

    getConfig(): Array<any> {
        const currentConfig = localStorage.getItem('project_config');
        if (currentConfig == null) {
            const defaultConfig: Array<any> = [];
            this.setConfig(defaultConfig);
            return defaultConfig;
        }
        return JSON.parse(currentConfig);
    }

    setConfig(config: Array<any>): void {
        localStorage.setItem('project_config', JSON.stringify(config));
    }

    auto_play_duration: number = this.getAutoplayDuration();

    setAutoplayDuration(duration: number) {
        localStorage.setItem("auto_play_duration", String(duration)); // in seconds
        this.auto_play_duration = duration;
    }

    getAutoplayDuration(): number {
        var duration = localStorage.getItem("auto_play_duration"); // in seconds
        if (duration == null) {
            return 60; // 60 Seconds
        }
        return Number(duration);
    }
}