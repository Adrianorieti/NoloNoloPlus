<template>
  <div id="login">
    <h1>Login</h1>
    <input
      type="text"
      required
      name="email"
      v-model="email"
      placeholder="Email"
    />
    <input
      type="password"
      name="password"
      v-model="password"
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
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      const buff = Buffer.from(this.password, "utf-8");
      const encodedpass = buff.toString("base64");
      let payload = {
        email: this.email,
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
          if (response.status === 200) {
            return response.json();
          } else {
            console.log("The username and / or password is incorrect");
          }
        })
        .then((data) => {
          sessionStorage.setItem("token", data.accessToken);
          sessionStorage.setItem("email", this.email);
          this.$emit("authenticated", true);
          this.$router.replace({ name: "home" });
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