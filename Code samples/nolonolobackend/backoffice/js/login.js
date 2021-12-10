function login(event)
      {
        event.preventDefault();
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
              sessionStorage.setItem('email', mail);
              window.location.href = `http://localhost:8001/employee/panel?token=${data.accessToken}`;
            });
}

/** Get all single products from database */
function goToRentalHypothesis()
{
  sessionStorage.clear();
  window.location.href = `http://localhost:8001/employee/rentalHypothesis`;
}