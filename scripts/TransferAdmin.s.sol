// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import "forge-std/Script.sol";
import "../src/ZKTCampaignPool.sol";

contract TransferAdmin is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address newAdmin = vm.envAddress("NEW_ADMIN"); // Your personal wallet address

        vm.startBroadcast(deployerPrivateKey);

        // Connect to your deployed pool
        ZKTCampaignPool pool = ZKTCampaignPool(0x3c2E012c77CF48DdDC7E7368Bf87Ba823Db66Ef8);

        // Transfer admin to your personal wallet
        pool.transferAdmin(newAdmin);

        console.log("Admin transferred from:", deployer);
        console.log("Admin transferred to:", newAdmin);

        vm.stopBroadcast();
    }
}
