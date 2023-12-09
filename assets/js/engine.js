/** Motor do Jogo: Yu-Gi-Oh! Jo-ken-po Edition */

const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points")
    },
    cardSprite: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-cards"),
        computer: document.getElementById("computer-field-cards")
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel")
    },
    audios: {
        win: "win.wav",
        lose: "lose.wav",
        background: "egyptian_duel.mp3"
    }
}

const cardPath = "./assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${cardPath}dragon.png`,
        winOf: [1],
        loseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${cardPath}magician.png`,
        winOf: [2],
        loseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${cardPath}exodia.png`,
        winOf: [0],
        loseOf: [1]
    }
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id

}

async function createCardImage(cardId, fieldSide) {
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", "./assets/icons/card-back.png")
    cardImage.setAttribute("data-id", cardId)
    cardImage.classList.add("card")

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(cardId)
        })

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })
    }

    return cardImage
}

async function setCardsField(cardId) {
    await removeAllCardsImage()

    let computerCardId = await getRandomCardId()

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

    showSelectedCardsInField(cardData[cardId].img, cardData[computerCardId].img)

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore()
    await drawButton(duelResults)
}

async function showSelectedCardsInField(playerCardImg, computerCardImg) {
    state.fieldCards.player.src = playerCardImg
    state.fieldCards.computer.src = computerCardImg
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text) {
    state.actions.button.innerText = text
    state.actions.button.style.display = "block"
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw"
    let playerCard = cardData[playerCardId]

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "Win"
        state.score.playerScore++;
        await playAudio(state.audios.win)
    }

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "Lose"
        state.score.computerScore++;
        await playAudio(state.audios.lose)
    }

    return duelResults
}

async function removeAllCardsImage() {
    let { computerBox, player1Box, } = state.playerSides

    let imgElements = computerBox.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    imgElements = player1Box.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

async function drawSelectCard(index) {
    state.cardSprite.avatar.src = cardData[index].img
    state.cardSprite.name.innerText = cardData[index].name
    state.cardSprite.type.innerText = "Attribute : " + cardData[index].type
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel() {
    state.cardSprite.avatar.src = `${cardPath}card-front.png`
    state.actions.button.style.display = "none";

    state.fieldCards.player.src = `${cardPath}card-front.png`
    state.fieldCards.computer.src = `${cardPath}card-front.png`

    await hiddenCardDetails()

    init()
}

async function hiddenCardDetails() {
    state.cardSprite.name.innerText = "Selecione"
    state.cardSprite.type.innerText = "uma carta"
}

async function playAudio(duelStatus) {
    const audio = new Audio(`./assets/audios/${duelStatus}`)
    audio.play()
}

async function initDrawCards() {
    drawCards(5, state.playerSides.player1)
    drawCards(5, state.playerSides.computer)
}

/** É preciso ter interação do usuário antes de tocar qualquer áudio. */
/** Usando no botão de iniciar o jogo */
function initGame(obj){
    obj.style.display = "none"
    init()
}

async function init() {
    drawCards(5, state.playerSides.player1)
    drawCards(5, state.playerSides.computer)

    const engineBGM = document.getElementById("bgm")
    engineBGM.volume = 0.4
    engineBGM.play()   
}
