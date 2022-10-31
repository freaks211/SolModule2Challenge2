// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        116,  30, 102, 195, 189,  52, 232, 255, 232, 168, 147,
        223, 254, 157,  78, 122,  68,  33, 140, 145, 162,  33,
         57,  38,   9, 222, 246,  39,  59, 171,  87,  92, 200,
        226, 252,  35,  40, 170, 229, 231, 175, 179, 108, 250,
        197, 222, 191, 152,  92, 233,  62,  38, 215, 105,  17,
         27, 167, 243, 214, 128,  61, 124,  48, 242
      ]            
);
var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
//console.log(from.publicKey);
const to = Keypair.generate();
//console.log(to);

const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        //console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        //const myWallet = await Keypair.fromSecretKey(privateKey);
        const SendingWalletBalance = await connection.getBalance(
            new PublicKey(from.publicKey)
        );

        const ReceivingWalletBalance = await connection.getBalance(
            new PublicKey(to.publicKey)
        );
        console.log(`Sending Wallet balance: ${parseInt(SendingWalletBalance) / LAMPORTS_PER_SOL} SOL`);
        console.log(`Receiving Wallet balance: ${parseInt(ReceivingWalletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async () => {
    try {
        // Connect to the Devnet and make a wallet from privateKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        //const myWallet = await Keypair.fromSecretKey(privateKey);

        // Request airdrop of 2 SOL to the wallet
        console.log("Airdropping some SOL to my wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(from.publicKey),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
   // const newPair = Keypair.generate();
    //console.log(newPair);
    // Get Keypair from Secret Key
    console.log("Transferring SOL ");
    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

   const TransferAmount = await connection.getBalance(
    new PublicKey(from.publicKey)
    );
    //console.log(`Sending Wallet balance: ${parseInt(TransferAmount) / LAMPORTS_PER_SOL} SOL`);
    
    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: TransferAmount * 0.5,
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);
    
}

const mainFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
    await transferSol();
    await getWalletBalance();

}

mainFunction();

