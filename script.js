import { getAllProducts, updateProduct } from './transform-data.js';

console.log('started');

let GLOBAL_TEST;

// the global data holder
const data = await getAllProducts();

// catching DOM elements
// main containers
const CARDS_CONTAINER = document.getElementById('products-container');
const EDIT_PRODUCT = document.getElementById('edit-product');
const PRODUCT_VIEW = document.getElementById('product-view');
const HOME = document.getElementById('home');

// categories filter
const allButton = document.getElementById("all-button");
const menButton = document.getElementById("men-button");
const womenButton = document.getElementById("women-button");
const jewelryButton = document.getElementById("jewelry-button");
const electronicsButton = document.getElementById("electronics-button");

// Catch the search input and search button
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// add and home buttons
const HOME_BUTTON = document.getElementById('go-home');
const ADD_NEW_BUTTON = document.getElementById('add-button');

// global variables
let idCounter = data[data.length - 1].id + 1;
let selectedCategory = "all";
let searchWord = '';

// track the displays to return back later
const viewsStack = [];

// helper function to create and add DOM elements
const createAndAddElement = (tag, parent, className, id, content) => {
    const newElement = document.createElement(tag);
    if (id) newElement.id = id;
    if (content) newElement.innerText = content;
    if (className) newElement.classList.add(className);
    if (parent) parent.appendChild(newElement);
    return newElement;
}
// function to switch between views in the page
const switchDisplay = (toView) => {
    HOME.className = 'd-none';
    EDIT_PRODUCT.className = 'd-none';
    PRODUCT_VIEW.className = 'd-none';
    toView.className = 'd-block';
}
const back = () => {
    viewsStack.pop();// remove the current div from the stack
    switchDisplay(viewsStack[viewsStack.length - 1]);
}
const goHome = () => {
    // empty the current div and remove it from the stack
    viewsStack.pop();
    // empty the stack
    viewsStack.length = 0;
    viewsStack.push(HOME);
    switchDisplay(HOME);
    renderCards();
}
const deleteProduct = (product, card) => {
    // delete the product from the page
    CARDS_CONTAINER.removeChild(card);
    // delete the product from the array
    for (let [index, element] of data.entries()) {
        if (element.id === product.id) {
            data.splice(index, 1);
            break;
        }
    }
}

const emptyTheEditForm = () => {
    const form = document.getElementById('form-a');
    form.elements['title'].value = '';
    form.elements['price'].value = '';
    form.elements['description'].value = '';
    form.elements['category'].value = '';
    form.elements['image-url'].value = '';
}

// add new product to data and return to home page
const addProduct = () => {
    const formHeadline = document.getElementById('edit-headline');
    formHeadline.innerHTML = '';
    const backButton = createAndAddElement('button', formHeadline);
    backButton.innerHTML = '<i class="material-icons">arrow_back</i>';
    backButton.addEventListener('click', back);
    createAndAddElement('h1', formHeadline, undefined, undefined, 'Add New Product');
    const form = document.getElementById('form-a');
    emptyTheEditForm();
    const FORM_SUBMIT_BUTTON = document.getElementById('submit-form');
    FORM_SUBMIT_BUTTON.innerText = 'Add';
    viewsStack.push(EDIT_PRODUCT);
    switchDisplay(EDIT_PRODUCT);
    const submitFunction = (ev) => {
        ev.preventDefault();
        const title = form.elements['title'].value;
        const category = form.elements['category'].value;
        const price = form.elements['price'].value;
        const image = form.elements['image-url'].value;
        const quantity = form.elements['quantity'].value;
        const description = form.elements['description'].value;
        const id = idCounter;
        idCounter++;
        const newProduct = {id, title, price, description, image, category, quantity, rating: undefined};
        data.push(newProduct);
        back();
        selectedCategory = 'all';
        renderCards();
        // remove the event listener from the button
        ev.target.removeEventListener('click', submitFunction);
    }
    form.addEventListener('submit', submitFunction);
}
const editProduct = product => {
    console.log('edit fn call', product);
    // open the edit product page
    const formHeadline = document.getElementById('edit-headline');
    formHeadline.innerHTML = '';
    const backButton = createAndAddElement('button', formHeadline);
    backButton.innerHTML = '<i class="material-icons">arrow_back</i>';
    backButton.addEventListener('click', back);
    const homeButton = createAndAddElement('button', formHeadline);
    homeButton.innerHTML = '<i class="material-icons">pageview</i>';
    const searchButton = createAndAddElement('button', formHeadline);
    searchButton.innerHTML = '<i class="material-icons">search</i>';
    createAndAddElement('h1', formHeadline, undefined, undefined, 'Edit Product');
    const form = document.getElementById('form-a');
    form.elements['title'].value = product.title;
    form.elements['price'].value = product.price;
    form.elements['description'].value = product.description;
    form.elements['category'].value = product.category;
    form.elements['image-url'].value = product.image;
    const FORM_SUBMIT_BUTTON = document.getElementById('submit-form');
    FORM_SUBMIT_BUTTON.innerText = 'Save';
    viewsStack.push(EDIT_PRODUCT);
    switchDisplay(EDIT_PRODUCT);
    const submitFunction = async (ev) => {
        console.log('submit fn called', product);// db
        ev.preventDefault();
        const id = product.id;
        try {
            const properties = {
                title: form.elements['title'].value,
                category: form.elements['category'].value,
                price: form.elements['price'].value,
                image: form.elements['image-url'].value,
                quantity: form.elements['quantity'].value,
                description: form.elements['description'].value,
            }
            const modifiedProduct = await updateProduct(id, properties);
            Object.assign(product, modifiedProduct);
            // TODO show success massage
        } catch (error) {
            console.error(error);
            // TODO show error massage
        }
        back();
        selectedCategory = 'all';
        renderCards();
        // remove the event listener from the form
        form.removeEventListener('submit', submitFunction);
    }
    form.addEventListener('submit', submitFunction);
}
// create the product display
const viewProduct = product => {
    PRODUCT_VIEW.innerHTML = '';// clear the properties of the previous product
    const navHeadline = createAndAddElement('div', PRODUCT_VIEW, 'product-view-headline');
    const backButton = createAndAddElement('button', navHeadline, 'view-product-button');
    backButton.innerHTML = '<i class="material-icons">arrow_back</i>';// TODO replace this
    backButton.addEventListener('click', back);
    const homeButton = createAndAddElement('button', navHeadline, 'view-product-button');
    homeButton.innerHTML = '<i class="material-icons">home</i>';
    homeButton.addEventListener('click', () => 'TODO: some function');
    homeButton.addEventListener('click', goHome);
    const editButton = createAndAddElement('button', navHeadline, 'view-product-button');
    editButton.innerHTML = '<i class="material-icons">edit</i>';
    editButton.addEventListener('click', () => {
        editProduct(product);
    });
    const viewProductDiv = createAndAddElement('div', PRODUCT_VIEW, 'product-view');
    const productItselfDiv = createAndAddElement('div', viewProductDiv, 'single-product');
    const productImage = createAndAddElement('img', productItselfDiv, 'sing-product-image');
    productImage.src = product.image;
    productImage.alt = 'product image';
    const productProperties = createAndAddElement('div', productItselfDiv, 'product-properties');
    createAndAddElement('h3', productProperties, 'product-properties-headline', undefined, 'Title');
    createAndAddElement('p', productProperties, 'product-properties', undefined, product.title);
    createAndAddElement('h3', productProperties, 'product-properties-headline', undefined, 'Description');
    createAndAddElement('p', productProperties, 'product-properties', undefined, product.description);
    if (product.category) {
        createAndAddElement('h3', productProperties, 'product-properties', undefined, 'Category');
        createAndAddElement('p', productProperties, 'product-properties-headline', undefined, product.category);
    }
    createAndAddElement('h3', productProperties, 'product-properties-headline', undefined, 'Price');
    createAndAddElement('p', productProperties, 'product-properties', undefined, `${product.price}`);
    // createAndAddElement('h3', productProperties, 'product-properties-headline', undefined, 'Quantity');
    // createAndAddElement('p', productProperties, 'product-properties', undefined, `${product.quantity}`);
    switchDisplay(PRODUCT_VIEW);
    viewsStack.push(PRODUCT_VIEW);
}
// function to create product card
const createProductCard = product => {
    const card = createAndAddElement('div', CARDS_CONTAINER, 'card', product.id);
    const imageContainer = createAndAddElement('div', card, 'image-container');
    const image = createAndAddElement('img', imageContainer, 'product-image');
    image.src = product.image;
    image.alt = 'product image';
    createAndAddElement('h3', card, 'product-title', undefined, product.title);
    createAndAddElement('hr', card, 'card-hr');
    const actions = createAndAddElement('div', card, 'actions');
    const deleteButton = createAndAddElement('button', actions, 'card-button');
    deleteButton.innerHTML = '<i class="material-icons">delete</i>';
    deleteButton.addEventListener('click', (ev) => {
        ev.stopPropagation();
        deleteProduct(product, card);
    })
    const editButton = createAndAddElement('button', actions, 'card-button');
    editButton.innerHTML = '<i class="material-icons">edit</i>';
    editButton.addEventListener('click', (ev) => {
        ev.stopPropagation();
        editProduct(product);
    })
    // set product view when clicking on the product
    card.addEventListener('click', () => {
        viewProduct(product);
    })
}
// draw the page
const renderCards = () => {
    // clear all the product and add the product which match the selected category
    CARDS_CONTAINER.innerHTML = '';
    let itemFound = false;
    for (let product of data) {
        const productDescription = (product.description + product.title + product.category).toLowerCase();
        if ((selectedCategory === 'all' || product.category === selectedCategory)
        && (searchWord === '' || productDescription.includes(searchWord.toLowerCase()))) {
            createProductCard(product);
            itemFound = true;
        }
    }
    if (!itemFound) createAndAddElement('p', CARDS_CONTAINER, 'no-found-massage', undefined, 'No Matches Found');
    switchDisplay(HOME);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    viewsStack.push(HOME);
}
// handle the filter buttons
const unmarkedCategories = () => {
    menButton.classList.remove('selected-category');
    womenButton.classList.remove('selected-category');
    jewelryButton.classList.remove('selected-category');
    electronicsButton.classList.remove('selected-category');
    allButton.classList.remove('selected-category');
}

menButton.addEventListener('click', () => {
    selectedCategory = "men's clothing";
    unmarkedCategories();
    menButton.classList.add('selected-category');
    renderCards();
});

womenButton.addEventListener('click', () => {
    selectedCategory = "women's clothing";
    unmarkedCategories();
    womenButton.classList.add('selected-category');
    renderCards();
});

jewelryButton.addEventListener('click', () => {
    unmarkedCategories();
    selectedCategory = "jewelery";
    jewelryButton.classList.add('selected-category');
    renderCards();
});

electronicsButton.addEventListener('click', () => {
    selectedCategory = "electronics";
    unmarkedCategories();
    electronicsButton.classList.add('selected-category');
    renderCards();
});

allButton.addEventListener('click', () => {
    selectedCategory = "all";
    unmarkedCategories();
    allButton.classList.add('selected-category');
    renderCards();
});

const search = () => {
    searchWord = searchInput.value;
    // searchInput.value = '';
    renderCards();
    // TODO add search tag
}

// set the header buttons
HOME_BUTTON.addEventListener('click', goHome);
ADD_NEW_BUTTON.addEventListener('click', addProduct);
searchButton.addEventListener('click', search);
searchInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') search();
})

// set the edit form cancel button
document.getElementById('cancel-edit').addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    back();
})

// select the text in the search input when clicking on it
searchInput.addEventListener('click', () => searchInput.select());

renderCards();