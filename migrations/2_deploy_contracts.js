const Storage = artifacts.require('Storage');
const SurgeToken = artifacts.require('SurgeToken');

module.exports = async function (deployer) {
  await deployer.deploy(Storage);
  await deployer.deploy(SurgeToken, 'ThreeCollections');
};
