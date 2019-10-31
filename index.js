const oneGatcha = 150 // marret at 1 gatcha
const dismentleEvenIfEpic = false // calc even if epic for skin
const dismentleDuplicate = true
const forAnime = true // Want to anime costume?
const loopN = 100000
const onedallor = 1170.97

/**
 * Anime costume percentage in gatcha (%)
 */
const animePercent = {
    earing: 1.9,
    hat: 1.6,
    glove: 1.7,
    shoes: 1.7,
    cape: 1.6,
    suit: 1.5
}
/**
 * Anime costume coin (roof)
 */
const animeSafety = {
    earing: 68,
    hat: 81,
    glove: 76,
    shoes: 76,
    cape: 81,
    suit: 86
}
/**
 * Epic non-animated costume percentage in gatcha (%)
 */
const epicPercent = {
    earing: 3,
    hat: 2.3,
    glove: 3,
    shoes: 2.5,
    cape: 2.2,
    suit: 2
}
/**
 * Epic non-animated costume coin (roof)
 */
const epicSafety = {
    earing: 43,
    hat: 56,
    glove: 43,
    shoes: 52,
    cape: 59,
    suit: 65
}
function logResult(i, result) {
    const won = Math.ceil(result.usedMarret/3450*30000)
    const dallor = Math.round((won / onedallor) * 100) / 100
    console.log(`[${i}] | ${won}원 | $${dallor} | ${result.usedMarret} Marret | ${result.coin} Coin | Log: ${result.log}`)
}
function buyall() {
    let log = ""
    let usedMarret = 0
    let coin = 0
    const progress = {
        earing: false,
        hat: false,
        glove: false,
        shoes: false,
        cape: false,
        suit: false
    }
    const otherEpicProgress = {
        earing: false,
        hat: false,
        glove: false,
        shoes: false,
        cape: false,
        suit: false
    }
    const logKey = {
        earing: "E",
        hat: "H",
        glove: "G",
        shoes: "F", // Feet
        cape: "C",
        suit: "S"
    }
    const pieces = ["earing", "hat", "glove", "shoes", "cape", "suit"]
    while (true) {
        // gatcha!
        let processed = false
        usedMarret += oneGatcha
        const rand = Math.random() * 100
        let rangeP = 0
        // 1. check anime
        for (const key of pieces) {
            const p = animePercent[key]
            const calcP = rand - rangeP
            if (calcP >= 0 && calcP < p) {
                // got anime
                processed = true
                if (!forAnime) {
                    log += "R"
                    if (dismentleEvenIfEpic || (otherEpicProgress[key] && dismentleDuplicate)) {
                        coin += 1
                    }
                    otherEpicProgress[key] = true
                } else {
                    log += logKey[key]
                    if (dismentleDuplicate && progress[key]) {
                        // add coin
                        coin += 1
                    } else if (!progress[key]) {
                        progress[key] = true
                    }
                }
                break
            }
            rangeP += p
        }
        // 2. check non anime
        for (const key of pieces) {
            if (processed) {
                break
            }
            const p = epicPercent[key]
            const calcP = rand - rangeP
            if (calcP >= 0 && calcP < p) {
                // got epic non-anime
                processed = true
                if (forAnime) {
                    log += "R"
                    if (dismentleEvenIfEpic || (otherEpicProgress[key] && dismentleDuplicate)) {
                        coin += 1
                    }
                    otherEpicProgress[key] = true
                } else {
                    log += logKey[key]
                    if (dismentleDuplicate && progress[key]) {
                        // add coin
                        coin += 1
                    } else if (!progress[key]) {
                        progress[key] = true
                    }
                }
                break
            }
            rangeP += p
        }
        if (!processed) {
            // rip. failed this gatcha
            log += "_"
            coin += 1
            processed = true
        }
        let needCoin = 0
        for (const key of pieces) {
            if (!progress[key]) {
                if (forAnime) {
                    needCoin += animeSafety[key]
                } else {
                    needCoin += epicSafety[key]
                }
            }
        }
        if (coin >= needCoin) {
            // We got all coin so break.
            break
        }
        if (progress.earing && progress.hat && progress.glove && progress.shoes && progress.cape && progress.suit) {
            // We got all costume so break.
            break
        }
    }
    return {
        usedMarret: usedMarret,
        coin: coin,
        log: log,
    }
}
let eX = 0n
const tests = []
const tellDuration = loopN / 10
for (let i = 0; i < loopN; i += 1) {
    if (i % tellDuration == 0) {
        console.log(`Progressing ${Math.floor(i/tellDuration) * 10}%`)
    }
    const simulated = buyall()
    eX += BigInt(simulated.usedMarret)
    tests.push(simulated)
}
tests.sort((a, b) => {
    return a.usedMarret - b.usedMarret
})
const sample = [0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99]
console.log(`===================================`)
console.log(`오차있음 너무믿진말것, maybe have a error so dont believe so much`)
console.log(`$1 = ${onedallor}won`)
console.log(`1 coin = ${oneGatcha} marret / anime epic costume : ${forAnime}`)
console.log(`[Dismentle] If other epic: ${dismentleEvenIfEpic} / If duplicated epic: ${dismentleDuplicate}`)
console.log(`Sample: ${loopN} samples`)
console.log(`[E] Earing [H] Hat [G] Glove [F] Shoes(Feet) [C] Cape [S] suite [R] Other Epic`)
console.log(`E(X): ${eX / BigInt(loopN)} marret.`)
console.log(`===================================`)
logResult("first", tests[0])
for (const pick of sample) {
    const index = Math.floor(tests.length * pick)
    logResult(`${pick*100}%`, tests[index])
}
logResult("last", tests[tests.length - 1])
console.log(`===================================`)