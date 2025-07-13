// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GiftVoucher is ReentrancyGuard {
    struct Voucher {
        address sender;
        address recipient;
        uint256 amount;
        string message;
        bool redeemed;
        uint256 createdAt;
    }

    IERC20 public immutable usdt;
    mapping(bytes32 => Voucher) public vouchers;
    uint256 public constant VOUCHER_EXPIRY = 30 days;

    event VoucherCreated(bytes32 voucherId, address sender, address recipient, uint256 amount, string message);
    event VoucherRedeemed(bytes32 voucherId, address recipient, uint256 amount);
    event VoucherRefunded(bytes32 voucherId, address sender, uint256 amount);
    event BatchVouchersCreated(bytes32[] voucherIds);

    constructor(address _usdtAddress) {
        require(_usdtAddress != address(0), "Invalid USDT address");
        usdt = IERC20(_usdtAddress);
    }

    function createVoucher(address _recipient, uint256 _amount, string memory _message) 
        external 
        nonReentrant 
        returns (bytes32) 
    {
        require(_recipient != address(0), "Invalid recipient address");
        require(_amount >= 1e6 && _amount <= 5e6, "Amount must be between $1 and $5 USDT");
        require(bytes(_message).length <= 50, "Message too long");
        require(usdt.transferFrom(msg.sender, address(this), _amount), "USDT transfer failed");

        bytes32 voucherId = keccak256(abi.encode(msg.sender, _recipient, _amount, block.timestamp));
        vouchers[voucherId] = Voucher(msg.sender, _recipient, _amount, _message, false, block.timestamp);
        emit VoucherCreated(voucherId, msg.sender, _recipient, _amount, _message);
        return voucherId;
    }

    function batchCreateVouchers(
        address[] calldata _recipients, 
        uint256[] calldata _amounts, 
        string[] calldata _messages
    ) 
        external 
        nonReentrant 
        returns (bytes32[] memory) 
    {
        require(_recipients.length == _amounts.length && _amounts.length == _messages.length, "Array length mismatch");
        require(_recipients.length <= 10, "Max 10 vouchers per batch");

        bytes32[] memory voucherIds = new bytes32[](_recipients.length);
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "Invalid recipient address");
            require(_amounts[i] >= 1e6 && _amounts[i] <= 5e6, "Amount must be between $1 and $5 USDT");
            require(bytes(_messages[i]).length <= 50, "Message too long");
            totalAmount += _amounts[i];
        }

        require(usdt.transferFrom(msg.sender, address(this), totalAmount), "USDT batch transfer failed");

        for (uint256 i = 0; i < _recipients.length; i++) {
            bytes32 voucherId = keccak256(abi.encode(msg.sender, _recipients[i], _amounts[i], block.timestamp, i));
            vouchers[voucherId] = Voucher(msg.sender, _recipients[i], _amounts[i], _messages[i], false, block.timestamp);
            voucherIds[i] = voucherId;
            emit VoucherCreated(voucherId, msg.sender, _recipients[i], _amounts[i], _messages[i]);
        }

        emit BatchVouchersCreated(voucherIds);
        return voucherIds;
    }

    function redeemVoucher(bytes32 _voucherId) 
        external 
        nonReentrant 
    {
        Voucher storage voucher = vouchers[_voucherId];
        require(voucher.recipient == msg.sender, "Only recipient can redeem");
        require(!voucher.redeemed, "Voucher already redeemed");
        require(block.timestamp <= voucher.createdAt + VOUCHER_EXPIRY, "Voucher expired");

        voucher.redeemed = true;
        require(usdt.transfer(msg.sender, voucher.amount), "USDT transfer failed");
        emit VoucherRedeemed(_voucherId, msg.sender, voucher.amount);
    }

    function refundVoucher(bytes32 _voucherId) 
        external 
        nonReentrant 
    {
        Voucher storage voucher = vouchers[_voucherId];
        require(voucher.sender == msg.sender, "Only sender can refund");
        require(!voucher.redeemed, "Voucher already redeemed");
        require(block.timestamp > voucher.createdAt + VOUCHER_EXPIRY, "Voucher not yet expired");

        voucher.redeemed = true; // Mark as redeemed to prevent further use
        require(usdt.transfer(msg.sender, voucher.amount), "USDT refund failed");
        emit VoucherRefunded(_voucherId, msg.sender, voucher.amount);
    }

    function getContractUSDTBalance() 
        external 
        view 
        returns (uint256) 
    {
        return usdt.balanceOf(address(this));
    }

    function getVoucher(bytes32 _voucherId) 
        external 
        view 
        returns (Voucher memory) 
    {
        return vouchers[_voucherId];
    }
}