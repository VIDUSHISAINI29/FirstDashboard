import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: "/",
         component: () => import("@/layout/AppLayout.vue"),
         children: [
            {
               path:'/dashboard',
               name:'dashboard',
               component: () => import("@/pages/Dashboard/Dashboard.vue")
            }
         ],
      },
   ],
});

export default router;
