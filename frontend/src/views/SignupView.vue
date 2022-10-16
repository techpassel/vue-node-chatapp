<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { validName } from '../utils/commonUtil'

const state = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const passwordMismatchError = ref(false);
const emailExistError = ref(false);
const serverError = ref('');

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

const onSubmit = async () => {
    console.log("Submitted");
    await v$.value.$validate();
}

const checkPassword = (e: any) => {
    if (state.value.password.trim() != "" && state.value.confirmPassword.trim() != "") {
        if (state.value.confirmPassword != state.value.password) {
            passwordMismatchError.value = true
        } else {
            passwordMismatchError.value = false
        }
    } else {
        passwordMismatchError.value = false
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
                    <div class="inputErrors" v-if="v$.email.$error || emailExistError">
                        <div v-for="error of v$.email.$errors" :key="error.$uid">
                            <div class="errorMsg">{{ error.$message }}</div>
                        </div>
                        <div class="errorMsg" v-if="emailExistError">Email already Exist</div>
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
                    <div class="inputErrors" v-if="v$.confirmPassword.$error || passwordMismatchError">
                        <div v-for="error of v$.confirmPassword.$errors" :key="error.$uid">
                            <div class="errorMsg">{{ error.$message }}</div>
                        </div>
                        <div class="errorMsg" v-if="passwordMismatchError">Password and confirm password must be same.
                        </div>
                    </div>
                </div>
                <div class="inputGroup">
                    <input class="avatar" type="file" id="avatar" />
                    <label for="avatar">
                        <img src="../assets/images/addAvatar.png" alt="Avatar imahe">
                        Add an avatar
                    </label>
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