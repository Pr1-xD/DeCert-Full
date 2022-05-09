const express = require('express')
const app = express()
const router = express.Router()
const cors = require('cors')
const port = 5000
const db = require("./mongoConnector")
const ipfs = require("./ipfsModule")

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

app.post("/verify/:serialNumber", (req, res) => {

  const client = db.connect();
  let serialNumber = req.params.serialNumber;

  //getting serial data from serial Db
  const serialJSON = db.getSerialData(client, serialNumber);

  //getting Certificate data
  const certJSON = db.getCert(client, serialJSON.serial);

  // getting the CID from DB
  const CID = db.GetCIDFromSerial(client, serialJSON.serial);

  console.log(serialNumber);
  const checkproof = tree.getProof(serialNumber)
  const checkhexproof = tree.getHexProof(serialNumber)

  // getting proof
  console.log("Proof:")
  console.log(checkhexproof)
  let generatedProof = { 'proof': checkhexproof };
  const ProofJSON  = tree.verify(checkproof, serialNumber, root);

  // fetching cert from ipfs
  const Cert = ipfs.fetchCert(CID)

  // comparing
  if (JSON.stringify(Cert) == JSON.stringify(certJSON)) { const verified = true }
  else { const verified = false }



  if(ProofJSON.proof == false) {
    const ResponseJSON = {

      err: "PROOF_ERR",
      descr: "The Proof for the leaf is not true"

    }

  }
  else if (verified) {
    const ResponseJSON = {

      serial: serialJSON.serial,
      proofHash: generatedProof,
      leafHash: checkhexproof,
      CID,
      IPFSUrl: `https://cloudflare-ipfs.com/ipfs/${CID}`

    }
  }
  else if (!verified){

    const ResponseJSON = {

      err: "CERT_ERR",
      descr: "The Certificates stored on IPFS and Db Are not same"

    }

  }

  
  res.send(ResponseJSON);


})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})