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
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    actions: {
        button: document.getElementById("next-duel")
    }
}

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
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

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", "./assets/icons/card-back.png")
    cardImage.setAttribute("data-id", idCard)
    cardImage.classList.add("card")

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })
    }

    cardImage.addEventListener("mouseover", () => {
        drawSelectCard(idCard)
    })

    return cardImage
}

async function drawSelectCard(index){
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
    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)
}

init()
