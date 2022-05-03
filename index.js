const express = require('express')
const app = express()
const router= express.Router()
const cors = require('cors')
const port = 5000

const { MerkleTree } = require('merkletreejs')
const keccak256= require("keccak256");
const eth= require('ethers');

app.use(cors())

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

let leafdata=[
  [190550],
  [200],
  [300],
  [400],
  [500]
]

let tree=null
let root=null
let leaves=null

function genTree(){
  leaves = leafdata.map(x => eth.utils.solidityKeccak256(["uint256"], x))

  tree = new MerkleTree(leaves,keccak256,{sort:true})
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


const table={'value':root}

app.get('/', (req, res) => {
  res.send(table)
})


app.get('/proof/:serialNo', (req, res) => {
  var checkNo =req.params.serialNo 
  console.log(checkNo) 
  const checkleaf = eth.utils.solidityKeccak256(["uint256"], [checkNo])
  console.log("Leaf:")
  console.log(checkleaf.toString('hex'))

  const checkproof = tree.getProof(checkleaf)
  const checkhexproof = tree.getHexProof(checkleaf)
  console.log("Proof:")
  console.log(checkhexproof)
  let generatedProof={'proof':checkhexproof}
  console.log(tree.verify(checkproof, checkleaf, root)) // true
  res.send(generatedProof)
})

// function sqlQuery(q){
//   connection.connect(function(err) {
//     connection.query(q, function (err, result) {
//       if (err) throw err;
//       console.log(result);
//       console.log('Updated');
//     });
// });  
// }

function addLeaf(q){
  let newLeaf=[q]
  leafdata.push(newLeaf)
  genTree()
  console.log('New Root:'+root)
}

app.post('/add', (req, res)=> {
  console.log('Got body:', req.body.serialNo)
  addLeaf(req.body.serialNo)
  res.sendStatus(200)
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})