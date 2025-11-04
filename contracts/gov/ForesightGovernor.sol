// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

/// @title ForesightGovernor
/// @author Foresight
/// @notice This contract is the central governance module for the Foresight protocol.
/// @dev It combines standard OpenZeppelin Governor modules to create a comprehensive DAO.
/// - Governor: Core governance logic.
/// - GovernorVotes: Integrates with an ERC20Votes token (ForesightToken) for vote counting.
/// - GovernorVotesQuorumFraction: Sets the quorum as a percentage of the total token supply.
/// - GovernorTimelockControl: Enforces a time delay on the execution of successful proposals.
contract ForesightGovernor is
    Governor,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    /// @notice The name of the governor contract.
    string public constant NAME = "ForesightGovernor";

    /// @notice Contract constructor.
    /// @param _token The address of the ERC20Votes token used for voting (ForesightToken).
    /// @param _timelock The address of the Timelock contract that controls execution.
    /// @param _quorumPercentage The percentage of total voting power required for a proposal to be considered valid (e.g., 4 for 4%).
    /// @param _votingPeriod The duration of the voting period in blocks.
    /// @param _votingDelay The delay in blocks from when a proposal is created until voting starts.
    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _quorumPercentage,
        uint256 _votingPeriod,
        uint256 _votingDelay
    ) 
        Governor(NAME) 
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {
        _updateVotingPeriod(_votingPeriod);
        _updateVotingDelay(_votingDelay);
    }

    /// @notice See {IGovernor-votingDelay}.
    function votingDelay() public view override(IGovernor) returns (uint256) {
        return super.votingDelay();
    }

    /// @notice See {IGovernor-votingPeriod}.
    function votingPeriod() public view override(IGovernor) returns (uint256) {
        return super.votingPeriod();
    }

    /// @notice See {IGovernor-quorum}.
    function quorum(uint256 blockNumber) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }

    /// @notice See {IGovernor-getVotes}.
    function getVotes(address account, uint256 blockNumber) public view override(IGovernor, GovernorVotes) returns (uint256) {
        return super.getVotes(account, blockNumber);
    }

    /// @notice See {IGovernor-state}.
    function state(uint256 proposalId) public view override(IGovernor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }

    /// @notice See {IGovernor-propose}.
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    /// @notice See {Governor-_propose}.
    function _propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        address proposer
    ) internal override(Governor) returns (uint256) {
        return super._propose(targets, values, calldatas, description, proposer);
    }

    /// @notice See {Governor-_execute}.
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    /// @notice See {Governor-_cancel}.
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    /// @notice See {Governor-_castVote}.
    function _castVote(
        uint256 proposalId,
        address account,
        uint8 support,
        string memory reason
    ) internal override(Governor, GovernorVotes) returns (uint256) {
        return super._castVote(proposalId, account, support, reason);
    }

    /// @notice See {Governor-_executor}.
    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    /// @notice Updates the voting delay.
    /// @dev Can only be called by the governor itself through a proposal.
    /// @param newVotingDelay The new voting delay in blocks.
    function updateVotingDelay(uint256 newVotingDelay) external onlyGovernance {
        _updateVotingDelay(newVotingDelay);
    }

    /// @notice Updates the voting period.
    /// @dev Can only be called by the governor itself through a proposal.
    /// @param newVotingPeriod The new voting period in blocks.
    function updateVotingPeriod(uint256 newVotingPeriod) external onlyGovernance {
        _updateVotingPeriod(newVotingPeriod);
    }

    /// @notice Updates the quorum percentage.
    /// @dev Can only be called by the governor itself through a proposal.
    /// @param newQuorumPercentage The new quorum percentage (e.g., 5 for 5%).
    function updateQuorumNumerator(uint256 newQuorumPercentage) external onlyGovernance {
        _updateQuorumNumerator(newQuorumPercentage);
    }

    /// @notice See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId) public view override(Governor, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}