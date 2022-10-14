<template>
    <div class="formContainer">
        <div class="formWrapper">
            <span class="logo">Ennaman Chat</span>
            <span class="title">Login</span>
            <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Sign in</button>
            </form>
            <p>You don't have an account? Register</p>
        </div>
    </div>
</template>

<style lang="scss">
//Never use "@import url();" syntax for importing. Always use "@import "../path" syntax as used below.
//Otherwise Sass will not work properly.
@import "../assets/auth.scss";
</style>