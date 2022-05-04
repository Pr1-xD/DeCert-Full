import React,{useState, useEffect} from 'react';
import axios from 'axios'
import {ethers, BigNumber} from 'ethers'
import certVerify from './CertVerify.json'

const certVerifyAddress = "0x0FDd16057927e32FC171531a079e4DD379651D9A"

// input field
// link wallet check
// check owner
// 0x0FDd16057927e32FC171531a079e4DD379651D9A


function Mainverify({accounts,setAccounts}) {

const [data,setData]=useState(null)
const [leaf,setLeaf]=useState(null)
const [inputleaf,setInputLeaf]=useState(null)
const [newRoot,setNewRoot]=useState(null)
const [proof,setProof]=useState(null)
const [inputSerialNo,setInputSerialNo]=useState(null)
const isConnected = Boolean(accounts[0])

let serialNo=190551


//useEffect

useEffect(() => {
  if(inputSerialNo)
  addLeaf(); // This is be executed when the state changes
}, [inputSerialNo]);

useEffect(() => {
  if(newRoot){
  console.log('Calling Contract with new root '+newRoot)
  addLeafContractCall();} // This is be executed when the state changes
}, [newRoot]);

useEffect(() => {
  if(leaf){
  console.log('Getting Proof for '+leaf)
  getProof();} // This is be executed when the state changes
}, [leaf]);

useEffect(() => {
  if(inputleaf){
  console.log('Getting leaf for '+inputleaf)
  setLeaf(ethers.utils.solidityKeccak256(["uint256"], [inputleaf]));} // This is be executed when the state changes
}, [inputleaf]);

useEffect(() => {
  if(proof){
  console.log('Checking Solidity Contract for '+leaf)
  handleVerify();} // This is be executed when the state changes
}, [proof]);

useEffect(()=>{
  axios.get('http://localhost:5000')
  .then(res => {
  console.log('Data '+res.data.value)
  setData(res.data.value)})
},[])

function addLeafContract(event){
  event.preventDefault();
  setInputSerialNo(document.getElementById("newLeaf").value)
  console.log(document.getElementById("newLeaf").value)
}

function addLeaf(){
  console.log(inputSerialNo)
  axios.post('http://localhost:5000/add', {
      serialNo: inputSerialNo
    })
    .then(function (response) {
      console.log(response)
      setNewRoot(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function addLeafContractCall(){
  if(window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      certVerifyAddress,
      certVerify.abi,
      signer
    )
    try{
      const response = await contract.setRoot(newRoot)
      console.log(response)
      setData(newRoot)
      setNewRoot(null)
    } catch(err){
      console.log(err)
    }
  }
}

function handleVerifyClick(event){
  event.preventDefault();
  setInputLeaf(document.getElementById("checkLeaf").value)
  // setLeaf(ethers.utils.solidityKeccak256(["uint256"], [document.getElementById("newLeaf").value]))
  
}

async function handleVerify(){
  console.log(leaf)
  console.log(proof)
  // getProof()
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
      setInputLeaf(null)
      setLeaf(null)
      setProof(null)
    } catch(err){
      console.log(err)
    }
  }
}

  function getProof(){
    axios.get('http://localhost:5000/proof/'+leaf)
    .then(res=>{
      console.log(res)
      setProof(res.data.proof)
    })
  }



    return (
        <div class="container mx-auto my-auto text-center"> 
        <br></br><br></br><br></br>
            {isConnected?<p>Hi</p>:<></>}
            {/* <button onClick={getProof}>Get Proof</button> */}
            <button class="btn btn-primary mx-auto m-3" onClick={addLeaf}>Add Leaf</button> <br></br>
            <button class="btn btn-primary mx-auto m-3" onClick={addLeafContract}>Change Root</button><br></br>
            <button class="btn btn-primary mx-auto m-3" onClick={handleVerify}>Verify</button>
            
            <form class="form-inline">
            <div class="form-group mx-sm-3 mb-2">
              <input type="text" class="form-control" id="newLeaf" placeholder="Serial Number"/>
            </div>
            <button onClick={(e)=>{addLeafContract(e)}} class="btn btn-primary mb-2">Add</button>
          </form>

            <form class="form-inline">
            <div class="form-group mx-sm-3 mb-2">
              <input type="text" class="form-control" id="checkLeaf" placeholder="Serial Number"/>
            </div>
            <button onClick={(e)=>{handleVerifyClick(e)}} class="btn btn-primary mb-2">Verify</button>
          </form>

        </div>
    );
}

export default Mainverify;