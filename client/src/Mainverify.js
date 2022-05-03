import React,{useState, useEffect} from 'react';
import axios from 'axios'


function Mainverify(props) {

const [data,setData]=useState(null)
let serialNo=190550
let leafToAdd=190551


  useEffect(()=>{
    axios.get('http://localhost:5000')
    .then(res => {
    console.log(res)
    setData(res.data)})
  },[])

  function getProof(){
    console.log(serialNo)
    axios.get('http://localhost:5000/proof/'+serialNo)
    .then(res=>{
      console.log(res)
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
            <button onClick={addLeaf}>Add Leaf</button>
        </div>
    );
}

export default Mainverify;