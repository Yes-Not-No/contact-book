//Sections
const contactList = document.querySelector('.contacts__contact-list');
const editorSection = document.querySelector('.editor');

//User name elements
const userName = document.querySelector('.contacts__name');
const userNameContainer = document.querySelector('.contacts__name-container');

//Editor elements
const editorNameInput = editorSection.querySelector('#editor-name-input');
const editorPhoneInput = editorSection.querySelector('#editor-phone-input');
const editorEmailInput = editorSection.querySelector('#editor-email-input');
const editorCompanyInput = editorSection.querySelector('#editor-company-input');
const editorWebsiteInput = editorSection.querySelector('#editor-website-input');

//Buttons
const editorSaveButton = editorSection.querySelector('.editor__save-button');
const editorCloseButton = editorSection.querySelector('.editor__close-button');
const addNewContactButton = document.querySelector('.contacts__addNewContactButton');

//Other variable
const editorContactName = editorSection.querySelector('.editor__contact-name');
let activeContactId;

//App state object and it methods
let currentState = {
    username: "Set Name. Click me!",
    state: [],
    setState: function () {
        this.state = JSON.parse(localStorage.getItem("contacts"))
    },
    writeState: function() {
        localStorage.setItem("contacts", JSON.stringify(currentState.state))
    },
    setUserName: function () {
        if (localStorage.getItem("username") == null) {
            localStorage.setItem("username", currentState.username)
        } else {
            this.username = localStorage.getItem("username")
        }

        userName.textContent = this.username;
    },
    renderContactList: function () {
        currentState.sortNames();
        this.state.forEach((element) => {
            contactList.insertAdjacentHTML('beforeend',
                `<li class="contacts__contact-item contact-item" id=${element.orderid}>
                                <div class="contact-item__img-container">
                                    <img src="./images/avatar.jpg" alt="fdew">
                                </div>
                                <div class="contact-item__name-container">
                                    <p class="contact-item__name">${element.name}</p>
                                    <p class="contact-item__phone">${element.phone}</p>
                                </div>
                            </li>`)
        })
    },
    sortNames: function () {
        this.state = this.state.sort((a, b) => {
            if (a.name > b.name) {
                return 1
            }
            if (b.name > a.name) {
                return -1
            }
            return 0
        })

        let orderID = 0;
        this.state.forEach((element) => {
            element.orderid = orderID;
            orderID++;
        })
    },
}

//Get JSON from server and write it into Local Storage
async function getContacts(url) {
    let response = await fetch(url);
    let contactsJSON = await response.json();

    if (localStorage.getItem("contacts") == null) {
        localStorage.setItem("contacts", JSON.stringify(contactsJSON)) //Set Local Storage items if it haven't been set
    }
}

//Function below draws items in a list of contacts according to Current State
function setContactList(callback) {
    currentState.renderContactList();

    callback(saveButtonHandler); //After contact items were rendered, set hendlers on each of them
}

//Function below set handlers on contact items to open contact editor
function contactItemHendler(saveButtonCallback) {
    const contactItemsCollection = contactList.querySelectorAll('li');

    contactItemsCollection.forEach((contact) => {
        contact.addEventListener('click', () => {
            editorSaveButton.removeEventListener("click", updateState);
            editorSaveButton.removeEventListener('click', saveNewContact);

            editorSection.classList.add('editor--shown');

            //Write values from a Local Storage data into editor inputs
            editorNameInput.value = currentState.state[contact.getAttribute('id')].name;
            editorPhoneInput.value = currentState.state[contact.getAttribute('id')].phone;
            editorEmailInput.value = currentState.state[contact.getAttribute('id')].email;
            editorCompanyInput.value = currentState.state[contact.getAttribute('id')].company.name;
            editorWebsiteInput.value = currentState.state[contact.getAttribute('id')].website;

            activeContactId = contact.getAttribute('id');

            saveButtonCallback(); //Here we call a function that going to be provided in params to set handlers on "Save" button
        })
    })
}

//Callback for "saveButtonHandler"
function updateState() {
    currentState.state[activeContactId].name = editorNameInput.value;
    currentState.state[activeContactId].phone = editorPhoneInput.value;
    currentState.state[activeContactId].email = editorEmailInput.value;
    currentState.state[activeContactId].company.name = editorCompanyInput.value;
    currentState.state[activeContactId].website = editorWebsiteInput.value;

    currentState.writeState(); //Re-write Local Storage with new values

    contactList.innerHTML = ""; //Clear contact list to re-write it with new values
    hideEditor(); //And hide editor section
    setContactList(contactItemHendler);
}

//Function below set a handler on "Save" button that refresh a Local Storage data and launch contact list render
function saveButtonHandler() {
    editorSaveButton.addEventListener("click", updateState, { once: true })
}

//Callback for "closeButtonHandler"
function hideEditor() {
    editorSection.classList.remove('editor--shown');
}

//Set a handler on "Close" button
function closeButtonHandler() {
    editorCloseButton.addEventListener('click', hideEditor);
}

//"Save" button handler for new contact
function saveNewContact() {
    currentState.state.push({
        name: editorNameInput.value,
        phone: editorPhoneInput.value,
        email: editorEmailInput.value,
        company: {
            name: editorCompanyInput.value,
        },
        website: editorWebsiteInput.value,
    })

    contactList.innerHTML = ""; //Clear contact list to re-write it with new values
    hideEditor(); //And hide editor section
    setContactList(contactItemHendler);
    currentState.writeState();
}

//Callback for "Add" button click handler
function addButtonHandler() {
    clearEditorInputs(); //Clear all inputs in editor
    addNewContactButton.removeEventListener('click', addButtonHandler); // Remove "Add" button handler to avoid a multiple actuation
    editorSaveButton.removeEventListener("click", updateState); // Remove existing contact update handler

    editorSection.classList.add('editor--shown');

    editorSaveButton.addEventListener('click', saveNewContact, {once: true}) //Set "Save" button handler for new contact
    addNewContactButton.addEventListener('click', addButtonHandler)
}

//Clear Inputs in editor
function clearEditorInputs() {
    editorNameInput.value = "";
    editorPhoneInput.value = "";
    editorEmailInput.value = "";
    editorCompanyInput.value = "";
    editorWebsiteInput.value = "";
}

//Add handler for user name to make it editable
userName.addEventListener('click', function () {
    userName.textContent = currentState.username;
    userName.setAttribute('style', 'display: none;'); //Hide user name 'p' tag

    //Create new input
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.classList.add('contacts__name-edit-input')
    newInput.value = currentState.username;
    userNameContainer.appendChild(newInput); // Render Input into name container
    newInput.focus();

    //Set new handler on "Enter" button to accept changes when it done
    window.addEventListener('keydown', function (e) {
        if (e.code == "Enter") {
            e.preventDefault();
            currentState.username = newInput.value;
            userName.textContent = currentState.username;

            userName.removeAttribute('style', 'display: none;');

            newInput.remove();

            localStorage.setItem("username", currentState.username); //Re-write Local Storage with new values
        }
    })
})

//Set a handler on "Add" button
addNewContactButton.addEventListener('click', addButtonHandler)

//Set a handler on "Close" button in editor
closeButtonHandler();

await getContacts('https://demo.sibers.com/users');

//Set app state
currentState.setState();
currentState.setUserName();

setContactList(contactItemHendler);

//Done :)






