import { ethers } from "hardhat";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
    const.contractAddress = process.env.CONTRACT_ADDRESS;

    if (!contractAddress) {
        throw new Error("ERROR: Tidak ada CONTRACT_ADDRESS di .env")
    }
    
    const newMessage = "Rizki Ramadani - 241011400098";
    console.log(`Menghubungkan ke contract di: ${contractAddress}...`);
    // attach ke contract
    const simpleStorage = await ethers.getContractAt("SimpleStorage", contractAddress);
    // read Message lama
    const currentMessage = await simpleStorage.getMessage();
    console.log('Pesan Lama: "${currentMessage}"');
    
    // write Message baru
    console.log('Mengubah Pesan Menjadi: "${newMessage}"...');
    const tx = await simpleStorage.setMessage(newMessage);

    // tunggu transaksi selesai
    console.log("Menunggu Konfirmasi Blok...");
    await tx.wait();

    const updateMessage = await simpleStorage.getMessage();
    console.log('SUCCESSFUL! Pesan Saat Ini: "${updatedMessage}"');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});