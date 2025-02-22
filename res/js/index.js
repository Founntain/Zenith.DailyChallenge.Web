currentDate = document.getElementById("currentDate")
currentDate.innerHTML = formatDate(new Date())
let username = getCookieByName("username")

let loginBtn = document.getElementById("login")

if(username == null && loginBtn != null){
    let usernameText = document.getElementById("username")

    loginBtn.classList.remove("hidden")
    usernameText.classList.add("hidden")
}

if(loginBtn != null){
    loginBtn.addEventListener("click", function(event){
        event.preventDefault()

        login()
    })
}


function playBackgroundMusic(){
    const bgAudio = new Audio("res/audio/short_piano.wav")

    bgAudio.volume = 0.5;
    bgAudio.loop = true;

    bgAudio.play();
}

function startCountdown() {
    const now = new Date();

    const tomorrowStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

    // Function to update the timer
    function updateTimer() {
      const currentTime = new Date().getTime();
      const timeLeft = tomorrowStart - currentTime;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        return;
      }

      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

      document.getElementById("timeLeft").innerText = formattedTime;
    }

    const timerInterval = setInterval(updateTimer, 1000);

    updateTimer();
  }

startCountdown();
playBackgroundMusic()

let dailyChallengeResult = getDailyChallengeFromApi()

dailyChallengeResult.then(data => {
    data.forEach(challenge => {
        let mainContainer = document.getElementById( 'mainContainer')
        let lineBreak = document.createElement('br')

        let container = document.createElement("div")

        container.classList.add("zenithContainer")

        switch (challenge.points){
            case 1:
                container.classList.add("easyMode")
                break;
            case 2:
                container.classList.add("easyMode")
                break;
            case 3:
                container.classList.add("normalMode")
                break;
            case 5:
                container.classList.add("reversedMode")
                break;
            case 8:
                container.classList.add("reversedMode")
                break;
        }

        let container2 = document.createElement("div")

        for(let i = 0; i < challenge.conditions.length; i++){
            let condition = challenge.conditions[i]

            let conditionPreText = document.createElement( "a")
            let conditionText = document.createElement( 'a')

            conditionPreText.classList.add( 'subText')
            conditionText.classList.add( 'conditionValue')

            let preText =  ''
            let text =  ''

            if(i > 0){
                preText =  '<br>and ';
            }

            switch (condition.type){
                case 0:
                    preText +=  'reach '
                    text += `${condition.value}M `
                    break;
                case 1:
                    preText +=  'get at least '
                    if(condition.value > 1)
                        text += `${condition.value} KO's `
                    else
                        text += `${condition.value} KO `
                    break;
                case 2:
                    preText +=  'do at least '
                    if(condition.value > 1)
                        text += `${condition.value} QUADS `
                    else
                        text += `${condition.value} QUAD `
                    break;
                case 3:
                    preText +=  'do at least '
                    if(condition.value > 1)
                        text += `${condition.value} SPINS `
                    else
                        text += `${condition.value} SPIN `
                    break;
                case 4:
                    preText +=  'do at least '

                    if(condition.value > 1)
                        text += `${condition.value} ALL CLEARS `
                    else
                        text += `${condition.value} ALL CLEAR `
                    break;
            }

            conditionText.innerHTML = text
            conditionPreText.innerHTML = preText

            container2.appendChild(conditionPreText)
            container2.appendChild(conditionText)
        }

        if(challenge.mods.length > 0){
            let modsPreText = document.createElement( 'a')
            modsPreText.classList.add( 'subText')
            modsPreText.innerHTML = "with the following mods"

            container2.appendChild(lineBreak)
            container2.appendChild(modsPreText)

            let modsContainer = document.createElement( 'div')

            modsContainer.classList.add('modsContainer')

            let mods = challenge.mods.split(' ')

            mods.forEach(mod => {
                const img = document.createElement('img');
                img.src = `${imgUrl}${mod}.png`;

                modsContainer.appendChild(img);
            })

            container2.appendChild(modsContainer)
        }

        let pointText = document.createElement('div')
        pointText.classList.add('subText')

        pointText.innerHTML = '<br>' + (challenge.points > 1 ? 'FOR ' + challenge.points + ' POINTS' : 'FOR ' + challenge.points + ' POINT')

        container2.appendChild(pointText)

        container.appendChild(container2)
        mainContainer.appendChild(container)
    })


})
.catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
});