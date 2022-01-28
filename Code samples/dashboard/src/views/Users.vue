<template>
  <div>
    <!-- <b-card-group>
      <card
        v-for="user in users"
        :key="user.email"
        :title="user.name + ' ' + user.surname"
        :email="user.email"
        :text="'Payment Method: ' + user.paymentMethod"
        :path="'users/' + user.email"
        :imageSrc="'http://localhost:8001/images/users/' + user.image"
      />
    </b-card-group> -->
    <div class="card-group">
      <div class="card" v-for="user in users" :key="user.email">
        <img
          :src="'http://localhost:8001/images/users/' + user.image"
          class="card-img-top"
          alt="user profile pic"
        />
        <div class="card-body">
          <h5 class="card-title">
            <a href="/cazzo" class="stretched-link st_link_dec">
              {{ user.email }}</a
            >
          </h5>
          <p class="card-text">Payment Method: {{ user.paymentMethod }}</p>
        </div>
        <!-- <div slot="footer">
          <b-button @click="route(user.email)" variant="primary"
            >Go to Personal Page</b-button
          >
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    return {
      users: [],
    };
  },

  mounted() {
    this.getAllUsers();
  },
  methods: {
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
    route(email) {
      let path = "users/" + email;
      this.$router.push({ path: path });
    },
  },
};
</script>

<style scoped>
.st_link_dec {
  text-decoration: none;
  color: black;
}
</style>