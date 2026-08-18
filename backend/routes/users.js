const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Unable to load users",
    });
  }
});

// GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    console.log("REQUESTED USER ID:", userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    console.error("GET USER DETAILS ERROR:", error);

    res.status(500).json({
      message: "Unable to load user details",
    });
  }
});

module.exports = router;