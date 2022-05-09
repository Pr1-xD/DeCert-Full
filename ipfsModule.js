const pinataSDK = require('@pinata/sdk');
const axios = require("axios");
const fs = require("fs")
const FormData = require('form-data');
const basePathConverter = require('base-path-converter');

const PbKey = '6e3f442a72a2a24b8bb7';
const Skey = '9f5bc94418ec9d327295260f8e2d9c5ad83f454834cd4d0cc2cd59a5c06e9cad';

const pinata = pinataSDK(PbKey, Skey);

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});


const StoreOnIPFS = (cert, pinataApiKey = PbKey, pinataSecretApiKey = Skey) => {

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const src = "Certs"
    let data = new FormData();
    data.append('file', fs.createReadStream('./ada_lovelace.jpg'), {
        filepath: basePathConverter(src, "./1.jpg")
    });

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({

        name: 'Cert1',
        keyvalues: {
            exampleKey: 'QmZHG8C1rBsekjJBDteTcYTrPtNn3dCFt3TJVAFG7z81Be'
        }

    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({

        cidVersion: 0,
        
        wrapWithDirectory: true,
        
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }

    });

    data.append('pinataOptions', pinataOptions);

    return axios.post(url, data, {

            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
           
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }

        })
        .then(function (response) {
            console.log("File successfully uploadded!");
        })
        .catch(function (error) {
            console.error(error);
        });
};


async function fetchCert(hash) {

    const uri = `https://cloudflare-ipfs.com/ipfs/${hash}`
    // const res =  await axios.get(uri);

    axios.get(uri)
        .then((response) => {

            console.log(response.data);

            this.setState({
                Name: response.data.email,
                SerialNum: response.data.password
            })
        })
        .catch((err) => { })
}



const cert = {
    Name: "Priyanshu",
    RegistrationNumber: "19BCE0550",
    DegreeName: "Bachelor of Technology",
    YearOfStudy: "2019",
    School: "School of Computer Science and Engineering",
    University: "Vellore institute of Technology",
    SerialNum: 123457
}

StoreOnIPFS(cert);

// console.log(fetchCert("QmdDd9SPqumgVg9ndG8H6tAUg4fUW6J3ghuRiXnTjzgbyn"));

// you can access your ipfs data by using: https://cloudflare-ipfs.com/ipfs/<hash-value>

