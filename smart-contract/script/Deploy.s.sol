// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {PathtrickSBT} from "../src/PathtrickSBT.sol";

/**
 * @title  Deploy
 * @notice Foundry deployment script for PathtrickSBT (BEP-1155 Web3-Native).
 *
 * Environment variables required
 * ───────────────────────────────
 *   PRIVATE_KEY       — private key of the deployer wallet used to broadcast.
 *   OWNER_ADDRESS     — owner or multisig address for administration.
 *   ADMIN_SIGNER      — address of the Backend wallet that signs the EIP-712 certificates.
 *                       This must be different from the deployer/owner address.
 *
 * Usage examples
 * ──────────────
 *   # BNB Testnet (broadcast + verify on BscScan)
 *   forge script script/Deploy.s.sol \
 *       --rpc-url bnb_testnet \
 *       --private-key $PRIVATE_KEY \
 *       --broadcast \
 *       --verify \
 *       --verifier-url https://api-testnet.bscscan.com/api \
 *       --etherscan-api-key $BSCSCAN_API_KEY \
 *       -vvvv
 */
contract Deploy is Script {
    function run() external returns (PathtrickSBT sbt) {
        // ── Read env ──────────────────────────────────────────────────────────
        uint256 deployerPrivKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivKey);
        address ownerAddress = vm.envAddress("OWNER_ADDRESS");
        address adminSigner = vm.envAddress("ADMIN_SIGNER");

        // Set the global URI for the SBTs (Replace with real IPFS CID later via setURI)
        string memory uri = "ipfs://QmPlaceholderCID/{id}.json";

        console2.log("=== PathtrickSBT Deployment ===");
        console2.log("Deployer:         ", deployerAddress);
        console2.log("Owner:            ", ownerAddress);
        console2.log("Admin Signer:    ", adminSigner);

        // ── Deploy ────────────────────────────────────────────────────────────
        vm.startBroadcast(deployerPrivKey);

        sbt = new PathtrickSBT(ownerAddress, adminSigner, uri);

        vm.stopBroadcast();

        // ── Verify post-deploy invariants (simulation only) ───────────
        require(sbt.owner() == ownerAddress, "Deploy: owner not set correctly");
        require(sbt.adminSigner() == adminSigner, "Deploy: admin signer not set correctly");

        console2.log("PathtrickSBT deployed at:", address(sbt));
    }
}
