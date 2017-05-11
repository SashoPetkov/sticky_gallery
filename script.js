window.onload = function() {
  let galleryList = JSON.parse(localStorage.getItem('elements-images')) || [];
  let newElement;

  class GalleryElement {
    constructor(url, sticky) {
      this.url = url;
      this.sticky = sticky;
    }
    // addToList(newElement) {
    //   galleryList.push(newElement);
    // }
  }

  const mainForm = document.querySelector('.image-details');
  const textArea = document.querySelector('.image-details textarea');
  const url = document.querySelector('[type="text"]');
  const galleryInnerHtml = document.querySelector('.gallery-list');
  const localImage = document.querySelector('[type="file"]');
  const btn = document.querySelector('button');
  const allInputs = document.querySelectorAll('h2');
  const textAreaUpload = document.querySelector('.localImage textarea');
  const popUpElement = document.querySelector('.popUp');

  mainForm.addEventListener('submit', e => addNewElement(e) );
  btn.addEventListener('click', e => uploadImage(e));

    // CREATE NEW GALLERY ELEMENT
  function addNewElement(e) {
    e.preventDefault();

    if(url.value.length > 7 && textArea.value.length > 2) {
      newElement = new GalleryElement(url.value, textArea.value);
      // newElement.addToList(newElement);
      galleryList.push(newElement);
      renderElement(galleryList);
      mainForm.reset();
    } else {
      console.log('error');
    } 
  }

    // RENDER GALLERY ELEMENTS FUNCTION
  function renderElement(galleryList) {
    const render = galleryList.map(galleryItem => {
      return (`<li>
                <img src=${galleryItem.url} alt="different images">
                <p>${galleryItem.sticky}</p>
                <span class="close">+</span>
              </li>
      `)
    }).join('');

    localStorage.setItem('elements-images', JSON.stringify(galleryList));
    galleryInnerHtml.innerHTML = render;

      // SELECT CLOSE BTN ONLY AFTER IT IS CREATED
    selectClose();
  }

    // REMOVE ELEMENT FUNCTION
  function removeSelected() {
      //select right element
    const selectImg = this.parentElement.querySelector('img').getAttribute('src');
    const selectSticky = this.parentElement.querySelector('p').textContent;
      // remove this element from list
    galleryList = galleryList.filter(oneElement => {
      if(selectSticky !== oneElement.sticky || selectImg !== oneElement.url) {
        return oneElement;
      }
    });
      // render new list without removed element
    renderElement(galleryList);
  }

    // SELECT CLOSE BTN FUNCTION
  function selectClose() {
    const close = document.querySelectorAll('.close');
    const images = document.querySelectorAll('.gallery-list img');

    close.forEach(oneClose => {
      return (oneClose.addEventListener('click', removeSelected));
    });

    // POPUP
    images.forEach(oneImg => {
      return (oneImg.addEventListener('click', popUpImage));
    });
  }
    // ADD LOCAL IMAGE
  function uploadImage(e) {
    e.preventDefault();
    const imageUpl = localImage.files[0];
    const render = new FileReader();
    newElement = new GalleryElement();

    render.onloadend = function() {
      newElement.url = render.result;
      newElement.sticky = textAreaUpload.value;
      galleryList.push(newElement);
      renderElement(galleryList);
      textAreaUpload.value = "";
    };
    if(imageUpl) {
      render.readAsDataURL(imageUpl);
    }
  }

    //ANIMATION
  allInputs.forEach( h2 => {
    h2.addEventListener('click', function() {
      this.nextElementSibling.classList.toggle('active');
      this.firstElementChild.classList.toggle('rotateArrow');
    });
  });

    // POPUP image
  function popUpImage() {
    popUpElement.classList.add('popUpActive');
    popUpElement.style.backgroundImage = `url('${this.src}')`;
    popUpElement.addEventListener('click', function(){
      this.classList.remove('popUpActive');
    });
  }

    // render gallery on start
  renderElement(galleryList);
};