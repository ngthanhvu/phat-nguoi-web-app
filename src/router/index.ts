import { createRouter, createWebHistory } from 'vue-router';
import Default from '../layouts/default.vue';

import Home from '../pages/home.vue';
import About from '../pages/about.vue';


const routes = [
    {
        path: '/',
        component: Default,
        children: [
            {
                path: '',
                name: 'Home',
                component: Home,
            },
            {
                path: 'about',
                name: 'About',
                component: About,
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
