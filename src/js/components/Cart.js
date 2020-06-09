import {settings, select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';
class Cart{
  constructor(element){
    const thisCart = this; //stała thisCart w której zapisuje obiekt this 
    console.log(thisCart);

    thisCart.products = []; //tablica do przechowywania produktów dodanych do koszyka

    thisCart.getElements(element);

    thisCart.initActions();

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    // console.log('new Cart', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {}; // obiekt w którym będą przechowywane wszystkie elementy DOM, wyszukane w komponencie koszyka

    thisCart.dom.wrapper = element;
      
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector('input[name="phone"]');
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for (let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
      

  }

  initActions(){
    const thisCart = this;
    //ne elemencie thisCart.dom.toggleTrigger dodajemy listener eventu 'click'
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      //Handler tego listenera ma toggle'ować klasę zapisaną w classNames.cart.wrapperActive na elemencie thisCart.dom.wrapper
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: 'test',
      totalPrice: thisCart.totalPrice,
      phone: thisCart.phone,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      totalNumber: thisCart.totalNumber,
      products: [],
    };

    for (let product of thisCart.products){
      product.getData();
      payload.products.push(product);
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response){
        return response.json();
      }).then(function (parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }

  add(menuProduct){
    //const thisProduct = this; 
    console.log('adding product', menuProduct);

    const thisCart = this;
      
    /* generate HTML based on template*/
    const generatedHTML = templates.cartProduct(menuProduct);
     
    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    console.log('dom', generatedDOM);
    /* add element to menu */
    const cartProductList = thisCart.dom.productList;

    cartProductList.appendChild(generatedDOM);
    console.log('cartProductList', cartProductList);

    // thisCart.products.push(menuProduct);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM)); //jednoczesnie tworzę nową instancję klasy i dodaje ją do tablicy thisCart.products
    console.log('thisCart.products', thisCart.products);

    this.update();
  }

  update(){
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let thing of thisCart.products){
      thisCart.subtotalPrice += thing.price;
      thisCart.totalNumber += thing.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log(thisCart.totalNumber);
    console.log(thisCart.subtotalPrice);
    console.log(thisCart.totalPrice);

    for(let key of thisCart.renderTotalsKeys){
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct){
    const thisCart = this; 
    const index = thisCart.products.indexOf(cartProduct); 
    thisCart.products.splice(index);
    cartProduct.dom.wrapper.remove();

    thisCart.update();
  }
}

export default Cart;
