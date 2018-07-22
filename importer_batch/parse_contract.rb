web3 = Web3::Eth::Rpc.new


api = Web3::Eth::Etherscan.new 'Your API Key'
abi = api.contract_getabi address: '0xf4702b0918a8a89dfc38459ce42198834818f26b'

myContract = web3.eth.contract(abi);
tx = web3.eth.getTransactionByHash '0x35f0cf1d1c7ec14dd40fe3949d1c535ec3f3953f118cb9dc1394370f966cf957'
myContract.parse_constructor_args tx
