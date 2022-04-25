import { useState, useEffect } from 'react';
import GameItemContract from '../contracts/GameItem.json';
import SurgeTokenContract from '../contracts/SurgeToken.json';
import getWeb3 from '../getWeb3';

const useSetupWeb3 = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [networkId, setNetworkId] = useState(null);
  const [gameItemInstance, setGameItemInstance] = useState(null);
  const [surgeTokenInstance, setSurgeTokenInstance] = useState(null);

  useEffect(() => {
    const init = async () => {
      const self = {
        web3: await getWeb3(),
      };

      self.accounts = await self.web3.eth.getAccounts();
      self.networkId = await self.web3.eth.net.getId();

      setWeb3(self.web3);
      setAccounts(self.accounts);
      setNetworkId(self.networkId);

      setSurgeTokenInstance(
        new self.web3.eth.Contract(
          SurgeTokenContract.abi,
          SurgeTokenContract.networks[self.networkId] &&
            SurgeTokenContract.networks[self.networkId].address
        )
      );
      setGameItemInstance(
        new self.web3.eth.Contract(
          GameItemContract.abi,
          GameItemContract.networks[self.networkId] &&
            GameItemContract.networks[self.networkId].address
        )
      );
      setIsLoaded(true);
    };
    init();
  }, []);

  return {
    web3,
    accounts,
    networkId,
    surgeTokenInstance,
    gameItemInstance,
    isLoaded,
  };
};

export default useSetupWeb3;
