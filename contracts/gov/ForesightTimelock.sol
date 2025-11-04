// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/// @title ForesightTimelock
/// @author Foresight
/// @notice This contract acts as a time-based controller for executing governance proposals.
/// @dev It enforces a mandatory delay between the time a proposal is approved by the governor and when it can be executed.
/// This delay provides a window for users to react to potentially malicious or unwanted proposals.
/// The governor is the only entity that can propose transactions to this timelock.
/// Any address can execute a transaction once the time delay has passed.
contract ForesightTimelock is TimelockController {
    /// @notice Contract constructor.
    /// @param minDelay The minimum delay in seconds between a proposal's approval and its execution.
    /// @param proposers An array of addresses that are allowed to submit proposals to this timelock. Typically, this will only be the ForesightGovernor contract.
    /// @param executors An array of addresses that are allowed to execute proposals after the delay has passed. A zero address means anyone can execute.
    /// @param admin The address that will have administrative control over this timelock. A zero address will set the timelock itself as the admin.
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}