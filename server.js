let hello = "Hello World from Node.js";
let justNode = hello.slice(17);
console.log(`Who let the ${justNode} out?`);

// let hell = "Hello World from Node.js";
// let justNode = hellos.slice(17);
// console.log(`Who let the ${justNode} out? `);

//publish code
const mqtt = require("mqtt");

const broker = "mqtt://localhost:1883";

const options = {
  username: "Sarayu",
  password: "IOTteam@123",
};

const topic = "Test/data";

const client = mqtt.connect(broker, options);

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  setInterval(() => {
    let payload = "{";

    for (let i = 1; i <= 500; i++) {
      // Random value with 2 decimal places
      const value = (Math.random() * 100).toFixed(2);

      payload += `P${i},${value};`;
    }

    payload += "}";

    client.publish(topic, payload, { qos: 0 }, (err) => {
      if (err) {
        console.error("Publish error:", err);
      } else {
        console.log("Published:");
        console.log(payload);
      }
    });
  }, 1000);
});

client.on("error", (err) => {
  console.error("Connection error:", err);
});

client.on("close", () => {
  console.log("Disconnected from MQTT broker");
});
