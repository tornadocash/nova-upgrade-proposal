// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "@openzeppelin/contracts/utils/Address.sol";

contract TestExecutor {
    event ProposalExecuted(address indexed target);

    function execute(address target) public payable virtual {
        require(Address.isContract(target), "Governance::execute: not a contract");
        (bool success, bytes memory data) = target.delegatecall(abi.encodeWithSignature("executeProposal()"));
        if (!success) {
            if (data.length > 0) {
                revert(string(data));
            } else {
                revert("Proposal execution failed");
            }
        }

        emit ProposalExecuted(target);
    }
}
