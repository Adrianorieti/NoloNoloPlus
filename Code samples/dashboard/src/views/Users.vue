<template>
  <div>
    <div class="search-wrapper">
      <div class="form-floating w-75">
        <input
          type="email"
          class="form-control"
          id="floatingFilter"
          v-model="searchQuery"
          placeholder="username@domain.it"
        />
        <label for="floatingFilter">Filter for Email Address</label>
      </div>
    </div>
    <div class="divide">
      <div
        class="card custom-card"
        v-for="user in resultQuery"
        :key="user.email"
      >
        <img
          :src="'http://localhost:8001/images/users/' + user.image"
          class="card-img-top"
          alt="user profile pic"
        />
        <div class="card-body">
          <h5 class="card-title">
            <a
              :href="'/users/' + user.email"
              @click.prevent="route(user.email)"
              class="stretched-link st_link_dec"
            >
              {{ user.email }}</a
            >
          </h5>
          <p class="card-text">
            Payment Method: {{ user.paymentMethod }}
            <br/>
            Fidelity Points: {{user.fidelityPoints}}
            </p>
        </div>
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
      searchQuery: "",
    };
  },

  mounted() {
    let url = "http://localhost:8001/api/user/";
    fetch(url)
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
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        return this.users.filter((user) => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => user.email.toLowerCase().includes(v));
        });
      } else {
        return this.users;
      }
    },
  },
  methods: {
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
  font-size: 1.3em;
}
.divide {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-around;
}

img{
  max-height: 25rem;
}

.custom-card {
  max-width: 20rem;
  margin-top: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

.custom-card:hover {
  box-shadow: 5px 10px 20px 5px rgba(0, 0, 0, 0.4);
  transform: scale(1.1);
}

.search-wrapper {
  display: flex;
  justify-content: center;
}
</style>