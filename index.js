const express = require('express')
const app = express()
const router = express.Router()
const cors = require('cors')
const port = 5000
const DB = require("./mongoConnector")
const ipfs = require("./ipfsModule")
const _ = require("lodash")
const { MerkleTree } = require('merkletreejs')
const keccak256 = require("keccak256");
const eth = require('ethers');

app.use(cors())

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

let leafdata = [
  [190550],
  [200],
  [300],
  [400],
  [500]
]

let tree = null
let root = null
let leaves = null

function genTree() {
  leaves = leafdata.map(x => eth.utils.solidityKeccak256(["uint256"], x))

  tree = new MerkleTree(leaves, keccak256, { sort: true })
  root = tree.getHexRoot()
  console.log("Root:");
  console.log(root)


  const leaf = eth.utils.solidityKeccak256(["uint256"], [190550])
  console.log("Leaf:")
  console.log(leaf.toString('hex'))

  const proof = tree.getProof(leaf)
  const hexproof = tree.getHexProof(leaf)
  console.log("Proof:")
  console.log(hexproof)

  console.log(tree.verify(proof, leaf, root)) // true

  console.log(tree.toString())

}

genTree()


const table = { 'value': root }

app.get('/', (req, res) => {
  res.send(table)
})


app.get('/proof/:serialNo', (req, res) => {
  var checkleaf = req.params.serialNo
  console.log("Leaf:")
  console.log(checkleaf.toString('hex'))

  const checkproof = tree.getProof(checkleaf)
  const checkhexproof = tree.getHexProof(checkleaf)
  console.log("Proof:")
  console.log(checkhexproof)
  let generatedProof = { 'proof': checkhexproof }
  console.log(tree.verify(checkproof, checkleaf, root)) // true
  res.send(generatedProof)
})

function addLeaf(q) {
  let newLeaf = [q]
  leafdata.push(newLeaf)
  genTree()
  console.log('New Root:' + root)
}

app.post('/add', (req, res) => {
  console.log('Got body:', req.body.serialNo)
  addLeaf(req.body.serialNo)
  res.send(root)
})


/* 

  - How it works -

  input: Reg number eg: 19BCE0971 or 19BCE0550
  
  output: VerifyData = {
    serial: 1234567,
    proofHash: <>,
    leafHash: <>
    CID: <>
    IPFSUrl: <>  
  }

  flow:
  
    - takes the RegNo
    - Fetches Serial number from DB
    - Gets the serial and verifies it on the merkle hash and generates a proof
    - Fetches the Cert JSON on the Db
    - Fetches the CID stored in the Db
    - Fetches the CertJSON stored in IPFS 
    - Compares them and outputs a boolean

*/

app.get("/verify/:serialNumber", async (req, res) => {


  let serialNumber = req.params.serialNumber;

  console.log("The serial number is:",serialNumber);
  
  serialNumber = parseInt(serialNumber);

  const client = await DB.connect();

  //getting serial data from serial Db
  const serialJSON = await DB.getSerialData(client, serialNumber);

  console.log("The serial number data is: ", serialJSON);

  //getting Certificate data
  const certJSON = await DB.getCert(client, serialJSON.serial);

  // getting the CID from DB
  const CID = await DB.GetCIDFromSerial(client, serialJSON.serial);

  // console.log(serialNumber);
  const checkproof = tree.getProof(serialNumber)
  const checkhexproof = tree.getHexProof(serialNumber)

  // getting proof
  // console.log("Proof:")
  console.log(checkhexproof)
  let generatedProof = { 'proof': checkhexproof };
  const ProofJSON = tree.verify(checkproof, serialNumber, root);

  // fetching cert from ipfs
  const Cert = await ipfs.fetchCert(CID)

  let verified = false
  delete certJSON['_id'];

  console.log("LOGS", Cert);
  console.log("LOGS 2", certJSON);
  console.log("LOGS 3", JSON.stringify(Cert) == JSON.stringify(certJSON));



  // comparing
  if (JSON.stringify(Cert) == JSON.stringify(certJSON)) {verified = true }
  

  // console.log(verified);

  let ResponseJSON = ''

  if (ProofJSON.proof == false) {
    ResponseJSON = {

      err: "PROOF_ERR",
      descr: "The Proof for the leaf is not true"

    }

  }
  else if (verified) {
    ResponseJSON = {

      serial: serialJSON.serial,
      proofHash: generatedProof,
      leafHash: checkhexproof,
      CID,
      verified,
      IPFSUrl: `https://cloudflare-ipfs.com/ipfs/${CID}`

    }
  }
  else if (!verified) {

    ResponseJSON = {

      err: "CERT_ERR",
      descr: "The Certificates stored on IPFS and Db Are not same"

    }

  }


  console.log("Response: ", ResponseJSON);

  res.send(ResponseJSON);



  // foo(serialNumber);

})


const CompareCert = (cert1, cert2) => {

  return (cert1.Name == cert2.Name 
          && cert1.RegistrationNumber == cert2.RegistrationNumber
          && cert1.DegreeName == cert2.DegreeName
          && cert1.YearOfStudy == cert2.YearOfStudy
          && cert1.School == cert2.School
          && cert1.University == cert2.University)
          return cert1.SerialNum == cert2.SerialNum;

}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})