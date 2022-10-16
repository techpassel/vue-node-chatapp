import { storeToRefs } from "pinia";
import router from "./index";
import { useUserStore } from '../stores/userStore';

const navigationGuard = () => {
    router.beforeEach((to, from, next) => {
        const userStore = useUserStore();
        const { user } = storeToRefs(userStore);
        const isAuthenticated = user.value?.id;
        if (to.fullPath.startsWith("/auth") && isAuthenticated) {
            next({ name: 'home' })
            return;
        } else if (!to.fullPath.startsWith("/auth") && !isAuthenticated) {
            next({ name: 'login' })
            return;
        }
        next();
    })
}

export default navigationGuard;
