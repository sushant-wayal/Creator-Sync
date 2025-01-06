//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { Script } from "forge-std/Script.sol";
import { HelperConfig } from "./HelperConfig.s.sol";
import { Payment } from "../src/Payment.sol";

contract DeployPayment is Script {
    function run() external returns(Payment, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig();
        vm.startBroadcast();
        Payment payment = new Payment(helperConfig.activeNetworkConfig());
        vm.stopBroadcast();
        return (payment, helperConfig);
    }
}