export const gasPrices = (chainId: number) => {
    const Auth = Buffer.from(
        process.env.NEXT_PUBLIC_INFURA_API + ":" + process.env.NEXT_PUBLIC_INFURA_SECRET,
        "base64"
    );
    return fetch(
        `https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`,
        {
            method: "GET",
            headers: {
                Authorization: "Basic " + Auth,
            },
        }
    )
};