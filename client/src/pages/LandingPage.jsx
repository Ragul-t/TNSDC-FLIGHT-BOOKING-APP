import React, { useContext, useEffect, useState } from 'react';
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {
  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [Flights, setFlights] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userType') === 'admin') {
      navigate('/admin');
    } else if (localStorage.getItem('userType') === 'flight-operator') {
      navigate('/flight-admin');
    }
  }, []);

  const fetchFlights = async () => {
    if (checkBox) {
      if (departure !== "" && destination !== "" && departureDate && returnDate) {
        const date = new Date();
        const date1 = new Date(departureDate);
        const date2 = new Date(returnDate);
        if (date1 > date && date2 > date1) {
          setError("");
          await axios.get('http://localhost:6001/fetch-flights').then(
            (response) => {
              setFlights(response.data);
              console.log(response.data);
            }
          );
        } else {
          setError("Please check the dates");
        }
      } else {
        setError("Please fill all the inputs");
      }
    } else {
      if (departure !== "" && destination !== "" && departureDate) {
        const date = new Date();
        const date1 = new Date(departureDate);
        if (date1 >= date) {
          setError("");
          await axios.get('http://localhost:6001/fetch-flights').then(
            (response) => {
              setFlights(response.data);
              console.log(response.data);
            }
          );
        } else {
          setError("Please check the dates");
        }
      } else {
        setError("Please fill all the inputs");
      }
    }
  };

  const { setTicketBookingDate } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');

  const handleTicketBooking = async (id, origin, destination) => {
    if (userId) {
      if (origin === departure) {
        setTicketBookingDate(departureDate);
        navigate(`/book-flight/${id}`);
      } else if (destination === departure) {
        setTicketBookingDate(returnDate);
        navigate(`/book-flight/${id}`);
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="landing-page-container">
      <div className="landingHero-title">
        <h1 className="h1">Welcome to Flight Booking</h1>
      </div>
      <form className="flight-search-form">
        <h3 className="form-title">Journey Details</h3>

        <div className="form-checkbox">
          <label htmlFor="returnJourney">
            <input
              type="checkbox"
              id="returnJourney"
              checked={checkBox}
              onChange={(e) => setCheckBox(e.target.checked)}
            />
            Round Journey
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Boarding point</label>
          <select
            className="form-select"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          >
            <option value="" disabled selected>
              Select Boarding point
            </option>
            <option value="Chennai">Chennai</option>
            <option value="Banglore">Banglore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Target Point</label>
          <select
            className="form-select"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="" disabled selected>
              Select Target Point
            </option>
            <option value="Chennai">Chennai</option>
            <option value="Banglore">Banglore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Journey Date</label>
          <input
            type="date"
            className="form-input"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        {checkBox && (
          <div className="form-group">
            <label className="form-label">Return Date</label>
            <input
              type="date"
              className="form-input"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}

        <div className="form-action">
          <button
            type="button"
            className="btn btn-primary"
            onClick={fetchFlights}
          >
            Search
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
      </form>

      {/* Flight Results */}
      <div className="availableFlightsContainer">
        {Flights.length > 0 ? (
          <div>
            <h1>Available Flights</h1>
            <div className="Flights">
              {Flights.map((flight) => (
                <div key={flight._id} className="Flight">
                  <p><b>Flight Name:</b> {flight.flightName}</p>
                  <p><b>Flight ID:</b> {flight.flightId}</p>
                  <button
  onClick={() =>
    handleTicketBooking(flight._id, flight.origin, flight.destination)
  }
>
  Book Now
</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No flights available</p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
