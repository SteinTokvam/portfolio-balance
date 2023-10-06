export function doRebalance(accountTypes, investments, investmentSum) {
    const ret = []
    ret.push(accountTypes
        .map(type => {
            const ret = calculateRebalance(type, investments, investmentSum)
            return ret
        }))

    return ret.flat().flat()
}

function calculateRebalance(investmentType, investments, investmentSum) {
    const typeOfInvestment = investments.filter(investment => investment.type === investmentType.name)
    const totalValueForType = typeOfInvestment.reduce((sum, investment) => sum + investment.value, 0);

    //(målprosent-nåværende prosent) * totalValueForType = mengde å kjøpe/selge

    return typeOfInvestment.map(investment => {
        const percentageDiff = ((investment.percentage / 100) - ((investment.value / totalValueForType)).toFixed(2))
        var toBuy = (percentageDiff * totalValueForType).toFixed(0)

        if (toBuy < 99 && toBuy > -99) {
            //console.log("fjerner " + toBuy + " fra investering " + investment.name)
            toBuy = 0
        }
        const key = investment.key

        if (parseInt(investment.percentage) === 0) {
            return { key: key, name: investment.name, toBuy: -investment.value }
        }

        return { key: key, name: investment.name, toBuy: toBuy }
    })
}