function login(event)
      {
        event.preventDefault();
        console.log("sono qui");
          let mail = $('#inputEmail').val();
          let pass = $('#inputPassword').val();
          
          let data = `{
            "email": "${mail}",
            "password": "${pass}"
          }`;

          $.post({
            type: 'POST',
              url: 'http://localhost:8001/api/employee/login',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              data: data
            }, function(data){
              sessionStorage.setItem('token', data.accessToken);
              window.location.href = `http://localhost:8001/employee/panel?token=${data.accessToken}`;
            });
}

/** Get all single products from database */
function goToRentalHypothesis()
{
  window.location.href = `http://localhost:8001/employee/rentalHypothesis`;
}