const contactList = document.querySelector('.contacts__contact-list');
const editorSection = document.querySelector('.editor');
const editorNameString = editorSection.querySelector('.editor__contact-name');
const editorPhoneInput = editorSection.querySelector('#editor-phone-input');
const editorEmailInput = editorSection.querySelector('#editor-email-input');
const editorCompanyInput = editorSection.querySelector('#editor-company-input');
const editorWebsiteInput = editorSection.querySelector('#editor-website-input');
const editorSaveButton = editorSection.querySelector('.editor__save-button');
const editorContactName = editorSection.querySelector('.editor__contact-name');
const editorCloseButton = editorSection.querySelector('.editor__close-button');

//Get JSON from server and write it into Local Storage
async function getContacts(url) {
    let response = await fetch(url);
    let contactsJSON = await response.json();

    if(localStorage.getItem("contacts") == null) {
        localStorage.setItem("contacts", JSON.stringify(contactsJSON)) //Set Local Storage items if it haven't been set
    }
}

await getContacts('https://demo.sibers.com/users');


//Function below draws items in a list of contacts according to Local Storage data
function setContactList(callback) {
    let localstorageData = JSON.parse(localStorage.getItem("contacts")); //Refrash and write Local Storage data into "localstorageData" to use it inside this function

    localstorageData.forEach((element) => {
        contactList.insertAdjacentHTML('beforeend',
            `<li class="contacts__contact-item contact-item" id=${element.id}>
                            <div class="contact-item__img-container">
                                <img src="./images/avatar.jpg" alt="fdew">
                            </div>
                            <div class="contact-item__name-container">
                                <p class="contact-item__name">${element.name}</p>
                                <p class="contact-item__phone">${element.phone}</p>
                            </div>
                        </li>`)
    })

    callback(saveButtonHandler, localstorageData); //After contact items were rendered, set hendlers on each of them
}

//Function below set handlers on contact items to open contact editor
function contactItemHendler(callback, data) {
    const contactItemsCollection = contactList.querySelectorAll('li');

    contactItemsCollection.forEach((contact) => {
        contact.addEventListener('click', () => {
            editorSection.classList.add('editor--shown');

            //Write values from a Local Storage data into editor inputs
            editorNameString.textContent = data[contact.id].name;
            editorPhoneInput.value = data[contact.id].phone;
            editorEmailInput.value = data[contact.id].email;
            editorCompanyInput.value = data[contact.id].company.name;
            editorWebsiteInput.value = data[contact.id].website;

            callback(contact.id, data); //Here we call a function that going to be provided in params to set handlers on "Save" button
        })
    })
}

//Function below set a handler on "Save" button that refresh a Local Storage data and launch contact list render
function saveButtonHandler(id, data) {
    editorSaveButton.addEventListener("click", () => {

        data[id].phone = editorPhoneInput.value;
        data[id].email = editorEmailInput.value;
        data[id].company.name = editorCompanyInput.value;
        data[id].website = editorWebsiteInput.value;

        localStorage.setItem("contacts", JSON.stringify(data)); //Re-write Local Storage with new values

        contactList.innerHTML = ""; //Clear contact list to re-write it with new values
        editorSection.classList.remove('editor--shown'); //And hide editor section
        setContactList(contactItemHendler);
    }, { once: true })
}

setContactList(contactItemHendler);

//Set a handler on "Close" button
editorCloseButton.addEventListener('click', () => {
    editorSection.classList.remove('editor--shown');
})




