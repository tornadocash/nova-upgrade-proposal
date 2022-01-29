// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import { GovernanceGasUpgrade } from "tornado-governance/contracts/v2-vault-and-gas/gas/GovernanceGasUpgrade.sol";

contract MockGovernance is GovernanceGasUpgrade {
    constructor(address gasCompLogic, address userVaultAddress) public GovernanceGasUpgrade(gasCompLogic, userVaultAddress) {}
}
