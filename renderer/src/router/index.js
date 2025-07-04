import { createRouter, createWebHistory } from "vue-router";
import WebsiteView from "../views/WebsiteView.vue"
import GraphsView from "../views/GraphsView.vue"
import ManagerView from "../views/ManagerView.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "graphs",
            component: GraphsView,
        },
        {
            path: '/website/:url',
            name: "website",
            component: WebsiteView,
            props: (route) => ({
                url: decodeURIComponent(route.params.url)
            })
        },
        {
            path: "/manager",
            name: "manager",
            component: ManagerView,
        },
    ]
});

export default router;