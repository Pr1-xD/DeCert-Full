import React, { useState } from 'react';
import { useParams } from "react-router-dom";

function Verify({accounts,setAccounts}) {
    let params = useParams()
    let serialNo=params.SerialNumber
    const [ipfsLink,setIpfsLink]=useState(null)
   


    return (
        <div>
            Verify:{params.SerialNumber}
        </div>
    );
}

export default Verify;