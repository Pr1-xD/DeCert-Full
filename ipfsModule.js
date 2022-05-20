const pinataSDK = require('@pinata/sdk');
const axios = require("axios");
const fs = require("fs")
const FormData = require('form-data');
const basePathConverter = require('base-path-converter');
const { response } = require('express');

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

    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, cert, {
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        })
        .then(function (response) {
            console.log("file uploaded succesfully!");
        })
        .catch(function (error) {
            console.error(error);
        });

};


async function fetchCert(hash) {

    const uri = `https://gateway.pinata.cloud/ipfs/${hash}`
    const res = await axios.get(uri);
    const data = res.data;
    return data;

}

module.exports = {
    fetchCert
}


const cert = {
    Name: "Aashish",
    RegistrationNumber: "19BCE0971",
    DegreeName: "Bachelor of Technology",
    YearOfStudy: "2019",
    School: "School of Computer Science and Engineering",
    University: "Vellore institute of Technology",
    serial: 123456
}

StoreOnIPFS(cert);


// you can access your ipfs data by using: https://cloudflare-ipfs.com/ipfs/<hash-value>

