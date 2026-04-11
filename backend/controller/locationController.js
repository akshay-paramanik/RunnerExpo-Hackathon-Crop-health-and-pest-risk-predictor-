import locationSchema from "../models/locationSchema.js";

const locationController = {
  addLocation: async (req, res) => {
    try {
      const { lat, lon } = req.body;
      const newLocation = await locationSchema.create({ latitude: lat, longitude: lon });
      res.status(201).json(newLocation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export default locationController;