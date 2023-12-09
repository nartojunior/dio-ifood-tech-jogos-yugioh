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

    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore()
    await drawButton(duelResults)
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text) { 
    state.actions.button.innerText = text
    state.actions.button.style.display = "block"
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate"
    let playerCard = cardData[playerCardId]

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "Ganhou"
        state.score.playerScore++;
    }

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "Perdeu"
        state.score.computerScore++;
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

function init() {
    drawCards(5, state.playerSides.player1)
    drawCards(5, state.playerSides.computer)
}

init()
