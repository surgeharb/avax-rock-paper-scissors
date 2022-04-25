const Storage = artifacts.require('Storage');
const GameItem = artifacts.require('GameItem');
const SurgeToken = artifacts.require('SurgeToken');

module.exports = async function (deployer) {
  await deployer.deploy(Storage);
  await deployer.deploy(GameItem);
  await deployer.deploy(SurgeToken, 'ThreeCollections');
};
