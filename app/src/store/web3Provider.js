import Portis from '@portis/web3';
import Web3 from 'web3';
import Abi from './abi'
import keccak256 from 'keccak256'
// private ganache node...
const myPrivateEthereumNode = {
    nodeUrl: 'http://127.0.0.1:8545', // node url
    chainId: 4444, // chainid
};

const provider = {
    contractAddress: '0xeea2Fc1D255Fd28aA15c6c2324Ad40B03267f9c5',
    buyAddress: '0x63a8656265d04Fe4c11F4b81e3d1E061b582177d',
    w3: null,
    account: null,
    contract: null,
    buyContract: null,
    portis: null,
    logout:async function () {
        await this.portis.logout()
    },
    keccakHash: function (secretId) {
        const encoding = this.w3.eth.abi.encodeParameter('uint256', secretId)
        const hash = keccak256(encoding)
        return hash
    },
    login: async function () {
        await this.portis.showPortis()
        await provider.setAccount()
    },
    isLoggedIn: async function () {
        if (this.portis) {
            return await this.portis.isLoggedIn()
        }
    },
    setAccount: async function () {
        const account = await this.w3.eth.getAccounts()
        this.account = account[0]
        console.log(account);
    },

    getAccount: function () {
        return this.account
    },

    getProvider: function () {
        return this.w3;
    },

    setProvider: async function () {
        this.portis = await new Portis('42dca739-f49f-4002-a181-82cdaadc7dd5', myPrivateEthereumNode);
        this.w3 = await new Web3(this.portis.provider)
    },

    setContract: async function () {
        const contract = await new this.w3.eth.Contract(Abi.counterfeitAbi, this.contractAddress);
        const side = await new this.w3.eth.Contract(Abi.buyAbi, this.buyAddress)
        this.buyContract = side
        this.contract = contract;
    },
    // for non-transaction methods ex- view pure
    callTransaction: async function (method, parameters = []) {
        try {
            const transaction = {
                from: this.account,
                to: this.contractAddress,
            }
            const result = await this.contract.methods[method](...parameters).call(transaction);
            return result;
        } catch (error) {
            console.log(error);
            return { message:error.message, code:204};
        }
    },

    // method for transaction that require fee....
    sendTransaction: async function (method, parameters = [], toBuy = false) {
        try {
            if (toBuy) { 
                const transaction = {
                    from: this.account,
                    to: this.buyAddress,
                    gas: 500000,
                    gasPrice:0
                }
                const receipt = await this.buyContract.methods[method](...parameters).send(transaction);
                console.log(receipt);
                return receipt
            }
            else {
                const transaction = {
                    from: this.account,
                    to: this.contractAddress,
                    gas: 500000,
                    gasPrice:0
                }
                const receipt = await this.contract.methods[method](...parameters).send(transaction);
                console.log(receipt);
                return receipt
            }
        } catch (error) {
            console.log(error);
            return new Error(error.message)
        }
    }
}
export default provider