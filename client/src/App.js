import React, { useCallback, useEffect, useState } from 'react';
import useSetupWeb3 from './hooks/useSetupWeb3';
import './App.css';

const App = () => {
  const [tokensCount, setTokensCount] = useState(0);
  const [userNftArray, setUserNftArray] = useState([]);

  const { web3, accounts, networkId, gameItemInstance, isLoaded } = useSetupWeb3();

  const updateTokensCount = useCallback(async () => {
    const totalTokens = await gameItemInstance.methods.currentSupply().call();
    setTokensCount(totalTokens);
  }, [gameItemInstance]);

  const getNftUrlArray = useCallback(async () => {
    if (!tokensCount || !accounts.length) {
      return;
    }

    const nftArr = [];

    for (let i = 1; i <= tokensCount; i++) {
      const bal = await gameItemInstance.methods.balanceOf(accounts[0]).call();
      if (bal > 0) {
        const fetchedData = await gameItemInstance.methods.tokenURI(i).call();
        nftArr.push({ id: i, url: fetchedData.replace('{id}', i) });
      }
    }

    const nftWithMetaData = await Promise.all(
      nftArr.map(({ url }) => fetch(url).then((res) => res.json()))
    );

    const nftWithMetaDataAndId = nftWithMetaData.map((nft, index) => ({
      ...nftArr[index],
      ...nft,
    }));

    setUserNftArray(nftWithMetaDataAndId);
  }, [accounts, gameItemInstance, tokensCount]);

  useEffect(() => {
    if (isLoaded) {
      updateTokensCount();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (tokensCount) {
      getNftUrlArray();
    }
  }, [tokensCount]);

  if (!isLoaded) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>React.js NFT Viewer</h1>
      <p>
        This is a demo of a React.js NFT viewer. It shows the necessary information to display NFTs.
      </p>
      <p>The NFTs are managed by the "GameItem" smart contract.</p>
      <p>
        Total tokens: <code>{tokensCount}</code>
      </p>
      <div>
        <h2>Your NFTs</h2>
        <ul>
          {userNftArray.map((nft) => (
            <li key={nft.id} className="nftBox">
              <img src={nft.image} alt={nft.name} />
              <p>
                <strong>{nft.name}</strong>
              </p>
              <p>{nft.description}</p>
              <a href={nft.url} target="_blank" rel="noopener noreferrer">
                {nft.url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
