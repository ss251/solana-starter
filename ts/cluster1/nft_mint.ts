import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../turbin3-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://hardworking-green-reel.solana-devnet.quiknode.pro/2dddcb231c28a8539837391292d181c1219c201b";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);
const uri = "https://gateway.irys.xyz/4MnXCQbpVN4r7PpWydgNaW5csz6VZuB8RAKMfdTxkvLo";

(async () => {
    let tx = createNft(umi, {
        mint,
        name: "Berg Rug",
        symbol: "BRUG",
        uri,
        sellerFeeBasisPoints: percentAmount( 5)
    })
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();