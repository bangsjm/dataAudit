pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Regester {

    uint256 public number=0;

    mapping (string => uint256) serviceName;

    function regester(string memory service ) public{
        number++;
        serviceName[service]=number;
    }
    
    function getKey(string memory service) view  public returns(uint256){
        return serviceName[service];
    }

}