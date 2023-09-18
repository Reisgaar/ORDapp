import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Service to manage uploading files to ipfs
 */
@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  pak = environment.pak;
  pask = environment.pask;

  axios = require('axios');

  constructor() { }

  /**
   * Uploads an image to ipfs
   * @param image : image to upload
   * @returns : the uri of the uploaded image
   */
  async uploadImage(image: any): Promise<string> {
    if (image) {
      console.log(image);
      let imgUri = '';
      const formData = new FormData();
      formData.append('file', image);
      const resFile = await this.axios({
          method: 'post',
          url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
          data: formData,
          headers: {
            'pinata_api_key': this.pak,
            'pinata_secret_api_key': this.pask,
            'Content-Type': 'multipart/form-data'
          },
      });
      imgUri = 'https://outerringgovernance.mypinata.cloud/ipfs/' + resFile.data.IpfsHash;
      console.log(imgUri);
      return imgUri;
    } else {
      return '';
    }
  }

  /**
   * Uploads a json to ipfs
   * @param file : json to upload
   * @returns : the uri of the uploaded json
   */
  async uploadJson(file: any): Promise<string> {
    let jsonUri = '';
    const preData = {
      pinataMetadata: {
        name: 'proposal_' + Date.now().toString()
      },
      pinataContent: file
    };
    const data = JSON.stringify(preData);
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    await this.axios.post(
      url,
      data,
      {
        maxContentLength: 'Infinity',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.pak,
          'pinata_secret_api_key': this.pask
        }
      }
    ).then((res: any) => {
      jsonUri = 'https://outerringgovernance.mypinata.cloud/ipfs/' + res.data.IpfsHash;
      console.log(jsonUri);
    });
    return jsonUri;
  }
}
