const Event = require("../models/Event");
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require("../config/googleDrive");
const fs = require("fs");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    console.log("Received file:", req.file);

    const { title, description, date, location } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload image to Google Drive
    const imageUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    // Save event details to the database
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      imageUrl,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("❌ Error creating event:", error);
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location } = req.body;

    // Find existing event
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Handle image update if new file is provided
    let imageUrl = event.imageUrl;
    if (req.file) {
      // Delete old image from Google Drive
      const oldFileId = event.imageUrl.split('/d/')[1]?.split('/')[0];
      if (oldFileId) {
        await deleteFromGoogleDrive(oldFileId);
      }

      // Upload new image
      imageUrl = await uploadToGoogleDrive(req.file.path, req.file.filename);
      
      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title: title || event.title,
        description: description || event.description,
        date: date || event.date,
        location: location || event.location,
        imageUrl
      },
      { new: true }
    );

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });

  } catch (error) {
    console.error("❌ Error updating event:", error);
    res.status(500).json({
      message: "Error updating event",
      error: error.message
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find event to get image URL before deletion
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete image from Google Drive
    const fileId = event.imageUrl.split('/d/')[1]?.split('/')[0];
    if (fileId) {
      await deleteFromGoogleDrive(fileId);
    }

    // Delete event from database
    await Event.findByIdAndDelete(id);

    res.status(200).json({
      message: "Event deleted successfully",
      deletedEvent: event
    });

  } catch (error) {
    console.error("❌ Error deleting event:", error);
    res.status(500).json({
      message: "Error deleting event",
      error: error.message
    });
  }
};
