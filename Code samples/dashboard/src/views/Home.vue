<template>
  <div>
    <b-card title="Add a category">
      <form v-on:submit.prevent="sendData()">
        <b-form-file v-model="file" class="mt-3" plain></b-form-file>

        <div>
          <label for="newCategoryName">New Category Name:</label>
          <b-form-input
            v-model="name"
            id="newCategoryName"
            placeholder="enter new category name"
            type="text"
          ></b-form-input>
        </div>

        <div>
          <label for="newCategoryDescription">New Category Description:</label>
          <b-form-textarea
            v-model="description"
            id="newCategoryDescription"
            placeholder="enter new category description"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </div>

        <div>
          <label for="newCategoryPrice">New Category Price:</label>
          <b-form-input
            v-model="price"
            id="newCategoryPrice"
            type="number"
          ></b-form-input>
        </div>

        <div slot="footer">
          <b-btn variant="primary" type="submit">Add</b-btn>
        </div>
      </form>
    </b-card>
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
      file: null,
      name: "",
      description: "",
      price: 0,
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
  },
};
</script>


