// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SurgeToken is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {
    string public name;
    uint256 internal tokensCount;

    uint256 public constant Rock = 1;
    uint256 public constant Paper = 2;
    uint256 public constant Scissors = 3;

    uint256[] public tokenIds = [Rock, Paper, Scissors];
    uint256[] public tokenValues = [1, 1, 1];

    constructor(string memory _name) ERC1155("https://bafybeieqpk6ewyiignsjoqj5h5wnkslddsj2r2ukts5l2kv3jimkol2xlu.ipfs.nftstorage.link/{id}.json") {
        name = _name;
        tokensCount = 0;

        mintBatch(msg.sender,
            tokenIds,
            tokenValues,
            ""
        );
    }

    function getTokensCount() public view returns (uint256) {
        return tokensCount;
    }

    function uri(uint256 _tokenid) override public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "https://bafybeieqpk6ewyiignsjoqj5h5wnkslddsj2r2ukts5l2kv3jimkol2xlu.ipfs.nftstorage.link/",
                Strings.toString(_tokenid),".json"
            )
        );
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
        tokensCount++;
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
        tokensCount += ids.length;
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
