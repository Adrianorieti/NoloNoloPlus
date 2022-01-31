<template>
  <div>
    <form aria-describedby="register-category" v-on:submit.prevent="sendData()">
      <fieldset>
        <legend id="register-category">Add a new Category</legend>

        <div>
          <label for="file" class="form-label">Category Photo</label>
          <div class="input-group">
            <input
              id="file"
              type="file"
              class="form-control"
              required="required"
            />
          </div>
        </div>

        <div>
          <label for="newCategoryName" class="form-label"
            >New Category Name:</label
          >
          <div class="input-group">
            <div class="input-group-text">
              <i
                class="bi bi-type"
                aria-hidden="true"
                style="font-size: 1rem"
              ></i>
            </div>
            <input
              v-model="name"
              id="newCategoryName"
              type="text"
              class="form-control"
              placeholder="Electric Bike"
              required="required"
            />
          </div>
        </div>

        <div>
          <label for="newCategoryDescription" class="form-label"
            >New Category Description:</label
          >
          <div class="input-group">
            <div class="input-group-text">
              <i
                class="bi bi-type"
                aria-hidden="true"
                style="font-size: 1rem"
              ></i>
            </div>
            <textarea
              v-model="description"
              id="newCategoryDescription"
              class="form-control"
              placeholder="Some Description"
              required="required"
              rows="3"
              max-rows="6"
            />
          </div>
        </div>

        <div>
          <label for="newCategoryPrice" class="form-label"
            >New Category Price:</label
          >
          <div class="input-group">
            <div class="input-group-text">
              <i
                class="bi bi-currency-bitcoin"
                aria-hidden="true"
                style="font-size: 1rem"
              ></i>
            </div>
            <input
              v-model="price"
              id="newCategoryPrice"
              type="number"
              min="0"
              class="form-control"
              required="required"
            />
          </div>
        </div>

        <br />
        <input type="submit" class="btn btn-primary" value="Create" />
        <button class="btn btn-warning back" @click="route()">Back</button>
      </fieldset>
    </form>
  </div>
</template>

<script>
//quello che voglio fare qui è:
// o avere varie carte con varie funzionalità (aggiunta categoria e employee.)
//o essere un wrapper di funzionalità per mandare ad altre pagine.
//il discount lo mettiamo sempre medio, poi il resto vediamo, il price lo facciamo inserire

export default {
  name: "Home",
  data() {
    return {
      name: "",
      description: "",
      price: 0,
    };
  },
  methods: {
    sendData() {
      let photo = document.getElementById("file").files[0];
      let formData = new FormData();
      formData.append("img", photo);
      formData.append("name", this.name);
      formData.append("description", this.description);
      formData.append("price", this.price);
      formData.append("discountCode", "N");

      console.log(formData);

      fetch("http://localhost:8001/api/categories/", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.message);
          this.name = "";
          this.description = "";
          this.price = 0;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  route() {
    this.$router.push({ path: "/employees" });
  },
};
</script>

<style scoped>
form {
  display: flex;
  justify-content: center;
}
fieldset {
  width: 50%;
  padding: 1rem;
  border: 1px solid black;
  border-radius: 2%;
}
.back {
  margin-left: 2rem;
}
</style>


