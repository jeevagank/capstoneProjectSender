const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis({ region: 'us-east-1' }); // Update region if necessary

function generateRandomData() {
  const makes = ['Toyota', 'Ford', 'Honda', 'BMW', 'Tesla'];
  const vehicleId = `V-${Math.floor(Math.random() * 10000)}`;
  const vehicleMake = makes[Math.floor(Math.random() * makes.length)];
  const vehicleSpeed = Math.floor(Math.random() * 150);
  const vehicleLongitude = (Math.random() * 180 - 90).toFixed(6);
  const vehicleLatitude = (Math.random() * 180 - 90).toFixed(6);
  
  return {
    vehicleId,
    vehicleMake,
    vehicleSpeed,
    vehicleLongitude,
    vehicleLatitude
  };
}

function blankEveryTenth(index, data) {
  if (index % 10 === 0) {
    for (let key in data) {
	    if (key !== 'vehicleId') {
      data[key] = '';
	}
    }
  }
  return data;
}

async function sendData() {
  for (let i = 0; i < 200; i++) {
    let data = generateRandomData();
    data = blankEveryTenth(i, data);

    const params = {
      Data: JSON.stringify(data),
      PartitionKey: data.vehicleId,
      StreamName: 'CapstoneKinesisDataStream'
    };

    try {
      await kinesis.putRecord(params).promise();
      console.log(`Data sent: ${JSON.stringify(data)}`);
    } catch (err) {
      console.error(err);
    }
  }
}

sendData();

