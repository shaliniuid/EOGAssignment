import { SubscriptionClient } from "subscriptions-transport-ws";
import { createClient, defaultExchanges, subscriptionExchange } from "urql";

const subscriptionClient = new SubscriptionClient(
    `ws://react.eogresources.com/graphql`,
    {
        reconnect: true,
    }
)

const client = createClient({
    url: `https://react.eogresources.com/graphql`,
    exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
            forwardSubscription: (operation) => subscriptionClient.request(operation)
        })
    ]
})


export default client