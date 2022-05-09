/* 

    The format of data uploaded on the Db

    - CertificateSerials Collection -

    const serial = {
        index: 0,
        serial: 123456
    }


    - Certificate Collection -

    const cert = {
        Name: "Aashish",
        RegistrationNumber: "19BCE0971",
        DegreeName: "Bachelor of Technology",
        YearOfStudy: "2019",
        School: "School of Computer Science and Engineering",
        University: "Vellore institute of Technology",
        SerialNum: 123456
    }

    - SerialCID - 

    const SerialCID = {
        serial = 123456,
        CID = "QmdDd9SPqumgVg9ndG8H6tAUg4fUW6J3ghuRiXnTjzgbyn"
    }

*/




const { MongoClient } = require("mongodb");

async function connect() {

    const uri = "mongodb+srv://admin:admin@cluster0.g2fut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {

        await client.connect();
        await listDatabases(client);
    }
    catch (e) {

        console.error(e);

    }

    return client

}

async function disconnect(client) {
    await client.close();
}


async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function addSerial(client, Serial) {

    const result = true

    console.log(result);

    if (result) {

        const res = await client.db("Serials").collection("CertificateSerials").insertOne(Serial);
        console.log(`Added a new Serial with id ${res.insertedId}`);

    }
    else {

        console.log(`The id ${Serial.serial} is already in the database`);

    }
}

/*

Certificate will have the following data:
    
    - Name
    - RegistrationNumber
    - DegreeName
    - YearOfStudy
    - School
    - University
    - IssuingDate
    - SerialNum

*/


async function addCertificate(client, Cert) {

    const result = true

    if (result) {
        const res = await client.db("Serials").collection("Certificate").insertOne(Cert);
        console.log(`Added a new cert with id ${res.insertedId}`);
    }
    else {
        console.log(`The Cerificate of ${Cert.RegistrationNumber} already exists`);
    }


}

/* 

This stores it in form of Serial number and it's CID
    
    - Serial Number
    - CID

    Collection Name: SerialCID

    The collection hosts a number of entires that have cid mapped to them so that they can be further used to fetch the
    data uploaded on ipfs

*/

async function AddSerialToCID(client, data) {

    const result = true // TODO: to make it so that serial number is a unique entry.

    if (result) {
        const res = await client.db("Serials").collection("SerialCID").insertOne(data);
        console.log(`Added a new serial with id ${res.insertedId}`);
    }
    else {
        console.log(`The CID of ${data.serial} already exists`);
    }


}

// This should return a string of the serial number 
async function GetCIDFromSerial(client, serialNumber) {

    // console.log(data.serial.toString);
    const res = await client.db("Serials").collection("SerialCID").findOne({ serial: serialNumber });
    console.log(res);
    return res.CID;


}

async function getCert(client, serialNumber) {

    // console.log(data.serial.toString);
    const res = await client.db("Serials").collection("Certificate").findOne({ serial: serialNumber });
    console.log(res);
    return res;


}

async function deleteData(client, data) {

    client.db("Serials").collection("Certificate").deleteOne({ SerialNum: data });
    client.db("Serials").collection("CertificateSerials").deleteOne({ SerialNum: data });


}

async function getSerialData(client, serialNumber) {

    // console.log(data.serial.toString);
    const res = await client.db("Serials").collection("CertificateSerials").findOne({ serial: serialNumber });
    console.log(res);
    return res;


}


async function main() {

    const client = await connect();
    const serial = {
        index: 0,
        serial: 123456
    }
    await addSerial(client, serial);

    const cert = {
        Name: "Aashish",
        RegistrationNumber: "19BCE0971",
        DegreeName: "Bachelor of Technology",
        YearOfStudy: "2019",
        School: "School of Computer Science and Engineering",
        University: "Vellore institute of Technology",
        serial: 123456
    }

    await addCertificate(client, cert);

    const SerialCID = {
        serial: 123456,
        CID: "QmdDd9SPqumgVg9ndG8H6tAUg4fUW6J3ghuRiXnTjzgbyn"
    }

    AddSerialToCID(client, SerialCID);

    const cid = await GetCIDFromSerial(client, 123456) 

    console.log(cid);

    const cert_1 =  await getCert(client, 123456);

    disconnect(client);

}

// main();

module.exports.connect = connect;
module.exports.disconnect = disconnect;
module.exports.GetCIDFromSerial = GetCIDFromSerial;
module.exports.getSerialData = getSerialData;
module.exports.findData = findData;
module.exports.getCert = getCert;
module.exports.deleteData = deleteData;


