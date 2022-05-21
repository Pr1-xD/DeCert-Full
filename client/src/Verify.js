import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios' 
import QRCode from "react-qr-code";

function Verify({accounts,setAccounts}) {
    let params = useParams()
    let serialNo=params.SerialNumber
    const [ipfsLink,setIpfsLink]=useState(null)

    axios.get('http://localhost:5000/verify/'+params.SerialNumber)
    .then(res=>{
      console.log(res)
    })




    return (
        <div>
            Verify:{params.SerialNumber}
            <QRCode value={"http://localhost:3000/"+params.SerialNumber} />
        </div>
    );
}

export default Verify;