<template>
  <form v-on:submit.prevent="sendData()">
    <div class="mb-3">
      <label for="firstName" class="form-label">First Name</label>
      <input
        v-model="name"
        id="firstName"
        type="text"
        class="form-control"
        name="firstName"
        placeholder="John"
        required="required"
      />
    </div>

    <div class="mb-3">
      <label for="secondName" class="form-label">Second name</label>
      <input
        v-model="surname"
        id="secondName"
        type="text"
        class="form-control"
        name="secondName"
        placeholder="Doe"
        required="required"
      />
    </div>

    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input
        v-model="email"
        id="email"
        type="email"
        class="form-control"
        name="email"
        placeholder="username@studio.unibo.it"
        required="required"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        title="not valid email"
      />
      <label id="registermail-error" for="email" class="error"
        >{this.emailError}</label
      >
    </div>

    <div class="mb-3">
      <label for="phone" class="form-label">Phone Number</label>
      <input
        v-model="phone"
        id="phone"
        type="tel"
        class="form-control"
        name="phone"
        required="required"
        pattern="[0-9]{10}"
        title="not a valid phone number"
      />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        v-model="password"
        id="password"
        type="password"
        class="form-control"
        name="password"
        required="required"
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        title="Password must contain a number, a capital letter and a length of at least 8 characters"
      />
    </div>

    <div class="mb-3">
      <label for="repeatPassword" class="form-label">Repeat Password</label>
      <input
        v-model="repeatPassw"
        id="repeatPassword"
        type="password"
        class="form-control"
        name="repeatPassword"
        required="required"
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        title="Password must contain a number, a capital letter and a length of at least 8 characters"
      />
      <label for="repeatPassword" class="error">{this.repeatPasswError}</label>
    </div>

    <input type="submit" class="btn btn-primary" value="Create" />
  </form>
</template> 

<script>
export default {
  name: "employeeForm",
  data() {
    return {
      name: "",
      surname: "",
      phone: "",
      email: "",
      password: "",
      repeatPassw: "",
      repeatPasswError: "",
      emailError: "",
    };
  },
  methods: {
    sendData() {
      let formData = new FormData();
      formData.append("img", this.file);
      formData.append("name", this.name);
      formData.append("description", this.description);
      formData.append("price", this.price);
      formData.append("discountCode", "N");

      fetch("http://localhost:8001/api/categories/", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.message);
          this.file = null;
          this.name = "";
          this.description = "";
          this.price = 0;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    check() {
      //qui voglio checcare se tutto va bene, come passw, email etc etc
    },
  },
};
</script>

<style scoped>
.error {
  font-size: 1em;
  color: red;
}
</style>