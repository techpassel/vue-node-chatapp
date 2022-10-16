<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { validName } from '../utils/commonUtil'
import { useUserStore } from '../stores/userStore'
import { storeToRefs } from 'pinia';
import router from '@/router';

const userStore = useUserStore();
//For state and Getters(i.e. computed properties we need to use 'storeToRefs'  but not for actions)
const { uploadPercentage } = storeToRefs(userStore);
const { signup } = userStore;

const state = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const isPasswordMismatchError = ref<boolean>(false);
const isEmailExistError = ref<boolean>(false);
const serverError = ref<string>('');
const imageFile = ref<any>();
const fileError = ref<string>();

const validationRules = {
    name: {
        required,
        name_validation: {
            $validator: validName,
            $message: 'Invalid name. Valid name only contain letters and space.'
        }
    },
    email: { required, email },
    password: { required, min: minLength(6) },
    confirmPassword: { required }
}

const v$ = useVuelidate(validationRules, state);

const checkPassword = (e: any) => {
    if (state.value.password.trim() != "" && state.value.confirmPassword.trim() != "") {
        if (state.value.confirmPassword != state.value.password) {
            isPasswordMismatchError.value = true
        } else {
            isPasswordMismatchError.value = false
        }
    } else {
        isPasswordMismatchError.value = false
    }
}

const setImageFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
        const fileSize = Math.floor((file.size / 1000000) * 100) / 100;
        if (fileSize > 20) {
            fileError.value = `Image size should be less than 20 mb. Current file size is ${fileSize} mb.`;
            return;
        }
    }

    imageFile.value = file ? file : null;
    if (imageFile.value) {
        fileError.value = '';
    } else {
        fileError.value = 'An image for avatar is required';
    }
}

const onSubmit = async () => {
    isEmailExistError.value = false;
    if (!imageFile.value) {
        fileError.value = 'An image for avatar is required'
    }

    await v$.value.$validate();
    if (v$.value.$error || isPasswordMismatchError.value || fileError.value) {
        return;
    }

    let formData = new FormData();
    formData.append("name", state.value.name.trim());
    formData.append("email", state.value.email.trim());
    formData.append("password", state.value.password.trim());
    formData.append("image", imageFile.value);
    try {
        let res = await signup(formData);
        if (res == 'Success') {
            router.push("/home");
        }
    } catch (err: any) {
        err = err.message;
        if (err == "emailExist") {
            isEmailExistError.value = true;
            return;
        }
        serverError.value = err;
    }
}
</script>

<template>
    <div class="formContainer">
        <div class="formWrapper">
            <span class="logo">Ennaman Chat</span>
            <span class="title">Register</span>
            <form @submit.prevent="onSubmit">
                <div class="inputGroup">
                    <input type="text" placeholder="Name" v-model="state.name" />
                    <!-- Error Message -->
                    <div class="inputErrors" v-if="v$.name.$error">
                        <div v-for="error of v$.name.$errors" :key="error.$uid">
                            <div class="errorMsg">{{ error.$message }}</div>
                        </div>
                    </div>
                </div>
                <div class="inputGroup">
                    <input type="email" placeholder="Email" v-model="state.email" />
                    <!-- Error Message -->
                    <div class="inputErrors" v-if="v$.email.$error || isEmailExistError">
                        <div v-for="error of v$.email.$errors" :key="error.$uid">
                            <div class="errorMsg">{{ error.$message }}</div>
                        </div>
                        <div class="errorMsg" v-if="isEmailExistError">Email already exist</div>
                    </div>
                </div>
                <div class="inputGroup">
                    <input type="password" placeholder="Password" @input="checkPassword" v-model="state.password" />
                    <!-- Error Message -->
                    <div class="inputErrors" v-if="v$.password.$error">
                        <div v-for="error of v$.password.$errors" :key="error.$uid">
                            <div class="errorMsg">{{ error.$message }}</div>
                        </div>
                    </div>
                </div>
                <div class="inputGroup">
                    <input type="text" placeholder="Confirm Password" @input="checkPassword"
                        v-model="state.confirmPassword" />
                    <!-- Error Message -->
                    <div class="inputErrors" v-if="v$.confirmPassword.$error || isPasswordMismatchError">
                        <div v-for="error of v$.confirmPassword.$errors" :key="error.$uid">
                            <div class="errorMsg">{{ error.$message }}</div>
                        </div>
                        <div class="errorMsg" v-if="isPasswordMismatchError">Password and confirm password must be same.
                        </div>
                    </div>
                </div>
                <div class="inputGroup">
                    <input class="avatar" type="file" id="avatar" @input="setImageFile" />
                    <label for="avatar">
                        <img src="../assets/images/addAvatar.png" alt="Avatar imahe">
                        Add an avatar
                    </label>
                    <div v-if="fileError" class="errorMsg">{{fileError}}</div>
                </div>
                <div v-if="imageFile" class="imageFileName">{{imageFile.name}}
                    <font-awesome-icon icon="fa-solid fa-circle-check" class="circleCheckIcon" />
                </div>
                <div class="errorMsg" v-if="serverError != ''">{{serverError}}</div>
                <button>Sign up</button>
            </form>
            <p>You do have an account? Login</p>
        </div>
    </div>
</template>

<style lang="scss">
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import "../assets/auth.scss";
</style>