import React,{useState, useEffect} from 'react';
import axios from 'axios'
import {ethers, BigNumber} from 'ethers'
import certVerify from './CertVerify.json'

const certVerifyAddress = "0x0FDd16057927e32FC171531a079e4DD379651D9A"

// input field
// solidity connect
// check owner
// 0x0FDd16057927e32FC171531a079e4DD379651D9A


function Mainverify({accounts,setAccounts}) {

const [data,setData]=useState(null)
const [leaf,setLeaf]=useState(null)
const [proof,setProof]=useState(null)
const isConnected = Boolean(accounts[0])

async function changeRoot(){
  if(window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      certVerifyAddress,
      certVerify.abi,
      signer
    )
    try{
      const response = await contract.setRoot(data)
      console.log(response)
    } catch(err){
      console.log(err)
    }
  }
}

async function handleVerify(){
  setLeaf(ethers.utils.solidityKeccak256(["uint256"], [190550]))
  console.log(leaf)
  console.log(proof)
  getProof()
  // setProof(["0x975c2ff2d88bb33eba87988c482ba1a11cee273451aa76eb28acc668585ac527",
  //           "0xaf371023250d72e8fc72fcbdb534fb82f93bd51bc7faf38abcc4f0d08077add0",
  //           "0xe71fac6fb785942cc6c6404a423f94f32a28ae66d69ff41494c38bfd4788b2f8"])
  if(window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      certVerifyAddress,
      certVerify.abi,
      signer
    )
    try{
      const response = await contract.verify(leaf,proof)
      console.log(response)
    } catch(err){
      console.log(err)
    }
  }
}

let serialNo=190550
let leafToAdd=190551


  useEffect(()=>{
    axios.get('http://localhost:5000')
    .then(res => {
    console.log(res)
    setData(res.data.value)})
  },[])

  function getProof(){
    console.log(serialNo)
    axios.get('http://localhost:5000/proof/'+serialNo)
    .then(res=>{
      console.log(res)
      setProof(res.data.proof)
    })
  }

  function addLeaf(){
    axios.post('http://localhost:5000/add', {
        serialNo: leafToAdd
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

    return (
        <div>
            <p>Hi</p>
            <button onClick={getProof}>Get Proof</button>
            <button onClick={console.log(data)}>Check Data</button>
            <button onClick={addLeaf}>Add Leaf</button>
            <button onClick={changeRoot}>Change Root</button>
            <button onClick={handleVerify}>Change Root</button>
            {/* <Verify proof={proof} leaf={leaf}/> */}
        </div>
    );
}

export default Mainverify;