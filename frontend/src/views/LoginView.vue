<script lang="ts" setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useUserStore } from '../stores/userStore';
import router from '@/router';
import { RouterLink } from 'vue-router';

const userStore = useUserStore();
const { login } = userStore;

const serverError = ref<string>('');

const state = ref({
    email: '',
    password: ''
})

const validationRules = {
    email: { required, email },
    password: { required, min: minLength(6) }
}

const v$ = useVuelidate(validationRules, state);

const onSubmit = async () => {
    await v$.value.$validate();
    if (v$.value.$error) {
        return;
    }

    try {
        let res = await login(state.value);
        if (res == 'Success') {
            router.push("/home");
        }
    } catch (err: any) {
        err = err.message;
        serverError.value = err;
    }
}
</script>

<template>
    <div class="formContainer">
        <div class="formWrapper">
            <span class="logo">Ennaman Chat</span>
            <span class="title">Login</span>
            <form @submit.prevent="onSubmit">
                <div class="inputGroup">
                    <input type="email" placeholder="Email" v-model="state.email" />
                    <!-- Error Message -->
                    <div class="inputErrors" v-if="v$.email.$error">
                        <div v-for="error of v$.email.$errors" :key="error.$uid">
                            <div class="errorMsg">{{ error.$message }}</div>
                        </div>
                    </div>
                </div>
                <div class="inputGroup">
                    <input type="password" placeholder="Password" v-model="state.password" />
                    <!-- Error Message -->
                    <div class="inputErrors" v-if="v$.email.$error">
                        <div v-for="error of v$.email.$errors" :key="error.$uid">
                            <div class="errorMsg">{{ error.$message }}</div>
                        </div>
                    </div>
                </div>
                <div class="errorMsg" v-if="serverError != ''">{{serverError}}</div>
                <button>Sign in</button>
            </form>
            <p>You don't have an account?<RouterLink class="authPageLink" to="/auth">Register</RouterLink></p>
        </div>
    </div>
</template>

<style lang="scss">
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import "../assets/auth.scss";
</style>