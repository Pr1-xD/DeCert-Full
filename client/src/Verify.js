import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios' 
import QRCode from "react-qr-code";

function Verify({accounts,setAccounts}) {
    let params = useParams()
    let serialNo=params.SerialNumber
    const [ipfsLink,setIpfsLink]=useState(null)

    function verifySerial(){
        axios.get('http://localhost:5000/verify/'+params.SerialNumber)
    .then(res=>{
      console.log(res)
      console.log(res.data.IPFSUrl)
      setIpfsLink(res.data.IPFSUrl)
    })
    }
    function redirectToIPFS(){
        window.location.href=ipfsLink
    }




    return (
        <div class="container">
            <br/>
            <br/>
            <br/>
            <div class="row">
            <div class="col-sm align-self-center font-weight-bold">
            <h4>Serial Number: {params.SerialNumber}</h4>
            </div>
            <div class="col-sm">
            <h4>QR Code: </h4>
            <QRCode value={"http://localhost:3000/"+params.SerialNumber} />
            </div>
            <div class="col-sm align-self-center">
            <button class="btn btn-primary" onClick={verifySerial}>Verify</button>
            </div>
            </div>
            <br/>
            <br/>
            <br/>
            <div class="text-center">
                {ipfsLink?<h3>Result: </h3>:<></>}
                {ipfsLink?<h3>Verified</h3>:<></>}
                {ipfsLink?<h3 onClick={redirectToIPFS}>Click to View</h3>:<></>}
            </div>
        </div>
    );
}

export default Verify;