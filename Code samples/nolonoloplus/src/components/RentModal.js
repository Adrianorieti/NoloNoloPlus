import React from 'react';
import { useHistory } from "react-router";
import  {useState} from 'react';
import Modal from 'react-modal';
import RangeDaysPicker from "./RangeDaysPicker"



function RentModal(props) {
 
    let history = useHistory();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date());

    function openModal()
    {
        setIsOpen(true);
    }

    function closeModal()
    {
        setIsOpen(false);
    }

      // Stile del modale
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          width: '60%',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          height: '500px', // <-- This sets the height
          overlfow: 'scroll' // <-- This tells the modal to scrol
        },
        overlay: {
            backgroundColor: 'rgba(10,10,10,0.8)'
          }
      };

    //creiamo una ipotesi di noleggio
    function makeHypothesis(){

        const token = sessionStorage.getItem('token');
        let startingDate = document.querySelector("#fromDate").innerHTML;
        let endingDate = document.querySelector("#toDate").innerHTML;
        //il prodotto in questione
        let form_obj = `{
            "name": "${props.product}", 
            "startingDate": "${startingDate}",
            "endingDate": "${endingDate}"
           }`;
        let url = 'http://localhost:8001/api/rentalHypothesis';
        // Creiamo il payload da mandare al server
        const options = {
              method: 'POST',
              headers: new Headers({ 'Content-type': 'application/json'}),
              body: form_obj
            };
        fetch(url, options)
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }else{return(console.log(response.status))}
        }).then()
    }

  return(
    <div>
    <button className="btn btn-primary" onClick={openModal} >{props.name}</button>
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal">
         
          <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand">Create a reservation</a>
                    <form class="d-flex justify-content-space-between">
                        <button className="btn btn-outline-danger" onClick={closeModal} >x</button>
                    </form>
                 </div>
            </nav>
            <div className="content m-2 text-center">
            <fieldset aria-required="true">
          <legend>Renting dates inputs</legend>
          <section className="mb-3">
            <RangeDaysPicker />
          </section>
        </fieldset>
        <button  type="button" className="btn btn-success" onClick={makeHypothesis} >Click to submit</button>


            
             </div>
       
          </Modal>
      </div>

  );
}

export default RentModal;