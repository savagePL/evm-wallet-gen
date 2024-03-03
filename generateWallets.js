const readline = require('readline');
const ethers = require('ethers');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function generateWallets() {
    rl.question('Enter the number of wallets to generate: ', (numWallets) => {
        if (isNaN(numWallets) || parseInt(numWallets) <= 0) {
            console.log('Number of wallets must be a positive integer');
            generateWallets();
            return;
        }

        numWallets = parseInt(numWallets);

        const wallets = [];
        for (let i = 0; i < numWallets; i++) {
            wallets.push(ethers.Wallet.createRandom());
        }

        rl.question('Do you want to output the wallets to console? (yes/no): ', (answer) => {
            if (answer.toLowerCase() === 'yes') {
                wallets.forEach((wallet, index) => {
                    const address = wallet.address;
                    const mnemonic = wallet.mnemonic.phrase;
                    const publicKey = wallet.publicKey;
                    console.log(`${index + 1}.\nAddress: ${address}\nMnemonic Phrase: ${mnemonic}\nPublic Key: ${publicKey}\n\n`);
                });
            }

            let filename = 'wallets.txt';
            let fileIndex = 1;
            while (fs.existsSync(filename)) {
                filename = `wallets_${fileIndex}.txt`;
                fileIndex++;
            }

            fs.writeFileSync(filename, '');
            wallets.forEach((wallet, index) => {
                const address = wallet.address;
                const mnemonic = wallet.mnemonic.phrase;
                const publicKey = wallet.publicKey;
                const data = `${index + 1}.\nAddress: ${address}\nMnemonic Phrase: ${mnemonic}\nPublic Key: ${publicKey}\n\n`;
                fs.appendFileSync(filename, data);
            });

            console.log(`Wallets successfully generated and saved to ${filename}`);
            rl.close();
        });
    });
}

generateWallets();
