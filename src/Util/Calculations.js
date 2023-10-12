export function doRebalance(accountTypes, investments, investmentSum, minimumSumToInvest, canSell) {
    const ret = []
    ret.push(accountTypes
        .map(type => calculateRebalance(type.name, investments, investmentSum, minimumSumToInvest, canSell)
        ))

    return ret.flat().flat()
}

function calculateRebalance(investmentType, investments, investmentSum, minimumSumToInvest, canSell) {
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

    investmentsToRebalance = investmentsToRebalance.filter(elem => elem.toBuy > 0)
    console.log(investmentsToRebalance)
    const ret = filtrerElementer(investmentsToRebalance.sort((a, b) => b['toBuy'] - a['toBuy']), investmentSum, investments, minimumSumToInvest)
    console.log(ret)
    return ret
}

function findRebalancing(investment, totalValueForType, minimumSumToInvest) {
    const percentageDiff = ((investment.percentage / 100) - ((investment.value / totalValueForType)).toFixed(2))
    var toBuy = 0

    toBuy = parseFloat((percentageDiff * totalValueForType).toFixed(0))
    const currMinimum = minimumSumToInvest === undefined || isNaN(minimumSumToInvest) ? 99 : minimumSumToInvest
    console.log(currMinimum)
    if (toBuy < currMinimum && toBuy > -currMinimum) {
        toBuy = 0
    }

    const key = investment.key

    if (parseFloat(investment.percentage) === 0) {
        return { key: key, name: investment.name, toBuy: -investment.value, newSum: 0 }
    }

    return { key: key, name: investment.name, toBuy: toBuy, newSum: toBuy + investment.value }
}

function filtrerElementer(liste, maksSum, investments, minimumSumToInvest) {
    return liste.reduce((akkumulator, element) => {
      const sum = akkumulator.reduce((total, e) => total + e.toBuy, 0);
      return sum + parseFloat(element.toBuy) <= maksSum ? [...akkumulator, element] : maksSum-sum >= minimumSumToInvest ? [...akkumulator, { key: element.key, name: element.name, toBuy: maksSum-sum, newSum: investments.filter(e => e.key === element.key)[0].value + maksSum-sum }] : akkumulator;
    }, []);
  }
