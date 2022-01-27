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
                        <h1 id="tabellaPunti">Advantages table</h1>
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
                                    <td>FIRST BAND</td>
                                    <td>{'>'} 50</td>
                                    <td>2%</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>SECOND BAND</td>
                                    <td>{'>'} 90</td>
                                    <td>4%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>THIRD BAND</td>
                                    <td>{'>'} 200</td>
                                    <td>5%</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>DELUX</td>
                                    <td>{'>'} 300</td>
                                    <td>10%</td>
                                </tr>
                            </tbody>
                        </table>

                        <br /><hr />
                        <h1 id="sconti">Additional discounts settings</h1>
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
                        <h1>Be careful!</h1><br />
                        <p> Since we sign togheter a pact of mutual trust, we are committed to making your experience the best
                            satisfactory and accurate as possible. Likewise, we expect you to take care of the stuffs that are entrusted to you in compliance
                            of everyone's expectations. </p>

                        <p> Just as we believe it is correct to reward those who rely on us, in the same way we consider appropriate
                            evaluating accordingly the allocation of loyalty points. </p>

                        <p> For this reason, points are virtually automatically assigned at the time of booking, as described in <a href="#puntiFedelta"> Loyalty points </a>,
                            <b> but they will be subject to verification and a possible revision can be made after the booking was closed</b>.  </p>

                        <p>So, points will be added only if the stuffs have been returned in the exact condition in which they was delivered.
                            <b> Please, report immediately eventually discrepancies found at the time of delivery.</b></p>

                        <p>Hoterwise, if stuffs are damaged or have to be sent for maintenance, because it will involve inconvenience for those who have
                            made a subsequent booking, the points will be deducted or even not assigned up to leading to a report on the user's site
                            as person unreliable.</p>

                        <p>This can affect the ability of further renting for the user.</p>

                        <p>It will be always possible to have in your home a feedback about the status of the booking (successfully or with notes) and whether
                            or not the loyalty points have been assigned. </p>

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