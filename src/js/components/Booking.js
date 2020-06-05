import {templates, select} from '../settings.js';
import AmountWidget from './AmountWidget.js';

export class Booking{
  constructor(element){
    const thisBooking = this; 
    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this; 

    const generatHTML = templates.bookingWidget();
    thisBooking.dom = {}; //stworzenie pustego obiektu
    thisBooking.dom.wrapper = element; //zapisanie do obiektu właściwości wrapper równą otrzymanemu argumentowi
    thisBooking.dom.wrapper.innerHTML = generatHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  } 
  
  initWidgets(){
    const thisBooking = this; 
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}
export default Booking;