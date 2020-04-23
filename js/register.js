document.addEventListener('DOMContentLoaded', ()=> {

    // Déclarations

    const apiUrl = 'https://kebabtv.dwsapp.io';
    const registerForm = document.querySelector('#registerForm');
    const userEmail = document.querySelector('[name="userEmail"]');
    const userPassword = document.querySelector('[name="userPassword"]');
    const userPseudo = document.querySelector('[name="userPseudo"]');

    // Fonctions

    const register = (formData) => {

        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();

            new FETCHrequest (
                `${apiUrl}/api/register`,
                'POST',
                {
                    email: userEmail.value,
                    password: userPassword.value,
                    pseudo: userPseudo.value
                }
            )

            .sendRequest()
            .then(jsonData => console.log(jsonData))
            .catch(jsonError => console.log(jsonError))
        })
    }

    // Lancer la fonction
    register();
});