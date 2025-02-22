function getDailyChallengeFromApi(){
    const url = `${apiUrl}/zenith/daily`

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
}

function submitDailyChallenge(){
    const url = `${apiUrl}/zenith/daily/submit`

    return fetch(url, {
            method: 'POST',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
}

function login(){
    let x = `https://discord.com/oauth2/authorize?client_id=1332751405374505154&response_type=code&redirect_uri=${encodeURIComponent(apiUrl+"/auth/discord")}&scope=identify&state=${encodeURIComponent(baseUrl)}`;

    let a = encodeURIComponent(x);

    window.location.assign(x)
}