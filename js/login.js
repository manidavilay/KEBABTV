document.addEventListener('DOMContentLoaded', () => {

    // Déclarations

    const apiUrl = 'https://kebabtv.dwsapp.io';
    const loginForm = document.querySelector('#loginForm');
    const loginEmail = document.querySelector('[name="loginEmail"]');
    const loginPassword = document.querySelector('[name="loginPassword"]');

    // Fonctions

    const login = (formData) => {

        loginForm.addEventListener('submit', event => {
            event.preventDefault();

            new FETCHrequest(
                    `${apiUrl}/api/login`,
                    'POST', {
                        email: loginEmail.value,
                        password: loginPassword.value
                    }
                )

                .sendRequest()
                .then(jsonData => {
                    localStorage.setItem('user-token', jsonData.data.token);
                    // document.location.href="index.html";
                })
            me()
        })

    };

    const me = () => {

        new FETCHrequest(
                `${apiUrl}/api/me`,
                'POST', {
                    token: localStorage.getItem('user-token')
                }
            )

            .sendRequest()
            .then(jsonData => console.log(jsonData))
            .catch(jsonError => console.log(jsonError))
    };

    // Lancer la fonction
    login();
});