// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {PathtrickSBT} from "../src/PathtrickSBT.sol";

contract PathtrickSBTTest is Test {
    // ─────────────────────────────────────────────────────────────────────────
    // Actors
    // ─────────────────────────────────────────────────────────────────────────
    address internal owner;
    address internal adminSigner;
    uint256 internal adminPrivateKey;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    // ─────────────────────────────────────────────────────────────────────────
    // Fixtures
    // ─────────────────────────────────────────────────────────────────────────
    PathtrickSBT internal sbt;

    uint256 internal constant COURSE_ID = 42;
    uint256 internal constant MINT_PRICE = 0.005 ether;
    string internal constant TOKEN_URI = "ipfs://QmPlaceholderCID/{id}.json";

    bytes32 public constant MINT_TYPEHASH =
        keccak256("MintCertificate(address user,uint256 courseId,uint256 nonce,uint256 deadline)");

    // ─────────────────────────────────────────────────────────────────────────
    // Setup
    // ─────────────────────────────────────────────────────────────────────────
    function setUp() public {
        owner = makeAddr("owner");
        (adminSigner, adminPrivateKey) = makeAddrAndKey("adminSigner");

        sbt = new PathtrickSBT(owner, adminSigner, TOKEN_URI);

        // Give users some BNB
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper — Generates an EIP-712 Signature
    // ─────────────────────────────────────────────────────────────────────────
    function _signMintRequest(uint256 pKey, address user, uint256 courseId, uint256 deadline)
        internal
        view
        returns (bytes memory)
    {
        bytes32 structHash = keccak256(abi.encode(MINT_TYPEHASH, user, courseId, sbt.nonces(user, courseId), deadline));

        bytes32 domainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("PathtrickSBT")),
                keccak256(bytes("1")),
                block.chainid,
                address(sbt)
            )
        );

        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pKey, digest);
        return abi.encodePacked(r, s, v);
    }

    // =========================================================================
    // SC-01: Mint Happy Path
    // =========================================================================

    function test_mint_succeeds_with_valid_signature_and_fee() public {
        bytes memory signature = _signMintRequest(adminPrivateKey, alice, COURSE_ID, block.timestamp + 1 days);

        vm.prank(alice);
        sbt.mintCertificate{value: MINT_PRICE}(COURSE_ID, block.timestamp + 1 days, signature);

        assertEq(sbt.balanceOf(alice, COURSE_ID), 1, "alice should own 1 token of COURSE_ID");
        assertTrue(sbt.hasCertificate(alice, COURSE_ID), "hasCertificate flag should be true");
    }

    function test_mint_event_emitted() public {
        uint256 deadline = block.timestamp + 1 days;
        bytes memory signature = _signMintRequest(adminPrivateKey, alice, COURSE_ID, deadline);

        vm.expectEmit(true, true, false, false);
        emit PathtrickSBT.CertificateMinted(alice, COURSE_ID);

        vm.prank(alice);
        sbt.mintCertificate{value: MINT_PRICE}(COURSE_ID, deadline, signature);
    }

    // =========================================================================
    // SC-02: Mint Validations & Errors
    // =========================================================================

    function test_mint_reverts_if_fee_incorrect() public {
        uint256 deadline = block.timestamp + 1 days;
        bytes memory signature = _signMintRequest(adminPrivateKey, alice, COURSE_ID, deadline);

        vm.expectRevert(PathtrickSBT.IncorrectMintFee.selector);
        vm.prank(alice);
        // Sending less fee
        sbt.mintCertificate{value: MINT_PRICE - 1 wei}(COURSE_ID, deadline, signature);
    }

    function test_mint_reverts_if_signature_invalid() public {
        // Sign for Bob but Alice tries to use it
        uint256 deadline = block.timestamp + 1 days;
        bytes memory signature = _signMintRequest(adminPrivateKey, bob, COURSE_ID, deadline);

        vm.expectRevert(PathtrickSBT.InvalidSignature.selector);
        vm.prank(alice);
        sbt.mintCertificate{value: MINT_PRICE}(COURSE_ID, deadline, signature);
    }

    function test_mint_reverts_if_signed_by_wrong_admin() public {
        (, uint256 wrongKey) = makeAddrAndKey("wrongSigner");
        uint256 deadline = block.timestamp + 1 days;
        bytes memory signature = _signMintRequest(wrongKey, alice, COURSE_ID, deadline);

        vm.expectRevert(PathtrickSBT.InvalidSignature.selector);
        vm.prank(alice);
        sbt.mintCertificate{value: MINT_PRICE}(COURSE_ID, deadline, signature);
    }

    function test_mint_reverts_with_expired_signature() public {
        uint256 deadline = block.timestamp - 1;
        bytes memory signature = _signMintRequest(adminPrivateKey, alice, COURSE_ID, deadline);

        vm.expectRevert(PathtrickSBT.SignatureExpired.selector);
        vm.prank(alice);
        sbt.mintCertificate{value: MINT_PRICE}(COURSE_ID, deadline, signature);
    }

    function test_constructor_reverts_when_owner_equals_admin_signer() public {
        vm.expectRevert(PathtrickSBT.AdminSignerCannotBeOwner.selector);
        new PathtrickSBT(owner, owner, TOKEN_URI);
    }

    function test_double_mint_reverts() public {
        uint256 deadline = block.timestamp + 1 days;
        bytes memory signature = _signMintRequest(adminPrivateKey, alice, COURSE_ID, deadline);

        vm.startPrank(alice);
        sbt.mintCertificate{value: MINT_PRICE}(COURSE_ID, deadline, signature);

        // Try again
        vm.expectRevert(abi.encodeWithSelector(PathtrickSBT.AlreadyCertified.selector, alice, COURSE_ID));
        sbt.mintCertificate{value: MINT_PRICE}(COURSE_ID, deadline, signature);
        vm.stopPrank();
    }

    // =========================================================================
    // SC-03: Soulbound Properties
    // =========================================================================

    function test_safeTransferFrom_reverts() public {
        uint256 deadline = block.timestamp + 1 days;
        bytes memory signature = _signMintRequest(adminPrivateKey, alice, COURSE_ID, deadline);
        vm.prank(alice);
        sbt.mintCertificate{value: MINT_PRICE}(COURSE_ID, deadline, signature);

        vm.expectRevert(PathtrickSBT.SoulboundTokenNonTransferable.selector);
        vm.prank(alice);
        sbt.safeTransferFrom(alice, bob, COURSE_ID, 1, "");
    }

    function test_setApprovalForAll_reverts() public {
        vm.expectRevert(PathtrickSBT.SoulboundTokenNonTransferable.selector);
        vm.prank(alice);
        sbt.setApprovalForAll(bob, true);
    }

    // =========================================================================
    // SC-04: Admin & Owner Functions
    // =========================================================================

    function test_constructor_reverts_with_zero_admin_signer() public {
        vm.expectRevert(bytes("zero address"));
        new PathtrickSBT(owner, address(0), TOKEN_URI);
    }

    function test_owner_can_withdraw() public {
        // Alice mints
        uint256 deadline = block.timestamp + 1 days;
        bytes memory signature = _signMintRequest(adminPrivateKey, alice, COURSE_ID, deadline);
        vm.prank(alice);
        sbt.mintCertificate{value: MINT_PRICE}(COURSE_ID, deadline, signature);

        assertEq(address(sbt).balance, MINT_PRICE);

        uint256 ownerInitialBalance = owner.balance;

        vm.prank(owner);
        sbt.withdraw();

        assertEq(address(sbt).balance, 0);
        assertEq(owner.balance, ownerInitialBalance + MINT_PRICE);
    }

    function test_non_owner_cannot_withdraw() public {
        vm.expectRevert(); // OwnableUnauthorizedAccount
        vm.prank(alice);
        sbt.withdraw();
    }

    function test_owner_can_set_admin_signer() public {
        address newSigner = makeAddr("newSigner");

        vm.expectEmit(true, true, false, false);
        emit PathtrickSBT.AdminSignerUpdated(adminSigner, newSigner);

        vm.prank(owner);
        sbt.setAdminSigner(newSigner);

        assertEq(sbt.adminSigner(), newSigner);
    }

    function test_owner_cannot_set_zero_admin_signer() public {
        vm.expectRevert(bytes("zero address"));

        vm.prank(owner);
        sbt.setAdminSigner(address(0));
    }

    function test_owner_cannot_set_self_as_admin_signer() public {
        vm.expectRevert(PathtrickSBT.AdminSignerCannotBeOwner.selector);

        vm.prank(owner);
        sbt.setAdminSigner(owner);
    }

    function test_owner_can_set_mint_price() public {
        uint256 newPrice = 0.01 ether;

        vm.expectEmit(true, true, false, false);
        emit PathtrickSBT.MintPriceUpdated(MINT_PRICE, newPrice);

        vm.prank(owner);
        sbt.setMintPrice(newPrice);

        assertEq(sbt.mintPrice(), newPrice);
    }
    // =========================================================================
    // SC-05: Fuzzing & Security Tests
    // =========================================================================

    function testFuzz_mint_reverts_with_random_signature(bytes calldata randomSignature, uint256 courseId) public {
        vm.assume(randomSignature.length == 65);

        vm.expectRevert();
        vm.prank(alice);
        sbt.mintCertificate{value: MINT_PRICE}(courseId, block.timestamp + 1 days, randomSignature);
    }

    function testFuzz_mint_reverts_with_incorrect_fee(uint256 randomFee) public {
        vm.assume(randomFee != MINT_PRICE);

        uint256 deadline = block.timestamp + 1 days;
        bytes memory signature = _signMintRequest(adminPrivateKey, alice, COURSE_ID, deadline);

        vm.deal(alice, randomFee); // Ensure alice has enough balance to send the random fee
        vm.expectRevert(PathtrickSBT.IncorrectMintFee.selector);
        vm.prank(alice);
        sbt.mintCertificate{value: randomFee}(COURSE_ID, deadline, signature);
    }

    function testFuzz_soulbound_prevents_arbitrary_transfers(address attacker, address recipient, uint256 courseId)
        public
    {
        vm.assume(attacker != address(0));
        vm.assume(recipient != address(0));

        vm.expectRevert();
        vm.prank(attacker);
        sbt.safeTransferFrom(attacker, recipient, courseId, 1, "");
    }
}
