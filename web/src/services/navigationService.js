// src/services/navigationService.js
import { createRouter, createWebHistory } from 'vue-router';

let router = null;

export const initializeRouter = (r) => {
    router = r;
};

export const navigateTo = (path) => {
    if (router) {
        router.push(path);
    } else {
        console.error('Router is not initialized');
    }
};
