<template>
  <div>
    <b-card-group>
      <card
        v-for="user in users"
        :key="user.email"
        :title="user.name + ' ' + user.surname"
        :email="user.email"
        :text="'Payment Method: ' + user.paymentMethod"
        :path="'users/' + user.email"
        :imageSrc="'http://localhost:8001/images/users/' + user.image"
      />
    </b-card-group>
  </div>
</template>

<script>
import card from "../components/imagecard";

export default {
  name: "users",
  data() {
    return {
      users: [],
    };
  },
  components: {
    card,
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
  },
};
</script>

<style scoped>
.deck {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>