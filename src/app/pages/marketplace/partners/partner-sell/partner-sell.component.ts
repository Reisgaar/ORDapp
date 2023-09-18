import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { partners } from 'src/app/constants/partnerships';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { Apollo } from 'apollo-angular';
import { getPartnerNftOnAuction, getPartnerNftOnSale, getPartnerNftOnWallet } from 'src/app/constants/gqlQueries';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

/**
 * Main page of partner marketplace
 */
@Component({
  selector: 'app-partner-sell',
  templateUrl: './partner-sell.component.html',
  styleUrls: ['./partner-sell.component.scss']
})
export class PartnerSellComponent implements OnInit, OnDestroy {
  partnerInput: string = '';
  partner: any;
  partnerData: any;
  loadingData: any = { wallet: false, sale: false, auction: false };
  userNfts: any = {
    wallet: [],
    sale: [],
    auction: []
  };
  subscriptions: any = {
    wallet: [],
    sale: [],
    auction: []
  };
  selectedTab: string = 'sales';

  constructor(
    private activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private apollo: Apollo,
    private utilsService: UtilsService,
    private dialogService: DialogService
  ) {
    this.activatedRoute.queryParams.subscribe( (params: any) => {
      if (params.partner) {
        this.partnerInput = params.partner;
        this.partnerData = partners[this.partnerInput];
        console.log(this.partnerData);
      }
    });
    this.partner = partners[this.partnerInput];
  }

  /**
   * Gets the NFT list
   */
  ngOnInit(): void {
    this.getNftList();
    if (this.partner.name.toLowerCase() === 'baskonia' || this.partner.name.toLowerCase() === 'alaves') {
      this.selectedTab = 'auctions';
    }
  }

  /**
   * Unsubscribe all subscriptions
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions.wallet) { sub.unsubscribe(); }
    for (const sub of this.subscriptions.sale) { sub.unsubscribe(); }
    for (const sub of this.subscriptions.auction) { sub.unsubscribe(); }
  }

  /**
   * Get the NFT list of the partner marketplace (sales, auctions and user's)
   */
  async getNftList(): Promise<void> {
    this.loadingData = { wallet: true, sale: true, auction: true };
    await this.utilsService.sleep(2000);
    await this.getPartnerNFT('sale', getPartnerNftOnSale, this.partnerData.nfts, '');
    await this.getPartnerNFT('auction', getPartnerNftOnAuction, this.partnerData.nfts, '');
    this.getWalletNft();
  }

  /**
   * Gets the NFTs of a wallet
   */
  async getWalletNft(): Promise<any> {
    let int: any;
    int = setInterval(async () => {
      try {
        let userAddress = '';
        userAddress = this.connectionService.getWalletAddress();
        if (userAddress !== '') {
          await this.getPartnerNFT('wallet', getPartnerNftOnWallet, this.partnerData.nfts, userAddress);
        }
        clearInterval(int);
      } catch (error: any) { }
    }, 1000);
  }

  /**
   * Subscribe to diferent queries to get NFTs
   * @param {string} where : sale, auction or wallet
   * @param {any} query : query to use for the subscription
   * @param {Array<string>} nftContractAddress : array of strings with the partners NFTs addresses
   * @param {string} userAddress : wallet of the user
   */
  async getPartnerNFT(where: string, query: any, nftContractAddress: Array<string>, userAddress: string): Promise<any> {
    userAddress = userAddress.toLowerCase();
    nftContractAddress = nftContractAddress.map(name => name.toLowerCase());
    const nftQuery = this.apollo.use('partners').watchQuery({
      query,
      pollInterval: 3000,
      variables: {
        nftAddresses: nftContractAddress,
        wallet: userAddress
      }
    });
    this.subscriptions[where].push(
      nftQuery.valueChanges.subscribe(async (res: any) => {
        const data = res.data.response;
        if (data.length > 0 && where === 'wallet') {
          this.userNfts[where] = await this.pushNftsToArray(where, data[0].nfts);
        } else if (data.length > 0 && where !== 'wallet') {
          this.userNfts[where] = await this.pushNftsToArray(where, data);
        } else  {
          this.userNfts[where] = [];
        }
        this.loadingData[where] = false;
        console.log(this.userNfts);
      })
    );
  }

  /**
   *
   * @param {string} where : sale, auction or wallet
   * @param {Array<any>} nfts : array with the NFTs from the query
   * @returns {Array<any>} : the array after being processed
   */
  async pushNftsToArray(where: string, nfts: Array<any>): Promise<Array<any>> {
    let newArray = [];
    for (const nft of nfts) {
      if (!this.userNfts[where].some( (item: any) => item.tokenId === nft.tokenId && item.nftContractAddress.toLowerCase() === nft.nftContractAddress.toLowerCase())) {
        try {
          let data = await this.parseStringMetadataJson(nft);
          if (data === '') {
            data = await this.parseUriMetadataJson(nft);
          }
          data.tokenId = nft.tokenId;
          data.nftContractAddress = nft.nftContractAddress;
          newArray.push(data);
        } catch (error: any) { }
      } else {
        const item = this.userNfts[where].find( (item: any) => item.tokenId === nft.tokenId && item.nftContractAddress.toLowerCase() === nft.nftContractAddress.toLowerCase());
        if (item){
          newArray.push(item);
        }
      }
    }
    return newArray;
  }

  /**
   * Parse the metadata field to json format
   * @param {any} nft : object with the NFT data
   * @returns the NFT data processed
   */
  async parseStringMetadataJson(nft: any): Promise<any> {
    let data: any;
    if (nft.metadata) {
      data =  {
        ...JSON.parse(nft.metadata.uriString),
        ...nft
      };
    } else {
      data = '';
    }
    return data;
  }

  /**
   * Parses the metadata uri to json format
   * @param {any} nft : object with the NFT data
   * @returns : the NFT data processed
   */
  async parseUriMetadataJson(nft: any): Promise<any> {
    let data: any;
    if (nft.fullTokenURI) {
      data = await fetch(nft.fullTokenURI).then((response) => response.json());
    } else if (nft.tokenURI) {
      data = {
        ...await fetch('https://gateway.pinata.cloud/ipfs/' + nft.tokenURI).then((response) => response.json()),
        ...nft
      };
    } else {
      data = {};
    }
    return data;
  }

  /**
   * Changes the selected tab on the view
   * @param {string} newSelection : selected tab to change to
   */
  chageSelectedTab(newSelection: string): void {
    this.selectedTab = newSelection;
  }

  /**
   * Opens Baskonia FAQ pop up
   */
  showBaskoniaFAQ(): void {
    this.dialogService.openBaskoniaDialog();
  }

}
