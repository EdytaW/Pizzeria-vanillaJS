import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue); //tj konstruktor klasy BaseWidget
    const thisWidget = this;
    thisWidget.getElements(element);
    // thisWidget.value = settings.amountWidget.defaultValue;
    // thisWidget.setValue(settings.amountWidget.defaultValue);
    thisWidget.initActions();
    // console.log('AmountWidget:', thisWidget);
    // console.log('constructor argments:', element);
  }
  getElements(){
    const thisWidget = this;
    
    // thisWidget.dom.wrapper = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value){
    return !isNaN(value)
    && value >= settings.amountWidget.defaultMin 
    && value <= settings.amountWidget.defaultMax;
  }

  renederValue(){
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions(){
    const thisWidget = this;
    //dlathisWidget.dom.input dodać listener eventu change 
    thisWidget.dom.input.addEventListener('change', function () {
      //dla którego handler użyje metody setValue z takim samym argumentem, jak w konstruktorze (czyli z wartością inputa)
      thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

 
}
export default AmountWidget;