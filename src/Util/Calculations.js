export function doRebalance(accountTypes, investments, investmentSum) {
    const ret = []
    ret.push(accountTypes
        .map(type => calculateRebalance(type.name, investments, investmentSum)
        ))

    return ret.flat().flat()
}

function calculateRebalance(investmentType, investments, investmentSum) {
    const typeOfInvestment = investments.filter(investment => investment.type === investmentType)
    var totalValueForType = 0
    if(investmentSum === 0 || investmentSum === undefined || isNaN(investmentSum)) {
        totalValueForType = typeOfInvestment.reduce((sum, investment) => sum + investment.value, 0);
    } else {
        totalValueForType = typeOfInvestment.reduce((sum, investment) => sum + investment.value, 0) + investmentSum;
    }

    return typeOfInvestment.map(investment => {
        const percentageDiff = ((investment.percentage / 100) - ((investment.value / totalValueForType)).toFixed(2))
        var toBuy = parseInt((percentageDiff * totalValueForType).toFixed(0))

        if (toBuy < 99 && toBuy > -99) {
            toBuy = 0
        } 
        
        const key = investment.key

        if (parseInt(investment.percentage) === 0) {
            return { key: key, name: investment.name, toBuy: -investment.value, newSum: 0 }
        }

        return { key: key, name: investment.name, toBuy: toBuy, newSum: toBuy + investment.value }
    })
}