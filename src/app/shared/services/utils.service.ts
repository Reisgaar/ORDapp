import { Injectable } from '@angular/core';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from './connection/connection.service';

/**
 * Service to manage uncategorized multiple uses functions
 */
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private connectionService: ConnectionService
  ) { }

  /**
   * Gets a number to indicate the image associated, first number of the address
   * @param wallet : wallet address
   * @returns number 0-9
   */
  getWalletImage(wallet: any): number {
    let imageNum = 0;
    for (let i = 1; i < wallet.length; i++) {
      if (!isNaN(wallet.charAt(i))) {
        imageNum = parseInt(wallet.charAt(i), 0);
        break;
      }
    }
    return imageNum;
  }

  /**
   * Gets the price on BUSD of an amount of certain ERC20 token
   * @param amount : amount to convert
   * @param erc20Token : address of token
   * @returns : converted amount
   */
  async getPriceOnBusd(amount: string | number, erc20Token: string): Promise<number> {
    const pricesOnBusd: {[index: string]:any} = {
      [contractAddresses.bnb.toLowerCase()]: bnbPriceOnBusd[0],
      [contractAddresses.busd.toLowerCase()]: 1,
      [contractAddresses.gq.toLowerCase()]: gqPriceOnBusd[0]
    };
    if (typeof amount !== 'string') {
      amount = amount.toLocaleString('en', {useGrouping: false} );
    }
    const price = this.connectionService.fromWei(amount);
    return parseFloat(price) * pricesOnBusd[erc20Token.toLowerCase()];
  }

  /**
   * Pauses a process indicated miliseconds
   * @param ms : miliseconds to sleep
   * @returns : promise to continue process
   */
  sleep(ms: any): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Parse metadata of each NFT of the array
   * @param data : NFT array from the query
   * @returns {Array} : The array  with procesed NFT
   */
  async parseMetadata(data: Array<any>): Promise<Array<any>> {
    const newArray = [];
    for (let nft of data) {
      try {
        const metadata = {
          ...nft,
          ...JSON.parse(nft.metadata.uriString)
        };
        // If Land NFT, get metadata info
        if (nft.nftContractAddress && nft.nftContractAddress.toLowerCase() === contractAddresses.land.toLowerCase()) {
          metadata.size = metadata.attributes.find((item: any) => item.trait_type.toLowerCase() === 'size').value;
          metadata.ring = metadata.attributes.find((item: any) => item.trait_type.toLowerCase() === 'ring').value;
          metadata.sector = metadata.attributes.find((item: any) => item.trait_type.toLowerCase() === 'sector').value;
          metadata.district = metadata.attributes.find((item: any) => item.trait_type.toLowerCase() === 'district').value;
        }
        if (nft.nftOn && nft.nftOn.toLowerCase() === 'wallet') {
          metadata.tokenId = parseInt(nft.id, 16);
        }
        newArray.push(metadata);
      } catch (error: any) {
        console.error('Error parsing NFT');
        console.log(nft);
      }
    }
    return newArray;
  }

  /**
   * Parse the uri of the NFT metadata
   * @param {Array<any>} data : array of NFTs
   * @returns : the processed array
   */
  async parseTokenURI(data: Array<any>): Promise<any> {
    const newArray = [];
    for (let nft of data) {
      try {
        const parsedURI = await fetch(nft.fullTokenURI).then((response) => response.json());
        const metadata = {
          ...nft,
          ...parsedURI
        };
        if (nft.nftContractAddress.toLowerCase() === contractAddresses.land) {
          metadata.size = metadata.attributes.find((item: any) => item.trait_type.toLowerCase() === 'size').value;
        }
        metadata.type = nft.type;
        newArray.push(metadata);
      } catch (error: any) {
        console.error('Error parsing NFT');
        console.log(nft);
      }
    }
    return newArray;
  }

}
