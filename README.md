# DACSU Voter Database Management System
## Amar Ekushey Hall - University of Dhaka

A comprehensive voter database management system for DUCSU (Dhaka University Central Students' Union) elections, specifically for Amar Ekushey Hall.

## Features

### 🔐 Authentication
- Secure login system with password protection
- Multiple authentication options

### 👥 Voter Management
- Complete database of 1291 voters
- Individual voter photos for all entries
- Detailed voter information including:
  - Serial number
  - Voter ID
  - Name
  - Registration session
  - Department affiliation

### 🔍 Search & Filter
- Search by voter name
- Search by voter number
- Filter by academic session
- Filter by department
- Quick reset functionality

### 📊 Reports & Analytics
- **6 Report Types:**
  - Summary Report
  - Detailed List
  - Statistical Analysis
  - Department Report
  - Session Report
  - Voter Cards List
- **Multiple Export Formats:**
  - HTML (Web View)
  - PDF (Print Ready)
  - Excel Spreadsheet
- Live preview before generation
- Customizable report options

### 🆔 ID Card Generation
- Individual voter ID cards
- Unique QR codes for each voter
- Print and download functionality
- Professional card layout

### 🖼️ Photo Gallery
- Visual gallery of all voters
- Filtered view support
- Click to enlarge photos

### 📈 Statistics Dashboard
- Session distribution
- Department breakdown
- Photo availability metrics
- Real-time statistics

### 🌐 Bilingual Support
- Full Bengali interface (default)
- Complete English translation
- Easy language switching

## Technology Stack
- Pure HTML5
- CSS3 with responsive design
- Vanilla JavaScript
- No external dependencies (except XLSX for Excel export)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/taazbro/dacsu.git
```

2. Ensure the `images` folder contains all voter photos (portrait_0001.jpg to portrait_1291.jpg)

3. Open `voter-database-with-extracted-photos.html` in any modern web browser

## Usage

1. **Login**: Use one of the provided passwords to access the system
2. **Browse**: View all voters with pagination (20 per page)
3. **Search**: Use filters to find specific voters
4. **Generate Reports**: Create custom reports with various options
5. **Export**: Download data in Excel format
6. **View Stats**: Check statistical analysis
7. **Create ID Cards**: Generate and print voter ID cards

## Security
- Password-protected access
- Client-side data processing
- No external API calls
- Secure session management

## Browser Compatibility
- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Project Structure
```
dacsu/
├── voter-database-with-extracted-photos.html  # Main application
├── images/                                    # Voter photos
│   ├── portrait_0001.jpg
│   ├── portrait_0002.jpg
│   └── ... (1291 photos total)
├── README.md                                  # Documentation
└── FIXES_APPLIED.md                          # Recent fixes log
```

## License
This project is for educational and administrative use by DUCSU and the University of Dhaka.

## Support
For issues or questions, please open an issue in the GitHub repository.

## Credits
Developed for DUCSU-1, Amar Ekushey Hall, University of Dhaka

---
**Last Updated**: 2025