const userName = document.querySelector('.contacts__name');
const userNameContainer = document.querySelector('.contacts__name-container');

//Add handler on click for user name to make it editable
userName.addEventListener('click', function () {
    let userNameValue = userName.textContent;
    userName.setAttribute('style', 'display: none;'); //Hide user name 'p' tag

    //Create new input
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.classList.add('contacts__name-edit-input')
    newInput.value = userNameValue;
    userNameContainer.appendChild(newInput); // Render Input into name container
    newInput.focus();

    //Set new handler on "Enter" button to accept changes when it done
    window.addEventListener('keydown', function (e) {
        if (e.code == "Enter") {
            e.preventDefault();
            userNameValue = newInput.value;
            newInput.remove();

            userName.textContent = userNameValue;
            userName.removeAttribute('style', 'display: none;');
        }
    })
})
