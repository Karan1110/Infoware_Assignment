const express = require("express")
const router = express.Router()
const Review = require("../models/review")
const Employee = require("../models/employee")

router.get("/employee/:id", async (req, res) => {
  try {
    const id = req.params.id

    // Check if the employee with the given ID exists
    const employee = await Employee.findByPk(id)
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" })
    }

    // Find all reviews for the employee
    const reviews = await Review.findAll({
      where: { employee_id: id },
      attributes: ["rating"],
    })

    // Calculate the average rating
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      )
      const averageRating = totalRating / reviews.length
      res.json({ averageRating })
    } else {
      res.json({ averageRating: 0 })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Add a new review
router.post("/add", async (req, res) => {
  try {
    const { employeeId, title, content, rating } = req.body

    // Check if the employee with the given ID exists
    const employee = await Employee.findByPk(employeeId)
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" })
    }

    // Additional validation for rating
    if (rating > 10 || rating % 1 !== 0) {
      return res
        .status(400)
        .send(
          "Invalid rating. Ratings should be less than or equal to 10 and not be a decimal."
        )
    }
    // Create a new review
    const newReview = await Review.create({
      employee_id: employeeId,
      title,
      content,
      rating,
    })

    res.status(201).json(newReview)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Edit a review
router.put("/edit/:id", async (req, res) => {
  try {
    const reviewId = req.params.id
    const { title, content, rating } = req.body

    // Find the review by ID
    const review = await Review.findByPk(reviewId)
    if (!review) {
      return res.status(404).json({ error: "Review not found" })
    }

    // Update the review
    await review.update({ title, content, rating })

    res.json(review)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Delete a review
router.delete("/delete/:id", async (req, res) => {
  try {
    const reviewId = req.params.id

    // Find the review by ID
    const review = await Review.findByPk(reviewId)
    if (!review) {
      return res.status(404).json({ error: "Review not found" })
    }

    // Delete the review
    await review.destroy()

    res.status(204).send() // No content
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

module.exports = router
