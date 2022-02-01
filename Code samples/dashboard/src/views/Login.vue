<template>
  <div id="login">
    <h1>Login</h1>
    <input
      type="text"
      required
      name="email"
      v-model="input.email"
      placeholder="Email"
    />
    <input
      type="password"
      name="password"
      v-model="input.password"
      required
      placeholder="Password"
    />
    <button type="button" v-on:click="login()">Login</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      input: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      const buff = Buffer.from(this.input.password, "utf-8");
      const encodedpass = buff.toString("base64");
      let payload = {
        email: this.input.email,
        password: encodedpass,
      };
      let options = {
        // Creiamo il payload da mandare al server
        method: "POST",
        headers: new Headers({ "Content-type": "application/json" }),
        body: JSON.stringify(payload),
      };
      let url = "http://localhost:8001/api/account/login/manager";
      fetch(url, options)
        .then((response) => {
          if (response.status == 200) {
            this.$emit("authenticated", true);
            this.$router.replace({ name: "home" });
          } else {
            console.log("The username and / or password is incorrect");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
#login {
  width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  margin-top: 200px;
  padding: 20px;
}
</style>