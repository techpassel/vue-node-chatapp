<template>
    <div class="formContainer">
        <div class="formWrapper">
            <span class="logo">Ennaman Chat</span>
            <span class="title">Register</span>
            <form>
                <input type="text" placeholder="Display Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <input class="avatar" type="file" id="avatar"/>
                <label for="avatar">
                    <img src="../assets/images/addAvatar.png" alt="Avatar imahe">
                    Add an avatar
                </label>
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