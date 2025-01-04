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

    event PaymentDone(uint256 indexed amount);

    Payment payment;
    HelperConfig helperConfig;
    address SENDER = makeAddr("SENDER");
    address RECEIVER = makeAddr("RECEIVER");
    uint256 constant SEND_VALUE = 0.1 ether;
    uint256 constant STARTING_BALANCE = 100 ether;
    uint256 constant GAS_PRICE = 1;
    
    function setUp() external {
        DeployPayment depolyPayment = new DeployPayment();
        (payment, helperConfig) = depolyPayment.run();
        vm.deal(SENDER, STARTING_BALANCE);
        vm.deal(RECEIVER, STARTING_BALANCE);
    }

    function testPayRevertWhenNotPaidEnough() external {
        vm.prank(SENDER);
        uint256 min_in_usd = 100;
        vm.expectPartialRevert(Payment.Payment__PayingLess.selector);
        payment.pay(min_in_usd, RECEIVER);
    }

    function testPayTransferToReceiver() external {
        uint256 min_in_usd = 0;
        uint256 expected_balance = STARTING_BALANCE + SEND_VALUE;
        vm.txGasPrice(GAS_PRICE);
        vm.prank(SENDER);
        uint256 gasStart = gasleft();
        payment.pay{ value: SEND_VALUE }(min_in_usd, RECEIVER);
        uint256 gasEnd = gasleft();
        uint256 gasSpent = (gasStart - gasEnd) * tx.gasprice;
        console.log("Gas spent: ", gasSpent);
        assertEq(address(RECEIVER).balance, expected_balance);
    }

    function testPayEmitPaymentDone() external {
        uint256 min_in_usd = 0;
        vm.prank(SENDER);
        vm.expectEmit(true, false, false, false, address(payment));
        emit PaymentDone(SEND_VALUE.getConversionRate(AggregatorV3Interface(helperConfig.activeNetworkConfig())));
        payment.pay{ value: SEND_VALUE }(min_in_usd, RECEIVER);
    }
}