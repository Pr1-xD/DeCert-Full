

pragma solidity ^0.6.0;

contract CertVerify{

    address public owner;
    bytes32 public root;


    bool public claimIsActive = false;

     constructor() public {
        owner=msg.sender;
        root=0x5a69887c896dd1dac6edf4fda9ba2c381ca78a8d92739e2d794a7dd980f7a605;
        
    }

    
     function flipClaimState() public {
        require(msg.sender==owner, "Only Owner can use this function");
        claimIsActive = !claimIsActive;
    }

    function setRoot(bytes32 newRoot) public  {
        require(msg.sender==owner, "Only Owner can use this function");
        root=newRoot; 
    }

     function transferOwnership(address newOwner) public {
        require(msg.sender==owner, "Only Owner can use this function");
        owner=newOwner; //Set Owner
    }

    
  function verify(
    bytes32 leaf,
    bytes32[] memory proof
  )
    public
    view
    returns (bool)
  {
    bytes32 computedHash = leaf;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (computedHash < proofElement) {
        computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
      } else {
        computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
      }
    }
    return computedHash == root;
  }

}

