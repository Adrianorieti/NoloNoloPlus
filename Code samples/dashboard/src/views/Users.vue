<template>
  <div>
    <div class="card-list">
      <card
        v-for="user in users"
        :key="user.email"
        :title="user.name + ' ' + user.surname"
        :email="user.email"
        :payment="user.paymentMethod"
      />
    </div>
  </div>
</template>

<script>
import card from "../components/imagecard";

export default {
  name: "users",
  data() {
    return {
      users: [],
      user: {},
    };
  },
  components: {
    card,
  },
  mounted() {
    this.changeView();
  },
  methods: {
    changeView() {
      this.getAllUsers();
    },
    getAllUsers() {
      let fetch_options = {
        method: "GET",
        headers: new Headers({ "Content-type": "application/json" }),
      };
      let url = "http://localhost:8001/api/user/";
      fetch(url, fetch_options)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          this.users = data.users;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.card-list {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>