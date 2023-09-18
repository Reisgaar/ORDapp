import { Injectable } from '@angular/core';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import Web3 from 'web3';
import { Web3Modal } from '@web3modal/html';
import {
  configureChains,
  createConfig,
  getAccount,
  getNetwork,
  readContract,
  multicall,
  switchNetwork,
  writeContract,
  fetchToken,
  fetchBlockNumber
} from '@wagmi/core';
import { bsc, bscTestnet } from '@wagmi/core/chains';
import { BehaviorSubject } from 'rxjs';
import { activeUser } from 'src/app/constants/inventory';
import { environment } from 'src/environments/environment';
import { ethers } from 'ethers';
import { DialogService } from '../dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { publicProvider } from '@wagmi/core/providers/public';

// Set chain with selected environment
let chain: any;
if (environment.production) {
  chain = [bsc];
} else {
  chain = [bscTestnet];
}
// console.log('chain:', chain[0]);
const projectId = '3b1a110f2c10dde0a929df684ee9ed96';
const { chains, publicClient } = configureChains(chain, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3modal = new Web3Modal({ projectId }, ethereumClient);
web3modal.setDefaultChain(chain[0]);



@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private _userAccount = new BehaviorSubject<any>({});
  userAccount = this._userAccount.asObservable();
  public ethers: any;
  changingNetwork: boolean = false;
  chainErrorPopUpIsClosed: boolean = true;

  constructor(
    private dialogService: DialogService,
    private translate: TranslateService
  ) {
    this.ethers = ethers;
    this.checkWalletChanges();
    this.checkChangeRPC();
  }

  /**
   * Writes on given smart contract
   * @param contractAddress the address of the contract
   * @param abi the abi of the contract
   * @param functionName the name of the function
   * @param args the params of the function, empty array for no params
   */
  async writeContract(
    contractAddress: string,
    abi: any,
    functionName: string,
    args: any[],
    overrideValue?: any
  ): Promise<any> {
    try {
      if (this._userAccount.value.address) {
        let value = 0;
        if (overrideValue) {
          value = overrideValue;
        }
        try {
          const userAddr = this.getWalletAddress();
          const chain: number = chains[0].id;
          const config: any = {
            address: contractAddress,
            abi: abi,
            functionName: functionName,
            args: args,
            value,
            account: userAddr,
            chainId: chain,
          };
          return await writeContract(config);
        } catch (error) {
          console.log(error);
          throw error;
        }
      } else {
        this.openModal();
        throw Error;
      }
    } catch (error) {
      // repeat if rpc returns error 400
      if (error.toString().toLowerCase().includes('status: 400')) {
        console.log('REPEATING WRITE REQUEST TO RPC');
        if (overrideValue) {
          await this.writeContract(
            contractAddress,
            abi,
            functionName,
            args,
            overrideValue
          );
        } else {
          await this.writeContract(contractAddress, abi, functionName, args);
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Writes on given smart contract
   * @param contractAddress the address of the contract
   * @param abi the abi of the contract
   * @param functionName the name of the function
   * @param args the params of the function, empty array for no params
   */
  async readContract(
    contractAddress: string,
    abi: any,
    functionName: string,
    args: any[]
  ): Promise<any> {
    try {
      const chain: number = chains[0].id;
      const config: any = {
        address: contractAddress,
        abi: abi,
        functionName: functionName,
        args: args,
        chainId: chain,
      };
      const res: any = await readContract(config);
      // Process result depending on type
      if (typeof res === 'object') {
        return await this.processReadContractResult(abi, functionName, res);
      } else if (typeof res === 'bigint') {
        return res.toString();
      } else {
        return res;
      }
    } catch (error) {
      // repeat if rpc returns error 400
      if (error.toString().toLowerCase().includes('status: 400')) {
        console.log('REPEATING READ REQUEST TO RPC');
        await this.readContract(contractAddress, abi, functionName, args);
      } else {
        throw error;
      }
    }
  }

  async processReadContractResult(
    abi: any,
    functionName: string,
    res: any
  ): Promise<any> {
    const outputs = abi.find((item) => item.name === functionName).outputs;
    const processedResult: any = {};
    if (outputs.length === res.length) {
      for (let i = 0; i < res.length; i++) {
        if (typeof res[i] === 'bigint') {
          processedResult[outputs[i].name] = res[i].toString();
        } else {
          processedResult[outputs[i].name] = res[i];
        }
      }
      return processedResult;
    } else {
      return res;
    }
  }

  /**
   * Returns an array with the results of differents instances of a smart contract
   * @param mc [function:string; args:string[]]
   * @returns array of results
   */
  async multicall(mc: any): Promise<any> {
    // const contracts = mc;
    const res: any = await multicall({ contracts: mc });
    return res;
  }

  /**
   * Action for fetching ERC-20 token information.
   * @param addressToken the address of the token
   * @returns result {
    address: string
    decimals: number
    name: string
    symbol: string
    totalSupply: {
      formatted: string
      value: bigint
      }
    }
   */
  async fetchToken(addressToken: any): Promise<any> {
    const data = fetchToken({
      address: addressToken,
    });
    return data;
  }

  /**
   * Returns a read-only instance of a smart contract
   * @param abi the contract abi
   * @param address the contract address
   * @returns instance of the contract
   */
  async getReadContract(abi: any, address: string): Promise<any> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        chains[0].rpcUrls.default.http[0]
      );
      const contract = new ethers.Contract(address, abi, provider);
      return contract;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Transforms a wei value to ether value
   * @param weiValue the wei value to transform
   * @returns the value on ether
   */
  fromWei(weiValue: string): string {
    try {
      return this.ethers.utils.formatEther(weiValue);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Transforms a ether value to wei value
   * @param weiValue the ether value to transform
   * @returns the value on wei
   */
  toWei(etherValue: string): string {
    try {
      return this.ethers.utils.parseEther(etherValue).toString();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Get the timestamp of the given block
   * @param block the block number
   * @returns the timestamp of the block
   */
  async getBlockTimestamp(block: string | number): Promise<any> {
    try {
      const provider = new ethers.providers.Web3Provider(Web3.givenProvider);
      if (typeof block === 'string') {
        block = parseInt(block);
      }
      return await provider.getBlock(block);
    } catch (error) {
      console.log(error);
    }
  }

   /**
   * Get the actual block
   * @returns the number of the block
   */
   async blockNumber(): Promise<any> {
    try {
      return await fetchBlockNumber();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Gets the signature of the given data
   * @param dataToSign data to sign
   * @returns signature
   */
  async signData(dataToSign: string): Promise<any> {
    try {
      const provider = new ethers.providers.Web3Provider(Web3.givenProvider);
      const signer = provider.getSigner();
      return await signer.signMessage(dataToSign);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Check changes on wallet (address and chain)
   */
  checkWalletChanges(): void {
    wagmiConfig.subscribe((res: any) => {
      try {
        console.log(res);
        if (res.status === 'connected' && res.data.account) {
          const newAccount = res.data.account;
          const newChain = res.data.chain;
          // Opens modal if detect change from one wallet to another
          if (activeUser[0] && activeUser[0] !== '' && activeUser[0].toLowerCase() !== newAccount.toLowerCase()) {
            this.openModal();
          }
          if (newChain.id !== chains[0].id) { this.checkChangeRPC(); }
          // Sets active user
          activeUser[0] = res.data.account;
          this._userAccount.next(getAccount());
        }
      } catch (error: any) {
        this.openModal();
        console.log(error);
      }
    });
  }

  /**
   * Opens Wallect Connect Modal
   */
  async openModal(): Promise<any> {
    await web3modal.openModal();
  }

  /**
   * Subscribes to changes on modal
   */
  async subscribeModal(): Promise<any> {
    web3modal.subscribeModal(() => {
      this._userAccount.next(getAccount());
      this.checkChangeRPC();
    });
    this._userAccount.next(getAccount());
  }

  /**
   * Gets the user address
   * @returns the user address
   */
  getWalletAddress(): any {
    return this._userAccount.value.address;
  }

  /**
   * Checks if wallet is connected, if not, opens modal
   * @returns true if wallet is connected
   */
  public async syncAccount(): Promise<any> {
    if (!this._userAccount.value.address) {
      console.log('Please connect your wallet');
      this.openModal();
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks if wallet is connected or not
   * @returns true if wallet is connected
   */
  async isWalletConnected(): Promise<boolean> {
    if (this._userAccount.value.address) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Auto connects wallet
   */
  autoConnectWallet(): void {
    wagmiConfig.autoConnect();
    this.checkChangeRPC();
  }

  /**
   * Checks if connected RPC corresponds with BSC Mainnet
   */
  public async checkChangeRPC(): Promise<any> {
    const network = getNetwork();
    console.log('actual network:', network);
    if (network.chain) {
      if (chains[0].id === network.chain.id) {
        return true;
      } else {
        return await this.changeRPC();
      }
    }
  }

  /**
   * Changes the wallet connected chain to bsc
   */
  public async changeRPC(): Promise<any> {
    return new Promise(async () => {
      try {
        if (!this.changingNetwork) {
          this.changingNetwork = true;
          await switchNetwork({ chainId: chains[0].id });
          this.changingNetwork = false;
        }
      } catch (error: any) {
        console.error(error);
        this.changingNetwork = false;
        if (
          chains[0].id !== getNetwork().chain.id &&
          this.chainErrorPopUpIsClosed
        ) {
          this.openNetworkSwitchErrorPopUp();
        }
      }
    });
  }

  /**
   * Opens a pop up to show network switching error
   */
  openNetworkSwitchErrorPopUp(): any {
    this.chainErrorPopUpIsClosed = false;
    this.translate
      .get('popUp.switchChainNotSupportedError')
      .subscribe((text: string) => {
        const detail = getNetwork().chain.name + ' \u{2192} ' + chains[0].name;
        let dialog = this.dialogService.openRegularInfoDialog(
          'error',
          text,
          detail
        );
        dialog.afterClosed().subscribe(() => {
          this.chainErrorPopUpIsClosed = true;
        });
      });
  }

  /**
   * Sets token on metamask wallet
   * @param type the token type
   * @param address the token address
   * @param symbol the token symbol
   * @param decimals the token decimal amount
   * @param image the token image
   */
  async setTokenOnMetamask(
    type: string,
    address: string,
    symbol: string,
    decimals: string,
    image: string
  ): Promise<any> {
    const provider = Web3.givenProvider;
    provider.sendAsync(
      {
        method: 'wallet_watchAsset',
        params: {
          type, // Chain ERC20
          options: {
            address,
            symbol,
            decimals,
            image,
          },
        },
        id: Math.round(Math.random() * 100000),
      },
      (err, data) => {
        if (!err) {
          if (data.result) {
            console.log('Token added');
          } else {
            console.log(data);
          }
        } else {
          console.log(err.message);
        }
      }
    );
  }
}
