// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NiFTyLoan is IERC721Receiver {
    struct Loan {
        address borrower;
        address nftContract;
        uint256 tokenId;
        uint256 loanAmount;
        uint256 startTime;
        uint256 dueTime;
        bool repaid;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCounter;
    uint256 public interestRate;

    event LoanIssued(uint256 loanId, address borrower, uint256 loanAmount, uint256 dueTime);
    event LoanRepaid(uint256 loadId);

    constructor(uint256 _interestRate) {
        interestRate = _interestRate;
    }

    function takeOutLoan(address _nftContract, uint256 _tokenId, uint256 _loanAmount, uint256 _duration) external {
        require(_loanAmount > 0, "Loan amount must be greater than 0");
        require(_duration > 0, "Loan duration must be greater than 0");

        IERC721 nftContract = IERC721(_nftContract);
        require(nftContract.ownerOf(_tokenId) == msg.sender, "You do not own this NFT, you cannot loan it");

        nftContract.safeTransferFrom(msg.sender, address(this), _tokenId);

        uint256 dueTime = block.timestamp + _duration;
        loans[loanCounter] = Loan(
            msg.sender,
            _nftContract,
            _tokenId,
            _loanAmount,
            block.timestamp,
            dueTime,
            false
        );

        emit LoanIssued(loanCounter, msg.sender, _loanAmount, dueTime);

        loanCounter++;

        (bool success, ) = msg.sender.call{value: _loanAmount}("");
        require(success, "Transfer failed");
    }

    function repayLoan(uint256 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(loan.borrower == msg.sender, "This loan does not belong to you");
        require(!loan.repaid, "This loan has already been paid");

        uint256 loanAmount = loan.loanAmount;
        uint256 timePassed = block.timestamp - loan.startTime;
        uint256 interest = (loanAmount * interest * timePassed) / (100 * 365 * 24 * 60 * 60);
        uint256 totalRepayment = loanAmount + interest;

        require(msg.value >= totalRepayment, "Insufficient funds");

        loan.repaid = true;
        IERC721 nftContract = IERC721(loan.nftContract);
        nftContract.safeTransferFrom(address(this), msg.sender, loan.tokenId);

        emit LoanRepaid(_loadId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}