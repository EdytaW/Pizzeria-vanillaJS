import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children; //znalezienie kontenera wszystkich stron
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');
    thisApp.navImages = document.querySelectorAll(select.nav.images);
    
    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    
    thisApp.activatePage(pageMatchingHash);
    thisApp.handleNavLink(thisApp.navLinks);
    thisApp.handleNavLink(thisApp.navImages);
    // for (let link of thisApp.navLinks){
    //   link.addEventListener('click', function(event){
    //     const clickedElement = this;
    //     event.preventDefault();

    //     /*get page id from href attribute */
    //     const id = clickedElement.getAttribute('href').replace('#', '');
    //     /*run thisApp.activatePage with id*/
    //     thisApp.activatePage(id);

    //     /*change url hash*/
    //     window.location.hash = '#/' + id;
    //   });
    // }

    
  },

  handleNavLink(allLinks) {
    const thisApp = this;
    for (let link of allLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /*get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');
        /*run thisApp.activatePage with id*/
        thisApp.activatePage(id);

        /*change url hash*/
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;
    /*add class "active" to matching pages, remove from non-matching*/
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /*add class "active" to matching links, remove from non-matching*/
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
    
  },
  initData: function(){
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse',parsedResponse);
        /*save parsedResponse as thisApp.data.products*/
        thisApp.data.products = parsedResponse;
        /*execute initMenu method*/
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));  
  },
  
  initMenu: function(){
    const thisApp = this;
    // console.log('thisApp.data:', thisApp.data);

    for(let productData in thisApp.data.products){
      // new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
    
  //Metoda initCart która będzie inicjować instancje koszyka 
  initCart: function (){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem); //instancja klasy cart zapisana w thisApp.cart (poza obiektem app możemy wywołać ją za pomocą app.cart)

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function(){
    const thisApp = this;
    const widgetContainer = document.querySelector(select.containerOf.booking); //znajduje kontener widgetu do rezerwacji stron, którego selektor jest zapisany w select.containerOf.booking
    thisApp.booking = new Booking(widgetContainer); //nowa instancja klasy Booking 
  },

  initCarousel() {
    const carouselArray = [];

    carouselArray[0] = {
      title: 'Perfect Food', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', author: '- Julia Roberts',
    };
    carouselArray[1] = {
      title: 'Amaizing service', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', author: '- Pamela Anderson',
    };
    carouselArray[2] = {
      title: 'Best coffee', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', author: '- Brad Pitt',
    };

    let i = 0;
    const dots = document.querySelectorAll('.carousel-dots i');
    function changeSlide() {
      const title = document.querySelector('.review-title');
      const text = document.querySelector('.review-text');
      const name = document.querySelector('.review-author');

      for (let dot of dots) {
        if (dot.id == 'dot-'+ (i + 1)) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
        title.innerHTML = carouselArray[i].title;
        text.innerHTML = carouselArray[i].text;
        name.innerHTML = carouselArray[i].author;
      }

      if (i < carouselArray.length - 1) {
        i++;
      } else {
        i = 0;
      }
    }
    changeSlide();

    setInterval(() => {
      changeSlide();
    }, 3000);
  },

  init: function(){
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCarousel();
    // thisApp.initMenu();
  },
};
app.initData();
app.initMenu();
app.init();
app.initCart();
app.initBooking();


