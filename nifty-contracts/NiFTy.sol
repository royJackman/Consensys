// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NiFTy is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(string => bool) private colorCombinations;

    constructor() ERC721("NiFTy", "NFTY") {}

    function mint(
        address recipient,
        string memory colorTL,
        string memory colorTR,
        string memory colorBL,
        string memory colorBR
    ) public {
        string memory colorCombination = string.concat(
            colorTL, colorTR, colorBL, colorBR
        );

        require(
            !colorCombinations[colorCombination],
            "Someone else found this combination before you!"
        );

        colorCombinations[colorCombination] = true;

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(recipient, tokenId);
    }
}