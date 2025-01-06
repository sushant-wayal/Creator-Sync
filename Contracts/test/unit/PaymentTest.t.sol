// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { Test, console } from "forge-std/Test.sol";
import { Payment } from "../../src/Payment.sol";
import { DeployPayment } from "../../script/DeployPayment.s.sol";
import { HelperConfig } from "../../script/HelperConfig.s.sol";
import { PriceConverter } from "../../src/PriceConverter.sol";
import { AggregatorV3Interface } from "../../lib/chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PaymentTest is Test {
    using PriceConverter for uint256;

    event PaymentDone(uint256 indexed amount, uint256 indexed refund, string indexed projectId);

    Payment payment;
    AggregatorV3Interface priceFeed;
    address SENDER = makeAddr("SENDER");
    address RECEIVER = makeAddr("RECEIVER");
    uint256 constant SEND_VALUE = 0.1 ether;
    uint256 constant STARTING_BALANCE = 100 ether;
    uint256 constant GAS_PRICE = 1;
    uint256 constant PRICE_IN_USD = 100;
    string constant PROJECT_ID = "projectId";
    uint256 private constant ONE_ETH = 1 ether;
    uint256 private constant PENALTY = 2;
    uint256 constant PRECISION = 1e18;

    modifier createProject(uint256 _deadline) {
        vm.prank(SENDER);
        payment.create{value : SEND_VALUE}(PROJECT_ID, PRICE_IN_USD, _deadline, RECEIVER);
        _;
    }
    
    function setUp() external {
        DeployPayment depolyPayment = new DeployPayment();
        HelperConfig helperConfig;
        (payment, helperConfig) = depolyPayment.run();
        priceFeed = AggregatorV3Interface(helperConfig.activeNetworkConfig());
        vm.deal(SENDER, STARTING_BALANCE);
        vm.deal(RECEIVER, STARTING_BALANCE);
        vm.warp(2 days);
    }

    function testRevertIfPayedLessInCreate() public {
        uint256 priceInUsd = 100;
        uint256 deadline = block.timestamp + 1 days;
        address editor = RECEIVER;
        string memory projectId = "projectId";
        vm.prank(SENDER);
        vm.expectPartialRevert(Payment.Payment__PayingLess.selector);
        payment.create(projectId, priceInUsd, deadline, editor);
    }

    function testPaymentCreated() public {
        uint256 priceInUsd = 100;
        uint256 deadline = block.timestamp + 1 days;
        address editor = RECEIVER;
        string memory projectId = "projectId";
        vm.prank(SENDER);
        payment.create{value : SEND_VALUE}(projectId, priceInUsd, deadline, editor);
        Payment.PaymentData memory paymentData = payment.getPayments(projectId);
        assertEq(paymentData.priceInUsd, priceInUsd);
        assertEq(paymentData.toPayInUsd, SEND_VALUE.getConversionRate(priceFeed));
        assertEq(paymentData.projectId, projectId);
        assertEq(paymentData.deadline, deadline);
        assertEq(paymentData.editor, editor);
        assertEq(paymentData.creator, SENDER);
    }

    function testRevertWhenDeadlineExtendedByNotCreator() public createProject(block.timestamp + 1 days) {
        vm.prank(RECEIVER);
        vm.expectRevert(Payment.Payment__OnlyCreatorCanExtendDeadline.selector);
        payment.extendDeadline(PROJECT_ID, 1);
    }

    function testDeadlineExtendedByCreator() public createProject(block.timestamp + 1 days) {
        uint256 deadlineBefore = payment.getPayments(PROJECT_ID).deadline;
        vm.prank(SENDER);
        payment.extendDeadline(PROJECT_ID, 1);
        Payment.PaymentData memory paymentData = payment.getPayments(PROJECT_ID);
        assertEq(paymentData.deadline, deadlineBefore + 1 days);
    }

    function testComplete() public createProject(block.timestamp - 1 days) {
        uint256 deadline = payment.getPayments(PROJECT_ID).deadline;
        uint256 penalty = 0;
        if (block.timestamp > deadline) {
            uint256 dueDays = (block.timestamp - deadline) / (24 * 60 * 60);
            penalty = (dueDays * PRICE_IN_USD * PENALTY * PRECISION)/ 100;
        }
        uint256 toPayInUsd = 0;
        if (penalty <= SEND_VALUE.getConversionRate(priceFeed)) {
            toPayInUsd = (SEND_VALUE.getConversionRate(priceFeed) * PRECISION) - penalty;
        }
        uint256 oneEthtoUsd = ONE_ETH.getConversionRate(priceFeed);
        uint256 toPayInEth = toPayInUsd / oneEthtoUsd;
        uint256 toRefundInEth = penalty / oneEthtoUsd;
        vm.prank(SENDER);
        vm.expectEmit(true, true, true, false, address(payment));
        emit PaymentDone(toPayInUsd / PRECISION , penalty / PRECISION, PROJECT_ID);
        payment.complete(PROJECT_ID);
        assertEq(address(SENDER).balance, STARTING_BALANCE - SEND_VALUE + toRefundInEth);
        assertEq(address(RECEIVER).balance, STARTING_BALANCE + toPayInEth);
    }
}