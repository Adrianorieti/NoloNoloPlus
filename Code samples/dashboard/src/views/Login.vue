<template>
  <div class="container">
    <form aria-labelledby="login" class="box bg-light" v-on:submit.prevent="login()">
      <fieldset>
        <legend id="login">Please enter your Login and Password</legend>
        <div>
          <input
            v-model="email"
            id="email"
            type="email"
            class="form-control"
            placeholder="username@studio.unibo.it"
            required="required"
          />
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="password"
            class="form-control"
            required="required"
          />
        </div>
        <input type="submit" class="btn" value="Login" />
      </fieldset>
    </form>
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
          this.$router.push({ path: "/users" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
/* #login {
  width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  margin-top: 200px;
  padding: 20px;
} */

.container {
  display: flex;
  justify-content: center;
}
.box {
  border: 1px solid black;
  border-radius: 5%;
  width: 50%;
  text-align: center;
  transition: 0.25s;
  margin-top: 100px;
}
.box input[type="email"],
.box input[type="password"] {
  border: 0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #3498db;
  padding: 10px 10px;
  width: 250px;
  outline: none;
  color: black;
  border-radius: 24px;
  transition: 0.25s;
}

.box legend {
  color: black;
  text-transform: uppercase;
  font-weight: 500;
}

.box input[type="email"]:focus,
.box input[type="password"]:focus {
  width: 300px;
  border-color: #2ecc71;
}

.box input[type="submit"] {
  border: 0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #2ecc71;
  padding: 14px 40px;
  outline: none;
  color: black;
  border-radius: 24px;
  transition: 0.25s;
  cursor: pointer;
}

.box input[type="submit"]:hover {
  background: #2ecc71;
}
</style>