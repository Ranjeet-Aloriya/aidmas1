const navbar = document.getElementById('navbar');

// Listen for scroll events
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        navbar.classList.add('show');
    } else {
        navbar.classList.remove('show');
    }
});



function sendMail() {
    const name = prompt("What's your/Company name?");
    if (name && name.trim()) {
      const email = "ranjeet@example.com";
      const rawSubject = `NON-DISCLOSURE AGREEMENT between AidMas & ${name.trim()}`;
      const encodedSubject = encodeURIComponent(rawSubject);
      const mailtoLink = `mailto:${email}?subject=${encodedSubject}`;
  
      window.location.href = mailtoLink;
    } else {
      alert("Please enter a valid name.");
    }
  }
    

// Typing Effect for role description
document.addEventListener("DOMContentLoaded", () => {
    const roles = ["Cyber Data Mining", "Breach Notification List", "Data Analytics"];
    let index = 0, charIndex = 0, isDeleting = false;
  
    function typeEffect() {
        const el = document.getElementById("typingText");
        if (!el) return;
      
        const current = roles[index];
      
        if (!isDeleting) {
            el.textContent = current.substring(0, charIndex++);
            if (charIndex > current.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1000);
                return;
            }
        } else {
            el.textContent = current.substring(0, charIndex--);
            if (charIndex < 0) {
                isDeleting = false;
                index = (index + 1) % roles.length;
            }
        }
  
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }

    typeEffect();
  
    // Testimonial Carousel
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-controls .dot');
    let currentIndex = 0;

    function showSlide(index) {
        testimonials.forEach((card, i) => {
            card.classList.remove('active');
            dots[i].classList.remove('active');
        });
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        showSlide(nextIndex);
    }

    setInterval(nextSlide, 5000);

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => showSlide(i));
    });

    showSlide(0); // Initial

    // Blog Post Navigation and Thumbnail Updates
    let blogIndex = 0;
    const blogPosts = document.querySelectorAll('.blog-post');
    const thumbnailsContainer = document.getElementById('blog-thumbnails');
  
    function showBlog(index) {
        blogPosts.forEach((post, i) => {
            post.classList.remove('active');
            if (i === index) {
                post.classList.add('active');
            }
        });
        blogIndex = index;
        updateThumbnails();
    }

    function nextBlog() {
        const nextIndex = (blogIndex + 1) % blogPosts.length;
        showBlog(nextIndex);
    }

    function goToBlog(index) {
        showBlog(index);
    }

    function updateThumbnails() {
        thumbnailsContainer.innerHTML = '';
        blogPosts.forEach((post, i) => {
            if (i !== blogIndex) {
                const img = post.querySelector('img').cloneNode();
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '6px';
                img.style.cursor = 'pointer';
                img.onclick = () => goToBlog(i);

                const thumbDiv = document.createElement('div');
                thumbDiv.classList.add('thumb-post');
                thumbDiv.appendChild(img);

                thumbnailsContainer.appendChild(thumbDiv);
            }
        });
    }

    setInterval(nextBlog, 5000);

    // Initialize Blog
    showBlog(0);
});

function startChat() {
    const widget = document.getElementById("chatWidget");
    widget.classList.remove("hidden");
  
    const chatBody = document.getElementById("chatBody");
    chatBody.innerHTML = ""; // clear previous
  
    const now = new Date();
    const hour = now.getHours();
  
    let greeting = "Good Evening";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 17) greeting = "Good Afternoon";
  
    addBotMessage(`Hello, ${greeting}! 👋<br>I hope you're doing good.<br>May I know your good name?`);
  }
  
  function closeChat() {
    document.getElementById("chatWidget").classList.add("hidden");
  }
  
  function handleChat(event) {
    if (event.key === "Enter") {
      const input = document.getElementById("chatInput");
      const text = input.value.trim();
      if (text === "") return;
  
      addUserMessage(text);
      input.value = "";
  
      // Simulate bot response
      setTimeout(() => {
        if (text.toLowerCase().includes("my name is")) {
          addBotMessage(`Nice to meet you, ${text.split("my name is")[1].trim()} 😊`);
        } else {
          addBotMessage("Thanks for reaching out! I'll get back to you shortly.");
        }
      }, 1000);
    }
  }
  
  function addBotMessage(message) {
    const chatBody = document.getElementById("chatBody");
    const msg = document.createElement("div");
    msg.className = "message bot";
    msg.innerHTML = message;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  function addUserMessage(message) {
    const chatBody = document.getElementById("chatBody");
    const msg = document.createElement("div");
    msg.className = "message user";
    msg.textContent = message;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }  

  document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Message sent successfully!');
        this.reset();
      } else {
        alert('Error sending message.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('There was a problem sending your message.');
    }
  });

  const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST route to handle contact form submission
app.post('/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use 'smtp.mailtrap.io', 'SendGrid', etc.
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.GMAIL_USER,
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
