const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
async function main() {
    let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const cryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(cryptedJson, process.env.PRIVATE_KEY_PASSWORD);
    wallet = await wallet.connect(provider);
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy(); //stop HERE! wait for contract to deploy!
    await contract.deployTransaction.wait(1);
    const currentFavouriteNumber = await contract.retrieve();
    console.log(`Current favourite number: ${currentFavouriteNumber.toString()}`);
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const updatedFavouriteNumber = await contract.retrieve();
    console.log(`Updated favourite number: ${updatedFavouriteNumber.toString()}`);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });