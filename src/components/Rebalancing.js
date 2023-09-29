export default function Rebalancing() {
    return (
        <>
            <h4 className="text-small font-semibold leading-none text-default-600">Rebalansering uten nye innskudd</h4>
            {
                doRebalance(accountTypes, investments).map(transaction => {
                    return transaction.toBuy === 0 ? "" : <li key={transaction.key}>{transaction.name}: {transaction.toBuy}</li>
                })
            }
        </>
    );
}