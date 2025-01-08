//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { AggregatorV3Interface } from "../lib/chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import { PriceConverter } from "./PriceConverter.sol";

contract Payment {
    using PriceConverter for uint256;

    struct PaymentData {
        uint256 priceInUsd;
        uint256 toPayInUsd;
        string projectId;
        uint256 deadline;
        address editor;
        address creator;
    }

    error Payment__PayingLess(uint256 priceInUsd, uint256 actualInUsd);
    error Payment__OnlyCreatorCanExtendDeadline();
    error Payment__PaymentFailed();

    event PaymentDone(string indexed _projectId, uint256 amount, uint256 refund, string projectId);

    AggregatorV3Interface internal immutable iPriceFeed;
    uint256 private constant ONE_ETH = 1 ether;
    uint256 private constant PENALTY = 2;
    uint256 constant PRECISION = 1e18;

    mapping(string ProjectId => PaymentData) private sPayments;

    constructor(address _priceFeed) {
        iPriceFeed = AggregatorV3Interface(_priceFeed);
    }

    function create(
        string memory projectId,
        uint256 priceInUsd,
        uint256 deadline,
        address editor
    ) public payable {
        uint256 toPayInUsd = msg.value.getConversionRate(iPriceFeed);
        if (toPayInUsd < priceInUsd) {
            revert Payment__PayingLess(priceInUsd, toPayInUsd);
        }
        sPayments[projectId] = PaymentData(
            priceInUsd,
            toPayInUsd,
            projectId,
            deadline,
            editor,
            msg.sender
        );
    }

    function extendDeadline(string memory projectId, uint256 extensionInDays) public {
        PaymentData storage payment = sPayments[projectId];
        uint256 extension = extensionInDays * (24 * 60 * 60);
        if (msg.sender != payment.creator) {
            revert Payment__OnlyCreatorCanExtendDeadline();
        }
        payment.deadline += extension;
    }

    function complete(string memory projectId) public payable {
        PaymentData storage payment = sPayments[projectId];
        uint256 penalty = 0;
        if (block.timestamp > payment.deadline) {
            uint256 dueDays = (block.timestamp - payment.deadline) / (24 * 60 * 60);
            penalty = (dueDays * payment.priceInUsd * PENALTY * PRECISION)/ 100;
        }
        uint256 toPayInUsd = 0;
        if (penalty <= payment.toPayInUsd) {
            toPayInUsd = (payment.toPayInUsd * PRECISION) - penalty;
        }
        uint256 oneEthtoUsd = ONE_ETH.getConversionRate(iPriceFeed);
        uint256 toPayInEth = toPayInUsd / oneEthtoUsd;
        (bool success, ) = payment.editor.call{ value: toPayInEth }("");
        if (!success) revert Payment__PaymentFailed();
        uint256 toRefundInEth = penalty / oneEthtoUsd;
        (success, ) = payment.creator.call{ value: toRefundInEth }("");
        if (!success) revert Payment__PaymentFailed();
        delete sPayments[projectId];
        emit PaymentDone(projectId, toPayInUsd / PRECISION, penalty / PRECISION, projectId);
    }


    function getPayments(string memory projectId) external view returns (PaymentData memory) {
        return sPayments[projectId];
    }
}