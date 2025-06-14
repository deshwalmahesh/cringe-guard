# LinkedIn Power Tools

A comprehensive LinkedIn utility extension that enhances your LinkedIn experience with AI-powered content filtering, automation tools, and bulk operations. This Chrome extension provides essential LinkedIn utilities for improved productivity and content management.

## Features

### AI-Powered Feed Filtering
- **Smart Content Analysis**: Uses AI to identify and filter low-quality content including engagement bait, promotional spam, and off-topic posts
- **Real-time Processing**: Analyzes posts as you scroll through your LinkedIn feed
- **Customizable Filtering**: Configure AI filtering preferences through extension settings

### Connection Management
- **Bulk Accept Requests**: Automatically accept multiple connection requests with smart batch processing
- **Rate Limiting**: Built-in delays and limits to avoid detection
- **Progress Tracking**: Real-time status updates during bulk operations

### Bulk Unfollow Tools
- **Multi-tab Processing**: Unfollow people across multiple LinkedIn profile tabs simultaneously
- **Intelligent Detection**: Automatically detects Following status and handles different UI scenarios
- **Safe Automation**: Random delays and error handling to prevent account restrictions

### Job Post Tracking
- **AI Job Detection**: Automatically identifies and collects AI/tech job postings from your feed
- **Data Export**: Download collected job posts as JSON files with contact information
- **24-hour Aggregation**: Tracks job posts found within the last 24 hours

### Analytics & Insights
- **Content Statistics**: Track filtered posts count and estimated time saved
- **Usage Metrics**: Monitor extension usage and productivity improvements
- **Data Export**: Download analytics data for external analysis

## Demo

![LinkedIn Power Tools Demo](./images/demo-cringe-guard.gif)

## How it works

### AI Feed Filtering
1. **Content Detection**: Extension detects new posts as they appear in your LinkedIn feed
2. **AI Analysis**: Post content is analyzed using Groq's API to classify content quality
3. **Smart Filtering**: Low-quality posts are blurred with click-to-view functionality
4. **Job Highlighting**: AI-identified job posts are highlighted with special badges

### Connection Management
1. **Bulk Processing**: Navigate to LinkedIn's invitation manager page
2. **Smart Automation**: Accept multiple requests with configurable limits and random delays
3. **Background Tabs**: Automatically opens accepted connections' profiles in background tabs

### Bulk Unfollow Operations
1. **Tab Detection**: Automatically identifies all open LinkedIn profile tabs
2. **Parallel Processing**: Processes multiple profiles simultaneously with staggered timing
3. **UI Adaptation**: Handles different LinkedIn interface scenarios (Following button vs More menu)

### Job Post Collection
1. **Feed Monitoring**: Continuously scans LinkedIn feed for job-related content
2. **AI Classification**: Uses machine learning to identify relevant job opportunities
3. **Data Extraction**: Collects job details including contact information and links
4. **Export Functionality**: Provides JSON export with 24-hour data retention

## Installation

To install LinkedIn Power Tools locally:

1. Clone this repository
2. Obtain a [Groq API key](https://groq.com) for AI-powered features
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable Developer Mode in the top-right corner
5. Click "Load unpacked" and select the extension directory
6. Configure your API key in the extension settings

## Development Roadmap
- Enhanced AI classification capabilities for improved content filtering
- Additional LinkedIn automation tools (message templates, post scheduling)
- Advanced analytics dashboard with detailed productivity metrics
- Cross-browser compatibility (Firefox, Edge)
- Custom content filtering rules via user interface
- CRM system integrations for professional networking
- Enhanced job tracking with location and salary filtering
- Performance optimizations for better extension efficiency

## Author

Built by [Mahesh Deshwal](https://github.com/deshwalmahesh)

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests to improve LinkedIn Power Tools.

## Acknowledgments

[Pankaj Tanwar's Cringe Guard](https://github.com/Pankajtanwarbanna/cringe-guard) for initial work and inspiration