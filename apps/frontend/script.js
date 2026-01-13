// --- STATE MANAGEMENT ---
let currentAccount = null;
let currentChainId = null;

// --- DOM ELEMENTS ---
const connectBtn = document.getElementById('connect-btn');
const statusBadge = document.getElementById('connection-status');
const networkText = document.getElementById('network-name');
const addressText = document.getElementById('wallet-address');
const balanceText = document.getElementById('wallet-balance');

// --- CONSTANTS ---
const AVALANCHE_FUJI_ID = '0xa869'; // Chain ID untuk Fuji Testnet (Hex)

// --- UTILS (Task 4: Improvement) ---
const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Fungsi mengubah Hex Wei ke AVAX (Simple version tanpa library)
const formatBalance = (balanceHex) => {
    const balanceBigInt = BigInt(balanceHex);
    // Bagi dengan 1e18 untuk dapat ETH/AVAX, lalu ambil 4 desimal
    const balanceNum = Number(balanceBigInt) / 1e18; 
    return balanceNum.toFixed(4) + " AVAX";
};

// --- MAIN FUNCTIONS ---

// 1. Cek Network (Task 2)
function checkNetwork(chainId) {
    if (chainId === AVALANCHE_FUJI_ID) {
        networkText.innerText = "Avalanche Fuji";
        networkText.className = "net-valid";
    } else {
        networkText.innerText = "Wrong Network";
        networkText.className = "net-invalid";
    }
}

// 2. Ambil Balance
async function getBalance(account) {
    try {
        const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [account, 'latest']
        });
        balanceText.innerText = formatBalance(balance);
    } catch (error) {
        console.error("Gagal ambil balance:", error);
        balanceText.innerText = "Error";
    }
}

// 3. Handle Connection Success (Task 3)
async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnect
        statusBadge.innerText = "Disconnected";
        statusBadge.className = "badge disconnected";
        connectBtn.disabled = false;
        connectBtn.innerText = "Connect Core Wallet";
        addressText.innerText = "-";
        balanceText.innerText = "-";
        networkText.innerText = "-";
        currentAccount = null;
    } else {
        // User connect
        currentAccount = accounts[0];
        statusBadge.innerText = "Connected";
        statusBadge.className = "badge connected";
        
        // Task 4: Disable button & Shorten Address
        connectBtn.disabled = true;
        connectBtn.innerText = "Wallet Connected";
        addressText.innerText = shortenAddress(currentAccount); // Tampil pendek

        // Ambil data tambahan
        getBalance(currentAccount);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        checkNetwork(chainId);
    }
}

// 4. Connect Wallet Action (Task 1)
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            handleAccountsChanged(accounts);
        } catch (error) {
            console.error(error);
            alert("Koneksi dibatalkan user.");
        }
    } else {
        alert("Core Wallet tidak ditemukan!");
    }
}

// --- EVENT LISTENERS (Task 4) ---
if (typeof window.ethereum !== 'undefined') {
    // Listener: Jika user ganti akun di wallet
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Listener: Jika user ganti network di wallet
    window.ethereum.on('chainChanged', (chainId) => {
        // Refresh halaman direkomendasikan saat ganti chain, tapi kita update UI saja
        checkNetwork(chainId);
        if(currentAccount) getBalance(currentAccount);
    });
}

connectBtn.addEventListener('click', connectWallet);