# Modern Portfolio Website

A modern, animated portfolio website template featuring a sleek design with interactive elements, smooth animations, and a particle background effect.

## Features

- Interactive particle background effect in the hero section
- Smooth GSAP animations throughout the website
- Typing animation effect for showcasing multiple skills
- Mobile-responsive design with animated mobile menu
- Scroll-triggered animations for all sections
- Animated skill bars with progress indicators
- Hover effects and micro-interactions for engaging UX
- Contact form with validation and animation
- Social media presence section with statistics
- Page loader with smooth transition

## Structure

- **index.html** - Main HTML structure
- **styles.css** - All styling and animations
- **script.js** - Interactive elements, GSAP animations, and particle effects

## Animation Features

- Smooth entrance animations for all sections
- Typing effect for dynamically changing text
- Particle background with interactive hover effects
- Animated skill bars that fill as you scroll
- Scroll-triggered reveal animations
- Hover animations for buttons and cards
- Mobile menu slide-in animation
- Form interactions and feedback animations

## Customization

To personalize this portfolio:

1. Replace "Your Name" with your actual name throughout the HTML
2. Customize the typing animation phrases in script.js
3. Update the profile information in the About section
4. Add your own skills with appropriate percentage values
5. Replace project descriptions with your actual projects
6. Update social media links and statistics
7. Add your own photo by replacing the profile circle with an actual image
8. Customize the particle.js settings in script.js for different effects

## Setup

Simply download all files and open index.html in your browser. No server required for basic functionality.

## Technologies Used

- HTML5
- CSS3 (with CSS variables, Flexbox/Grid)
- Vanilla JavaScript
- GSAP (GreenSock Animation Platform) for advanced animations
- ScrollTrigger for scroll-based animations
- Particles.js for interactive background effects
- Font Awesome icons

## Browser Compatibility

Tested and optimized for:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

Feel free to use this template for your personal portfolio.

---

Created with ❤️ 

# Portfolio Website with Supabase Integration

This portfolio website includes a contact form that saves messages to a Supabase database and an admin panel to view them.

## Troubleshooting Common Issues

### Contact Form Not Working After Deployment

If your contact form works locally but not after deploying to GitHub Pages or another hosting service:

1. **Check CORS Configuration**:
   - Open `cors.html` in your deployed site to test CORS configuration
   - Add your website's domain to Supabase's allowed origins:
     - Go to Supabase Dashboard → Project Settings → API → CORS
     - Add `https://yourusername.github.io` (or your custom domain)
     - Click "Save"

2. **Check Browser Console**:
   - Open Developer Tools (F12) and look for errors
   - If you see "Uncaught ReferenceError: supabase is not defined", make sure script loading order is correct

3. **Script Loading Issues**:
   - Verify that `config.js` loads before `script.js`
   - If using a CDN, ensure it's accessible and not blocked

### Admin Panel Access Issues

1. **Correct URL**:
   - Use `/admin/index.html` (not `/index.html/admin`)
   - Login only works with the email specified in `config.js`

2. **Authentication**:
   - If login fails, check browser console for errors
   - Verify RLS policies are set up correctly in Supabase

## Supabase Setup

Make sure your Supabase project has:

1. A `messages` table with columns:
   - `id` (uuid, primary key)
   - `name` (text)
   - `email` (text)
   - `message` (text)
   - `created_at` (timestamp with time zone)

2. RLS policies:
   - Anonymous INSERT access
   - Authenticated SELECT access

## Local Development

1. Clone the repository
2. Open `index.html` in your browser (no server required)
3. For testing the admin panel, use a local server:
   ```
   npx http-server
   ``` 