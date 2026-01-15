import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!contractAddress) {
        throw new Error("ERROR: Tidak ada CONTRACT_ADDRESS di .env");
    }
    
    // Ganti dengan data kamu
    const newMessage = "Rizki Ramadani - 241011400098"; 

    console.log(`Menghubungkan ke contract di: ${contractAddress}...`);
    
    // 1. Get Contract
    const simpleStorage = await hre.viem.getContractAt(
        "SimpleStorage", 
        contractAddress as `0x${string}`
    );
    
    // 2. READ Message
    const currentMessage = await simpleStorage.read.getMessage();
    console.log(`Pesan Lama: "${currentMessage}"`);
    
    // 3. WRITE Message
    console.log(`Mengubah Pesan Menjadi: "${newMessage}"...`);
    const hash = await simpleStorage.write.setMessage([newMessage]);

    console.log(`Transaksi dikirim! Hash: ${hash}`);
    console.log("Menunggu Konfirmasi Blok...");

    // 4. Wait Transaction
    const publicClient = await hre.viem.getPublicClient();
    await publicClient.waitForTransactionReceipt({ hash });

    // 5. Verify
    const updatedMessage = await simpleStorage.read.getMessage();
    console.log(`SUCCESSFUL! Pesan Saat Ini: "${updatedMessage}"`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});