export function doRebalance(accountTypes, investments, investmentSum, minimumSumToInvest, canSell, closestToTarget) {
    const ret = []
    ret.push(accountTypes
        .map(type => calculateRebalance(type.name, investments, investmentSum, minimumSumToInvest, canSell, closestToTarget)
        ))

    return ret.flat().flat()
}

function calculateRebalance(investmentType, investments, investmentSum, minimumSumToInvest, canSell, closestToTarget) {
    const typeOfInvestment = investments.filter(investment => investment.type === investmentType)
    
    var totalValueForType = 0
    if (investmentSum === 0 || investmentSum === undefined || isNaN(investmentSum)) {
        totalValueForType = typeOfInvestment.reduce((sum, investment) => sum + investment.value, 0);
    } else {
        totalValueForType = typeOfInvestment.reduce((sum, investment) => sum + investment.value, 0) + investmentSum;
    }

    var investmentsToRebalance = typeOfInvestment.map(investment => findRebalancing(investment, totalValueForType, minimumSumToInvest, canSell))

    if(canSell) {
        return investmentsToRebalance
    }

    investmentsToRebalance = investmentsToRebalance.filter(elem => elem.buy > 0)
    const sorted = closestToTarget ? investmentsToRebalance.sort((a, b) => a['buy'] - b['buy']) : investmentsToRebalance.sort((a, b) => b['buy'] - a['buy'])
    const ret = filtrerElementer(sorted, investmentSum, investments, minimumSumToInvest, closestToTarget)

    return ret
}

function findRebalancing(investment, totalValueForType, minimumSumToInvest) {
    const percentageDiff = ((investment.percentage / 100) - ((investment.value / totalValueForType)).toFixed(2))
    var toBuy = 0

    toBuy = parseFloat((percentageDiff * totalValueForType).toFixed(0))
    const currMinimum = minimumSumToInvest === undefined || isNaN(minimumSumToInvest) ? 99 : minimumSumToInvest

    if (toBuy < currMinimum && toBuy > -currMinimum) {
        toBuy = 0
    }

    const key = investment.key

    if (parseFloat(investment.percentage) === 0) {
        return { key: key, name: investment.name, buy: -investment.value, newSum: 0 }
    }

    return { key: key, name: investment.name, buy: toBuy, newSum: toBuy + investment.value }
}

function filtrerElementer(liste, maksSum, investments, minimumSumToInvest) {
    return liste.reduce((akkumulator, element) => {
      const sum = akkumulator.reduce((total, e) => total + e.buy, 0);
      console.log(`${element.name} buy: ${element.buy} sum: ${sum}`)
      return sum + parseFloat(element.buy) <= maksSum ? [...akkumulator, element] : maksSum-sum >= minimumSumToInvest ? [...akkumulator, { key: element.key, name: element.name, buy: maksSum-sum, newSum: investments.filter(e => e.key === element.key)[0].value + maksSum-sum }] : akkumulator;
    }, []);
  }
