// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IOracle.sol";

/// @title ManualOracle
/// @notice A simple oracle where a designated reporter can manually set the outcome.
contract ManualOracle is IOracle, AccessControl {
    bytes32 public constant REPORTER_ROLE = keccak256("REPORTER_ROLE");

    int256 private _outcome;
    bool private _isSet;

    event OutcomeSet(int256 outcome);

    constructor(address reporter) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REPORTER_ROLE, reporter);
        _outcome = -1; // Not set
    }

    /// @notice Sets the outcome of the market.
    /// @param outcome The outcome to set.
    function setOutcome(int256 outcome) external onlyRole(REPORTER_ROLE) {
        require(!_isSet, "outcome already set");
        _outcome = outcome;
        _isSet = true;
        emit OutcomeSet(outcome);
    }

    /// @notice Returns the outcome of the market.
    /// @return The outcome of the market.
    function getOutcome() external view override returns (int256) {
        require(_isSet, "outcome not set");
        return _outcome;
    }
}