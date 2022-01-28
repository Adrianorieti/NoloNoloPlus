import React, { useEffect } from 'react';
import './style/About.css';

function About() {


    useEffect(() => {
        document.getElementById('about').scrollIntoView({ behavior: "smooth" })

    }, [])
    return (
        <div id="main">
            <div className="container">
                <div className="row text-center justify-content-center">
                    <div class="col-xl-10 App-about" id="about">
                        <h1>Welcome</h1><br />
                        <p>Welcome to <b>Nolo Nolo plus</b> big family, the site that allows you to comfortably rent the most suitable bicycle for your
                            <b>green travels</b>. Our team is here to meet all your needs before, during and after the rental by offering you support,
                            assistance and also a wonderful points collection system that will allow you to take advantage of interesting offers.</p>

                        <p><b>Our goal is always been (and always will be) to merge our two passions, that are respect for the nature and enjoy
                            life toghether with the people we love.</b></p>

                        <p>That's why our points collection system takes into account the time you have decided to share with us organizing
                            yours <b>green holidays</b>.</p>

                        <p> Freely browse the site to have an idea of the services we are offering to you but remember: to use our services you have
                            to be registered accepting this terms of use which are always available here.  </p>

                        <br /><hr />
                        <h1 id="puntiFedelta">Points collection system</h1><br />
                        <p>You can collect point by renting. They will allow you to take advantage of bonuses (see <a href="#Pointstable"> advantages table </a>)
                            and to rise in the ranking of trusted people. </p>

                        <p>In fact, this is a <b> family </b> of people who have a passion for cycling and respecting the nature.
                            So we propose to sign with us a pact of mutual trust. </p>

                        <p> To welcome you to the family, therefore, we give you <b> 5 bonus points </b> at the moment of your registering. </p>

                        <p>We remind you that registering on the site is a necessary condition to be able to make reservations. This just to allow us to know you
                            and your preferences in order to propose the best solutions for you. </p>

                        <p>You will then receive <b> one point for each booking day </b> plus a points bonus calculated on the percentage
                            on the total cost of your rental. This is to valorize the time you decide to share with us.</p>

                        <p>But that's not all. If your booking includes days that we have selected as <b> 'cold periods' </b>,
                            the points you will receive per rental day will be <b> doubled </b>. </p>

                        <p>The 'cold periods' are such as High Stagion and so on. Periods could change or even been added during the year but we will
                            notify you in the home page any changes or additions; and 'cold periods' which are part of a
                            reservation already made will never be modified. </p>

                        <br /><hr />
                        <h1 id="tabellaPunti">Fidelity points rewards</h1>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">BAND</th>
                                    <th scope="col">POINTS</th>
                                    <th scope="col">DISCOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>FIRST</td>
                                    <td>{'>'} 50</td>
                                    <td>2%</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>SECOND</td>
                                    <td>{'>'} 90</td>
                                    <td>4%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>THIRD</td>
                                    <td>{'>'} 200</td>
                                    <td>5%</td>
                                </tr>
                                <tr>
                                    <th scope="row">4</th>
                                    <td>DELUX</td>
                                    <td>{'>'} 300</td>
                                    <td>10%</td>
                                </tr>
                            </tbody>
                        </table>

                        <br /><hr />
                        <h1 id="sconti">How to gain your fidelity points</h1>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">BY RENTAL</th>
                                    <th scope="col">BY BILL</th>
                                    <th scope="col">POINTS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td> - </td>
                                    <td>{'>'} or equal to 150 €</td>
                                    <td>30PT</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>{'>'} 10 days</td>
                                    <td> - </td>
                                    <td>25PT</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>{'>'} 7 days</td>
                                    <td>{'>'} or equal to 100 €</td>
                                    <td>15PT</td>
                                </tr>
                                <tr>
                                    <th scope="row">4</th>
                                    <td>{'>'} 3 days</td>
                                    <td>{'>'} or equal to 70 €</td>
                                    <td>10PT</td>
                                </tr>
                                <tr>
                                    <th scope="row">5</th>
                                    <td> - </td>
                                    <td>{'>'} or equal to 40 €</td>
                                    <td>8PT</td>
                                </tr>
                                <tr>
                                    <th scope="row">6</th>
                                    <td>Any case</td>
                                    <td> - </td>
                                    <td>5PT</td>
                                </tr>
                                
                            </tbody>
                        </table>

                        <br /><hr />
                        <h1 id="sconti">How to enhance your rewards</h1>
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>If the rental strats on Friday and it is during 3 or more days</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Rental longer than 12 days</td>
                                </tr>
                            </tbody>
                        </table>

                        <hr /><br />
                        <h1>Fluctuation in prices</h1><br />
                        <p>Prices can vary depending on many factors.</p>

                        <p>Especially in formulating a rental hypothesis, take into account that it is delivered an indicative 
                            price which is represented by an average among possibly fluctuations.
                            So, it may not correspond to the real price. </p>

                        <p>In fact, prices are affected by many factors such as the period when you are renting (the season if it is 
                            high or low, the period in the month e.g. if you are in these that we called 'cold' as well as in the week, e.g. a weekend),
                            the availability and quality of the bike too.</p>

                        <p>Also do not forget the fidelity points that allow you to have a discount as explained in the <a href="#Pointstable"> advantages table </a>.</p>

                        <br /><hr />
                        <p>If you share our way we see it, let's join this big family and discover all the services we can deliver for you.</p>

                        <p> We are looking forward knowing you and being able to make your holiday the most comfortable and green as we can.</p>

                        <h2>This year, join a multicolor family!</h2>
                    </div>

                    <div class="col-xl-2 score-image">

                    </div>
                </div>
            </div>
        </div>)
}


export default About;