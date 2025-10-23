import { createRouter, createWebHistory } from 'vue-router';
import Default from '../layouts/default.vue';

import Home from '../pages/home.vue';
import History from '../pages/history.vue';


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
                path: 'history',
                name: 'History',
                component: History,
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
