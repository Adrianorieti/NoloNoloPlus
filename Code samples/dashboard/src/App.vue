<template>
  <div id="app">
    <div id="nav">
      <b-navbar toggleable="lg" type="light" variant="light">
        <b-navbar-brand href="#"
          ><img src="./assets/NoloNoloLogo.png" alt="logo di Nolo Nolo Plus"
        /></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item v-if="authenticated" to="/users">Users</b-nav-item>
            <b-nav-item v-if="authenticated" to="/employees">
              Employees
            </b-nav-item>
            <b-nav-item v-if="authenticated" to="/categories">
              Categories
            </b-nav-item>
            <b-nav-item v-if="authenticated" to="/products">
              Products
            </b-nav-item>
            <b-nav-item v-if="authenticated" to="/reservationCharts">
              Reservations Charts
            </b-nav-item>
            <b-nav-item v-if="authenticated" to="/modify">
              Personal Page
            </b-nav-item>
            <b-nav-item href="http://localhost:8001/employee/panel"
              >BackOffice</b-nav-item
            >
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item
              v-if="authenticated"
              to="/login"
              @click="logout()"
              replace
              >Logout</b-nav-item
            >
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view @authenticated="setAuthenticated" />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      authenticated: false,
    };
  },
  mounted() {
    let token = sessionStorage.getItem("token");
    if (token) {
      fetch(`http://localhost:8001/api/auth/manager/${token}`)
        .then((response) => {
          if (response.status === 200) {
            this.authenticated = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status;
    },
    logout() {
      sessionStorage.clear();
      this.authenticated = false;
    },
  },
};
</script>

<style>

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #4bd35a;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>

// color: #42b983;
