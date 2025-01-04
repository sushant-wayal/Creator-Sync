//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { AggregatorV3Interface } from "../lib/chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import { PriceConverter } from "./PriceConverter.sol";

contract Payment {
    using PriceConverter for uint256;

    error Payment__PayingLess(uint256 min_in_usd, uint256 actual_in_usd);

    event PaymentDone(uint256 indexed amount);

    AggregatorV3Interface internal s_priceFeed;

    constructor(address _priceFeed) {
        s_priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function pay(uint256 min_in_usd, address receiver) public payable {
        uint256 actual_in_usd = msg.value.getConversionRate(s_priceFeed);
        if (actual_in_usd < min_in_usd) {
            revert Payment__PayingLess(min_in_usd, actual_in_usd);
        }
        payable(receiver).transfer(msg.value);
        emit PaymentDone(actual_in_usd);
    }
}