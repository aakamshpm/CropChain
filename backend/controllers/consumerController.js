import asyncHandler from "express-async-handler";
import Consumer from "../models/Consumer.js";

const registerConsumer = asyncHandler(async (req, res) => {
  try {
    const { name, phoneNumber, password, address } = req.body; // TODO:: add shop address

    if (!name || !phoneNumber || !password) {
      res.status(400);
      throw new Error("Please fill every field");
    }

    if (await Consumer.findOne({ phoneNumber })) {
      res.status(400);
      throw new Error("Consumer already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const consumer = await Consumer.create({
      name,
      phoneNumber,
      password: hashedPassword,
      address,
    });
    if (consumer) {
      generateToken(res, consumer._id, "consumer");
      res.status(200).json({ message: "Registered successfuly" });
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const loginConsumer = asyncHandler(async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      res.status(400);
      throw new Error("Enter required fields");
    }

    const consumer = await Consumer.findOne({ phoneNumber });
    if (consumer) {
      if (await bcrypt.compare(password, consumer.password)) {
        generateToken(res, consumer._id, "consumer");
        res.status(200).json({ message: "Login success" });
      } else {
        res.status(400);
        throw new Error("Invalid Password");
      }
    } else {
      res.status(400);
      throw new Error("No Consumer found");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const getConsumerDetails = asyncHandler(async (req, res) => {
  try {
    const consumer = await Consumer.findById(req.consumerId).select(
      "-password"
    );

    if (!consumer) {
      res.status(400);
      throw new Error("Consumer not found");
    }

    res.status(200).json({ data: consumer });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

export { loginConsumer, registerConsumer, getConsumerDetails };
