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
        console.log(`Added a new cert with id ${res.insertedId}`);

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

async function deleteData(client, data) {

    client.db("Serials").collection("Certificate").deleteOne({ SerialNum: data });
    client.db("Serials").collection("CertificateSerials").deleteOne({ SerialNum: data });


}

async function findData(client, Collection, data) {
    console.log(data.serial.toString);
    const res = await client.db("Serials").collection(Collection).findOne({serial: data.serial.toString()});
    console.log(res);
    return res;
}


async function main(){

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
        SerialNum: 123456
    }

    await addCertificate(client, cert);

    disconnect(client);

}

main();

