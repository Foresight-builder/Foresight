// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {FixedPointMathLib} from "solmate/utils/FixedPointMathLib.sol";

/// @title Logarithmic Market Scoring Rule (LMSR) AMM Library
/// @author Gnosis, with modifications
/// @notice Provides pure functions for an LMSR automated market maker.
/// @dev This implementation is for a binary market (two outcomes).
/// The math is heavily based on Gnosis' implementation and uses fixed-point arithmetic.
library LMSRAMM {
    using FixedPointMathLib for uint256;

    uint256 private constant ONE = 1e18;

    /// @notice Calculates the cost of purchasing a number of outcome tokens.
    /// @param netOutcomeTokensSold An array containing the number of tokens sold for each outcome.
    /// @param b The liquidity parameter. A larger `b` corresponds to a deeper market.
    /// @param outcomeIndex The index of the outcome token to be purchased.
    /// @param amount The number of outcome tokens to be purchased.
    /// @return cost The cost of the purchase in collateral tokens.
    function calcCostOfBuying(
        uint256[] memory netOutcomeTokensSold,
        uint256 b,
        uint8 outcomeIndex,
        uint256 amount
    ) internal pure returns (uint256 cost) {
        require(netOutcomeTokensSold.length == 2, "LMSRAMM: BINARY_MARKET_ONLY");
        require(outcomeIndex < 2, "LMSRAMM: INVALID_OUTCOME_INDEX");

        uint256 exp_0 = (netOutcomeTokensSold[0] / b).exp();
        uint256 exp_1 = (netOutcomeTokensSold[1] / b).exp();

        uint256 initialCost = (b * (exp_0 + exp_1).ln());

        uint256[] memory newNetOutcomeTokensSold = new uint256[](2);
        newNetOutcomeTokensSold[0] = netOutcomeTokensSold[0];
        newNetOutcomeTokensSold[1] = netOutcomeTokensSold[1];
        newNetOutcomeTokensSold[outcomeIndex] += amount;

        uint256 new_exp_0 = (newNetOutcomeTokensSold[0] / b).exp();
        uint256 new_exp_1 = (newNetOutcomeTokensSold[1] / b).exp();

        uint256 newCost = (b * (new_exp_0 + new_exp_1).ln());

        cost = newCost - initialCost;
    }

    /// @notice Calculates the net cost for a set of trades.
    /// @param netOutcomeTokensSold An array containing the number of tokens sold for each outcome.
    /// @param b The liquidity parameter.
    /// @param outcomeTokenAmounts The amounts of each outcome token being traded.
    /// @return netCost The net cost of the trades.
    function calcNetCost(
        uint256[] memory netOutcomeTokensSold,
        uint256 b,
        uint256[] memory outcomeTokenAmounts
    ) internal pure returns (uint256 netCost) {
        uint256 sumExp;
        for (uint8 i = 0; i < netOutcomeTokensSold.length; i++) {
            sumExp += ((netOutcomeTokensSold[i] + outcomeTokenAmounts[i]) / b).exp();
        }
        netCost = b * sumExp.ln();
    }

    /// @notice Calculates the fee for the liquidity providers.
    /// @param feeBps The fee in basis points (e.g., 30 for 0.3%).
    /// @param cost The cost of the trade before fees.
    /// @return fee The calculated fee.
    function calcLiquidityProviderFee(uint256 feeBps, uint256 cost) internal pure returns (uint256 fee) {
        fee = (cost * feeBps) / 10000;
    }
}