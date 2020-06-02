import {settings, select} from './settings';


class AmountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.getElements(element);
    // thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.setValue(settings.amountWidget.defaultValue);
    thisWidget.initActions();
    // console.log('AmountWidget:', thisWidget);
    // console.log('constructor argments:', element);
  }
  getElements(element){
    const thisWidget = this;
    
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value){
    const thisWidget = this;

    let newValue = parseInt(value);

    /*TODO: Add validation */
    if(newValue>=9) {
      newValue = 9;
    }else if(newValue <= 1) {
      newValue = 1;
    }
    thisWidget.value = newValue;
    thisWidget.announce();
    thisWidget.input.value = thisWidget.value;
  }

  initActions(){
    const thisWidget = this;
    //dla thisWidget.input dodać listener eventu change 
    thisWidget.input.addEventListener('change', function () {
      //dla którego handler użyje metody setValue z takim samym argumentem, jak w konstruktorze (czyli z wartością inputa)
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  announce(){
    const thisWidget = this;

    // const event = new Event('updated');
    const event = new CustomEvent('updated',{
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}
export default AmountWidget;