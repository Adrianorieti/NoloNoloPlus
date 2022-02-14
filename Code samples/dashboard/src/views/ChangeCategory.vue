<template>
  <div>
    <form aria-describedby="change-category" v-on:submit.prevent="sendData()">
      <fieldset>
        <legend id="change-category">Change a Category</legend>

      <div>
        <label for="selectedCategory" class="form-label">Category to change</label>
        <div class="input-group">
            <div class="input-group-text">
            <i class="bi bi-bicycle"
                aria-hidden="true"
                style="font-size: 1rem"
              ></i>
            </div>
            <select class="form-select" required v-model="cat" v-on:change="fillData" id="selectedCategory">
              <option value="" selected disabled>Please select one</option>
              <option v-for="category in categories" :key="category.name" :value="category">{{category.name}}</option>
            </select>
          </div>
      </div>

        <div>
          <label for="file" class="form-label">Category Photo</label>
          <div class="input-group">
            <input
              id="file"
              type="file"
              class="form-control"
            />
          </div>
        </div>

        <div>
          <label for="newCategoryDescription" class="form-label"
            >Category Description:</label
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
        <label for="discount" class="form-label">Discount Code</label>
        <div class="input-group">
            <div class="input-group-text">
              <i class="bi bi-tag"
                aria-hidden="true"
                style="font-size: 1rem"
              ></i>
            </div>
            <select class="form-select" required v-model="discountCode"  id="discount">
              <option value="" selected disabled>Please select one</option>
              <option value="N">Normal</option>
              <option value="F">Festivity</option>
              <option value="AS">High Season</option>
              <option value="BS">Low Season</option>
            </select>
          </div>
      </div>

        <div>
          <label for="newCategoryPrice" class="form-label"
            >Category Price:</label
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
        <input type="submit" class="btn btn-primary" value="Change" />
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
  name: "CategoryForm",
  data() {
    return {
        categories: [],
        cat: "",
        description: "",
        discountCode: "",
        price: 0,
    };
  },
    async mounted() {
    let url = "http://site202145.tw.cs.unibo.it/api/categories/";
    try {
      let response = await fetch(url);
      this.categories = await response.json();
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    sendData() {
      let photo = document.getElementById("file").files[0];
      let formData= new FormData();
        formData.append("description", this.description);
        formData.append("price", this.price);
        formData.append("discountCode", this.discountCode);
      if(photo){
        formData.append("img", photo);
        formData.append("oldImg", this.cat.imageName);
      }

      fetch("http://site202145.tw.cs.unibo.it/api/categories/"+this.cat.name, {
        method: "PATCH",
        body: formData,
      })
      .then((response) => {
        if(response.status === 200){
          this.$router.push({path: "/dashboard/categories"});
        }
      })
      .catch((err) => {
        console.log(err);
      });
    
    },
    fillData(){
      this.description = this.cat.description;
      this.price = this.cat.price;
      this.discountCode = this.cat.discountCode;
    }
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