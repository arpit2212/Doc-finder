# Doctor Listing Project

A responsive web application that allows users to search, filter, and sort doctor listings using client-side data manipulation.

## Application Screenshots


![Search Interface](./public/Screenshot%202025-04-25%20180243.png)


![Doctor Listings](./public/Screenshot%202025-04-25%20182514.png)


![Filter Options](./public/Screenshot%202025-04-25%20184907.png)


![Specialty Selection](./public/Screenshot%202025-04-25%20184935.png)


![Sorting Options](./public/Screenshot%202025-04-25%20184955.png)


![Mobile Interface](./public/Screenshot%202025-04-25%20185007.png)


![Search Results](./public/Screenshot%202025-04-25%20185028.png)


![Filtered Results](./public/Screenshot%202025-04-25%20185051.png)

![Additional View](./public/Screenshot%202025-04-25%20185137.png)

## 📝 Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Information](#api-information)
- [Project Structure](#project-structure)
- [Implementation Details](#implementation-details)
- [Testing](#testing)
- [Future Improvements](#future-improvements)
- [License](#license)

## ✨ Features

### Autocomplete Search
- Real-time search suggestions as you type
- Shows top 3 matching doctor names
- Filter doctors on name selection or Enter key press

### Comprehensive Filtering
- *Consultation Mode:*
  - Video Consult
  - In Clinic
  
- *Specialty Filter (Multi-select):*
  - 24 medical specialties including General Physician, Dentist, Dermatologist, etc.
  - Supports multiple selections simultaneously
  
- *Sorting Options:*
  - By fees (ascending)
  - By experience (descending)

### URL-based State Management
- All filters and search criteria reflected in URL parameters
- Browser back/forward navigation supported with state preservation
- Shareable filtered links

### Responsive UI
- Clean, user-friendly interface
- Mobile-responsive design

## 🚀 Demo

Check out the live demo [here](#) (replace with your deployment link)

## 💻 Technology Stack

- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES6+)
- No external JavaScript libraries or frameworks

## ⚙ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/doctor-listing.git
   cd doctor-listing
   ```

2. No build process required for basic usage. Just open index.html in your browser or use a local server:
   ```bash
   # Using Python's built-in server
   python -m http.server
   # OR using Node.js with http-server (install it globally first)
   npm install -g http-server
   http-server
   ```

3. If you want to modify the Tailwind CSS:
   ```bash
   # Install dependencies
   npm install
   
   # Build CSS (development mode with watch)
   npm run dev
   
   # Build CSS (production mode)
   npm run build
   ```

## 📋 Usage

1. *Search for doctors:*
   - Type in the search box to see autocomplete suggestions
   - Select a suggestion or press Enter to filter

2. *Apply filters:*
   - Select consultation type (Video Consult/In Clinic)
   - Check one or more specialties
   - Choose a sorting method (fees or experience)

3. *Navigate results:*
   - Browse doctor cards showing name, specialty, experience, and fees
   - Use browser back/forward buttons to revisit previous filter combinations

## 🔌 API Information

The application fetches doctor data from the following endpoint:

https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json

- Data is fetched once on page load
- All filtering and sorting operations happen client-side
- No additional API calls are made during filtering

## 📁 Project Structure

```
doctor-listing/
├── index.html           # Main HTML file with structure
├── src/
│   ├── input.css        # Tailwind directives file
│   └── script.js        # JavaScript functionality
├── dist/
│   └── output.css       # Compiled Tailwind CSS
├── tailwind.config.js   # Tailwind configuration
├── package.json         # Project dependencies
├── README.md            # Project documentation
└── screenshots/         # Application screenshots
```

## 🔍 Implementation Details

### Doctor Data Structure
```javascript
{
  "name": "Dr. Example Name",
  "specialty": ["Cardiologist", "General Physician"],
  "experience": 15,
  "fees": 800,
  "consultation_type": "Video Consult"
}
```

### Key JavaScript Functions
- fetchDoctors(): Retrieves doctor data from the API
- filterDoctors(): Applies filters to the doctor list
- sortDoctors(): Sorts doctors based on selected criteria
- renderDoctors(): Displays filtered doctors as cards
- updateURLParams(): Updates URL with current filter state
- loadFiltersFromURL(): Restores filter state from URL parameters

### HTML Structure
- Search header with autocomplete input
- Filter panel with consultation type, specialties, and sort options
- Dynamic doctor list container

## ✅ Testing

This project includes data attributes (data-testid) for automated testing:

- autocomplete-input: The search input field
- suggestion-item: Autocomplete dropdown items
- doctor-card: Individual doctor list items
- doctor-name: Doctor's name element
- doctor-specialty: Specialty info element
- doctor-experience: Experience info element
- doctor-fee: Fee info element
- filter-header-moc: Consultation mode header
- filter-header-speciality: Specialty filter header
- filter-header-sort: Sort header
- filter-video-consult, filter-in-clinic: Consultation mode options
- filter-specialty-*: Specialty checkboxes
- sort-fees, sort-experience: Sort option radio buttons

## 🔮 Future Improvements

- Pagination for large datasets
- Filter count indicators
- Doctor detail view
- Save favorite doctors
- Location-based filtering
- Dark/light theme toggle
- Accessibility improvements
- Add doctor ratings and reviews
- Appointment booking integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
