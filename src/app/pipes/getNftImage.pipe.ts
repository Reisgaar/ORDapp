import { Pipe, PipeTransform } from '@angular/core';
import { ConnectionService } from '../shared/services/connection/connection.service';
// ABI
import { default as ERC721 } from 'src/app/shared/contracts/nft/ERC721.json';
import { UtilsService } from '../shared/services/utils.service';

interface GetNftImagePipeData {
  nftContractAddress: string;
  tokenId: number;
}

/**
 * Pipe to get NFT image
 */
@Pipe({name: 'getNftImage'})
export class GetNftImagePipe implements PipeTransform {

  constructor(
    private connectionService: ConnectionService
    ) {}

  /**
   * Gets the image of the given NFT (address + tokenId)
   * @param {GetNftImagePipeData} data : nftContractAddress and tokenId
   * @returns {string} : image url
   */
  async transform(data: GetNftImagePipeData): Promise<string> {
    try {
      const tokenURI = await this.connectionService.readContract(data.nftContractAddress, ERC721.abi, 'tokenURI', [data.tokenId]);
      console.log(tokenURI);
      const parsedMetadata = await fetch(tokenURI).then((response) => response.json());
      console.log(parsedMetadata);
      return parsedMetadata.image320 ? parsedMetadata.image320 : parsedMetadata.image;
    } catch (error) {
      console.log(error)
      return '';
    }
  }
}
