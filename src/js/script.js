/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
      
      // console.log('new Product:', thisProduct);
    }
    renderInMenu(){
      const thisProduct = this;
      /*generate HTML based on template*/ 
      const generateHTML = templates.menuProduct(thisProduct.data); // wywołanie metody templates.menuProduct i przekazanie danych produktów 

      /*create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generateHTML);

      /*find menu container*/ 
      const menuContainer = document.querySelector(select.containerOf.menu);

      /*add element to menu */ 
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion(){
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.accordionTrigger;
      /* START: click event listener to trigger */
      clickableTrigger.addEventListener('click', function(){
      /* prevent default action for event */
        event.preventDefault(); 
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active'); 
        /* find all active products */
        const activeProducts = document.querySelectorAll('.active'); 
        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts) { 
        /* START: if the active product isn't the element of thisProduct */
          if (activeProduct != thisProduct.element) {
          /* remove class active for the active product */
            activeProduct.classList.remove('active');
            /* END: if the active product isn't the element of thisProduct */
          }
          /* END LOOP: for each active product */
        }   
        /* END: click event listener to trigger */
      });
    }

    initOrderForm(){
      const thisProduct = this;
      // console.log('initOrderForm:',thisProduct);
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    processOrder(){
      const thisProduct = this;
      // console.log('processOrder:',thisProduct);
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      // console.log('formData', formData);
      thisProduct.params = {};
      /* set variable price to equal thisProduct.data.price */
      let price = thisProduct.data.price;
      /* START LOOP: for each paramId in thisProduct.data.params */
      for(let paramId in thisProduct.data.params){
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];
        /* START LOOP: for each optionId in param.options */
        for(let optionId in param.options){
          /* save the element in param.options with key optionId as const option */
          const option = param.options[optionId];
          /* START IF: if option is selected and option is not default */
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          if (optionSelected && !option.default) {
            price += option.price;
          }
          else if (!optionSelected && option.default) {
            price -= option.price;
          }
          //stworzenie stałej, w której zapiszesz wyszukane elementy
          const images = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
          //START; blok if/else, którego warunek sprawdza tylko, czy opcja została zaznaczona,
          if (optionSelected) {
            if(!thisProduct.params[paramId]){
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;
            //zarówno wewnątrz bloku if jak i else, musi znaleźć się pętla iterująca po znalezionych elementach
            for (let image of images){
              //dla każdego z tych elementów ma być dodana (w bloku if) lub usunięta (w bloku else) odpowiednia klasa
              image.classList.add(classNames.menuProduct.imageVisible);
            }
          } else {
            for(let image of images){
              image.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }  
      }
      //set variable price to equal thisProduct.priceElem
      /* multiply price by amount */
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = thisProduct.price;
      console.log(thisProduct.params);
    }

    initAmountWidget(){
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      }); 
    }

    addToCart(){
      const thisProduct = this; 
      thisProduct.name = thisProduct.data.name;
      thisProduct.amountWidget.value = thisProduct.amount;
      app.cart.add(thisProduct);
    }
  }

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

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart{
    constructor(element){
      const thisCart = this; //stała thisCart w której zapisuje obiekt this 

      thisCart.products = []; //tablica do przechowywania produktów dodanych do koszyka

      thisCart.getElements(element);

      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    getElements(element){
      const thisCart = this;

      thisCart.dom = {}; // obiekt w którym będą przechowywane wszystkie elementy DOM, wyszukane w komponencie koszyka

      thisCart.dom.wrapper = element;
      
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      
    }

    initActions(){
      const thisCart = this;
      //ne elemencie thisCart.dom.toggleTrigger dodajemy listener eventu 'click'
      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        //Handler tego listenera ma toggle'ować klasę zapisaną w classNames.cart.wrapperActive na elemencie thisCart.dom.wrapper
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
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
    }
  }

  const app = {
    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource;
    },

    initMenu: function(){
      const thisApp = this;
      // console.log('thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    
    //Metoda initCart która będzie inicjować instancje koszyka 
    initCart: function (){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem); //instancja klasy cart zapisana w thisApp.cart (poza obiektem app możemy wywołać ją za pomocą app.cart)
    },

    init: function(){
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };
  app.initData();
  app.initMenu();
  app.init();
  app.initCart();
}
