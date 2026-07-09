const pool = require('../config/db')
const nodemailer = require('nodemailer')

const sendEmailNotification = async (name, email, message) => {
  // If SMTP password or user is missing, skip silently to prevent API crash
  if (!process.env.SMTP_PASS || !process.env.SMTP_USER) {
    console.log('⚠️ Skipping email notification: SMTP credentials (SMTP_USER/SMTP_PASS) are not set in .env')
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
      subject: `New Message from ${name} on your Portfolio Site`,
      text: `Hello Prarthana,\n\nYou have received a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n\nBest regards,\nPortfolio Website`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; border: 1px solid #cbd5e1;">
          ${message.replace(/\n/g, '<br />')}
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('✉️ Email notification sent successfully to', process.env.NOTIFICATION_EMAIL)
  } catch (err) {
    console.error('❌ Failed to send email notification:', err.message)
  }
}

const getAllMessages = async (req, res) => {
  try {
    const messages = await pool.query('SELECT * FROM messages ORDER BY created_at DESC')
    res.json(messages.rows)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body
    const newMessage = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    )

    // Send background email notification
    sendEmailNotification(name, email, message)

    res.status(201).json(newMessage.rows[0])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const markAsRead = async (req, res) => {
  try {
    await pool.query('UPDATE messages SET is_read=true WHERE id=$1', [req.params.id])
    res.json({ message: 'Marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteMessage = async (req, res) => {
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id])
    res.json({ message: 'Message deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAllMessages, createMessage, markAsRead, deleteMessage }