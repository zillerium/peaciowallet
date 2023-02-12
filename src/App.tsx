//import 'bootstrap/dist/css/bootstrap.min.css';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Button, Container, Row, Col} from 'react-bootstrap';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';
require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
     const { connection } = useConnection();
console.log("connecton == ", connection);
     const  {publicKey}  = useWallet();
     const [balance, setBalance] = useState(0);
     const fetchBalance = async () => {
console.log("publicKey ----", publicKey);
           //const publicKey1 = new PublicKey(publicKey.publicKey);
          if (publicKey) {
             const balance1 = await connection.getBalance(publicKey);
//console.log("publicKey1 ----", publicKey1);
           const lamportBalance=(balance1/LAMPORTS_PER_SOL);
           setBalance(lamportBalance);
             setBalance(lamportBalance);
             console.log("balance == "+ balance1);
} else {
    setBalance(0);
} 
         //  setBalance(balance1);
      };

    useEffect(() => {
        fetchBalance();
    }, [connection, publicKey]);
     const handleShowBalance = async () => {
       if (!connection) {
         return;
       }
     //  const wallet=useWallet()
//       const SOLANA_HOST = clusterApiUrl("devnet");
  //     let lamportBalance;
    //   if (wallet?.publicKey) {
         //  const balance = await connection.getBalance(wallet.publicKey);
        //   lamportBalance=(balance/LAMPORTS_PER_SOL);
        //   setBalance(lamportBalance);
    //   }
    
     };
            //<WalletMultiButton />

    return (
        <div >
            <Container>
               <Row>
                   <h1 className="text-light"> Connect to a Wallet</h1>
               </Row>
               <Row>
                   <Col xs={6}>
                       <WalletMultiButton />
                   </Col>
               </Row>
               <Row>
                   <Col xs={6}>
                       <Button variant="primary" onClick={handleShowBalance}>Show Wallet Sol Balance</Button>
                   </Col>
               </Row>
               <Row>
                   <p className="text-light">{balance != null ? `balance: ${balance}`: 'connecting ...'}</p>
                   <p className="text-light">{balance != null ? `Lamports Per Sol: ${LAMPORTS_PER_SOL}`: 'connecting ...'}</p>
               </Row>
            </Container>       
        </div>
    );
};
