# FretMagic Deployment Guide

This guide covers deployment options for FretMagic, from development to production.

## 🚀 Deployment Options

### 1. Replit (Recommended for Quick Deploy)
FretMagic is optimized for Replit deployment:

1. **Fork/Import** the repository to Replit
2. **Configure Environment** (optional database)
3. **Click Deploy** in Replit interface
4. **Domain Setup** - Use .replit.app or custom domain

**Pros**: Zero configuration, automatic HTTPS, easy scaling
**Cons**: Limited customization

### 2. Vercel (Recommended for Production)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables (if using database)
vercel env add DATABASE_URL
```

**Pros**: Excellent performance, automatic scaling, edge deployment
**Cons**: Requires static build setup

### 3. Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Pros**: Simple deployment, automatic HTTPS, database integration
**Cons**: May require configuration tweaks

### 4. Traditional VPS/Server
```bash
# Clone repository
git clone https://github.com/yourusername/fretmagic.git
cd fretmagic

# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

**Pros**: Full control, custom configuration
**Cons**: Requires server management, SSL setup

## ⚙️ Environment Configuration

### Required Environment Variables
```bash
# Server Configuration
PORT=5000                    # Server port (optional, defaults to 5000)
NODE_ENV=production         # Environment mode

# Database (Optional - uses in-memory storage if not provided)
DATABASE_URL=postgresql://user:password@host:port/database
```

### Optional Configuration
```bash
# Session Configuration (if using database sessions)
SESSION_SECRET=your-secret-key-here

# CORS Configuration (if needed for custom domains)
CORS_ORIGIN=https://yourdomain.com
```

## 🏗️ Build Process

### Development Build
```bash
npm run dev          # Start development server with hot reload
```

### Production Build
```bash
npm run build        # Build frontend and backend
npm start           # Start production server
```

### Build Output
```
dist/
├── public/         # Frontend static files
├── index.js        # Backend server bundle
└── assets/         # Optimized assets
```

## 🌐 Domain Setup

### Custom Domain Configuration
1. **Update CORS settings** if using custom domain
2. **Configure DNS** to point to deployment
3. **SSL Certificate** - Most platforms handle automatically
4. **Environment variables** - Update any domain-specific configs

### SEO Optimization
The app includes proper meta tags and Open Graph data:
- Unique page titles
- Descriptive meta descriptions
- Social media preview images
- Structured data for search engines

## 📊 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Automatic with Vite
- **Asset Optimization**: Images, CSS, JS minification
- **Caching**: Static assets with proper cache headers
- **Lazy Loading**: Components loaded on demand

### Backend Optimization
- **Gzip Compression**: Enabled for text assets
- **Static File Serving**: Efficient static file handling
- **Database Connections**: Connection pooling (if using database)
- **Memory Usage**: Optimized for minimal memory footprint

## 🔒 Security Configuration

### HTTPS/SSL
- **Required for Audio**: Audio features require HTTPS in production
- **Automatic on most platforms**: Vercel, Railway, Replit handle this
- **Manual setup for VPS**: Use Let's Encrypt or similar

### Content Security Policy
```javascript
// Basic CSP for FretMagic
{
  "default-src": "'self'",
  "script-src": "'self' 'unsafe-inline'",
  "style-src": "'self' 'unsafe-inline'",
  "connect-src": "'self'",
  "media-src": "'self'"
}
```

### Environment Security
- **Secure Environment Variables**: Never commit secrets to git
- **Database Security**: Use secure connection strings
- **Session Security**: Secure session configuration

## 📱 Browser Compatibility

### Minimum Requirements
- **Chrome 90+** (Desktop/Mobile)
- **Firefox 88+** (Desktop/Mobile)
- **Safari 14+** (Desktop/Mobile)
- **Edge 90+** (Desktop)

### Audio Requirements
- **Web Audio API**: Required for audio features
- **User Interaction**: Required before audio can start
- **HTTPS**: Required for microphone access (future feature)

## 🧪 Pre-Deployment Testing

### Automated Testing
```bash
# Type checking
npm run type-check

# Build verification
npm run build

# Start production server locally
npm start
```

### Manual Testing Checklist
- [ ] All guitar types display correctly (6/7/8 string)
- [ ] Scale patterns accurate across all modes
- [ ] Chord shapes display with correct fingering
- [ ] Audio works after user interaction
- [ ] Export features (PNG/PDF) function
- [ ] Share URLs work correctly
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] First contentful paint < 2 seconds
- [ ] Interactive response < 200ms
- [ ] Memory usage stable during extended use

## 🚨 Troubleshooting Common Issues

### Audio Not Working
**Problem**: Audio doesn't play in production
**Solution**: 
- Ensure HTTPS is enabled
- Verify user interaction before audio starts
- Check browser console for Web Audio API errors

### Slow Loading
**Problem**: App loads slowly
**Solution**:
- Verify assets are properly compressed
- Check network tab for large resources
- Enable gzip compression on server

### Database Connection Issues
**Problem**: Database connection fails
**Solution**:
- Verify DATABASE_URL format
- Check database server accessibility
- Ensure connection pooling is configured

### Mobile Display Issues
**Problem**: Layout broken on mobile
**Solution**:
- Test on actual devices, not just browser dev tools
- Verify Tailwind CSS responsive classes
- Check for viewport meta tag

## 📈 Monitoring and Analytics

### Error Monitoring
Consider integrating:
- **Sentry**: For error tracking
- **LogRocket**: For session replay
- **DataDog**: For performance monitoring

### Analytics
Optional analytics integration:
- **Google Analytics**: User behavior tracking
- **Mixpanel**: Feature usage analytics
- **Hotjar**: User interaction heatmaps

### Performance Monitoring
- **Core Web Vitals**: Monitor loading performance
- **Uptime Monitoring**: Ensure 99.9% availability
- **Resource Usage**: Monitor memory and CPU usage

## 🔄 Continuous Deployment

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - run: npm run type-check
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
```

### Deployment Best Practices
1. **Automated Testing**: Run tests before deployment
2. **Staging Environment**: Test in production-like environment
3. **Rollback Plan**: Ability to quickly revert if issues arise
4. **Health Checks**: Verify deployment success
5. **Gradual Rollout**: Deploy to subset of users first

## 📋 Post-Deployment Checklist

### Immediate Verification
- [ ] Site loads successfully
- [ ] All features functional
- [ ] Audio works with user interaction
- [ ] No console errors
- [ ] SSL certificate valid
- [ ] Performance within acceptable ranges

### 24-Hour Monitoring
- [ ] No error spikes in logs
- [ ] Performance metrics stable
- [ ] User feedback positive
- [ ] All browsers working correctly

### Week 1 Monitoring
- [ ] Usage analytics review
- [ ] Performance optimization opportunities
- [ ] User feedback integration
- [ ] Feature usage analysis

---

**Ready to deploy FretMagic to production!**

*Choose your preferred platform and follow the guide above for a smooth deployment experience.*