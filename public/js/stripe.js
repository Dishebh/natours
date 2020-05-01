import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_Be5syimLELnmeSEKHk6TOFzb006Ojixp79');

export const bookTour = async tourId => {
  try {
    // console.log('Hi from the booking!!');
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log(session);

    // 2) Create checkout from + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err);
  }
};
