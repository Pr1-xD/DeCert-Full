const pinataSDK = require('@pinata/sdk');
const axios = require("axios");
const fs = require("fs")
const pinata = pinataSDK('6e3f442a72a2a24b8bb7', '9f5bc94418ec9d327295260f8e2d9c5ad83f454834cd4d0cc2cd59a5c06e9cad');

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

async function StoreOnIPFS(Certificate, MyCustomName, Key1, Key2, uploadOptions = false) {

    const body = Certificate;

    if (uploadOptions) {

        const options = {
            pinataMetadata: {
                name: MyCustomName,
                keyvalues: {
                    customKey: Key1,
                    customKey2: Key2
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };

    }

    if (uploadOptions) {

        pinata.pinJSONToIPFS(body, options).then((result) => {
            //handle results here
            console.log(result);
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
    }
    else {

        pinata.pinJSONToIPFS(body).then((result) => {
            //handle results here
            console.log(result);
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
    }

}

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

StoreOnIPFS(cert, "MyDegree_1", 0, 0);

// console.log(fetchCert("QmdDd9SPqumgVg9ndG8H6tAUg4fUW6J3ghuRiXnTjzgbyn"));

// you can access your ipfs data by using: https://cloudflare-ipfs.com/ipfs/<hash-value>

