const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis({ region: 'us-east-1' });

function getRandomValue() {
  return Math.random().toString(36).substring(7);
}

function getRandomSpeed() {
  return Math.floor(Math.random() * 100);
}

function getRandomCoordinate() {
  return (Math.random() * 180 - 90).toFixed(6);
}

function generateVehicleData() {
  const data = [];
  for (let i = 1; i <= 200; i++) {
    data.push({
      vehicleId: i % 10 === 0 ? '' : `ID-${i}`,
      vehicleMake: i % 10 === 0 ? '' : getRandomValue(),
      vehicleSpeed: i % 10 === 0 ? '' : getRandomSpeed(),
      vehicleLongitude: i % 10 === 0 ? '' : getRandomCoordinate(),
      vehicleLatitude: i % 10 === 0 ? '' : getRandomCoordinate(),
    });
  }
  return data;
}

function sendToKinesis(data) {
  data.forEach((record) => {
    const params = {
      Data: JSON.stringify(record),
      PartitionKey: record.vehicleId || 'blank',
      StreamName: 'CapstoneKinesisDataStream',
    };
    kinesis.putRecord(params, (err, data) => {
      if (err) console.error(err);
      else console.log(data);
    });
  });
}

const vehicleData = generateVehicleData();
sendToKinesis(vehicleData);

