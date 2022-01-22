<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Add an employee</h5>
      <p class="card-text">
        <form @submit={handleRegister}>
                <div class="mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input onChange={handleChange} id="firstName" type="text" class="form-control" name="firstName"
                        aria-describedby="emailHelp" placeholder="John" required="required" />
                </div>

                <div class="mb-3">
                    <label for="secondName" class="form-label">Second name</label>
                    <input onChange={handleChange} id="secondName" type="text" class="form-control" name="secondName"
                        aria-describedby="emailHelp" placeholder="Doe" required="required" />
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input onChange={handleChange} id="email" type="email" class="form-control" name="email"
                        placeholder="username@studio.unibo.it" required="required" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        title="not valid email" />
                    <label id='registermail-error' for="email" style={{ fontSize: "1em", color: 'red' }}></label>

                </div>

                <div class="mb-3">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input onChange={handleChange} id="phone" type="tel" class="form-control" name="phone" required="required"
                        pattern="[0-9]{10}" title="not a valid phone number" />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input onChange={handleChange} id="password" type="password" class="form-control" name="password" required="required"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Password must contain a number, a capital letter and a length of at least 8 characters" />
                </div>

                <div class="mb-3">
                    <label for="repeatPassword" class="form-label">Repeat Password</label>
                    <input onChange={handleChange} id="repeatPassword" type="password" class="form-control" name="repeatPassword"
                        required="required" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Password must contain a number, a capital letter and a length of at least 8 characters" />
                    <label for="repeatPassword" style={{ fontSize: 12, color: red }}>{repeatpassError}</label>
                </div>

                <input type="submit" class="btn btn-primary" value="Register" />
          </form>
      </p>
    </div>
  </div>
</template> 

<script>
export default {
  name: "employeeForm",
};
</script>