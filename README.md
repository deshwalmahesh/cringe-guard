# LinkedIn Power Tools 🚀

A comprehensive LinkedIn utility extension that enhances your LinkedIn experience with powerful automation tools and AI-powered features. This Chrome extension provides all the essential utilities that LinkedIn lacks, making your networking and content management more efficient.

## ✨ Features

### 🤖 AI-Powered Feed Filtering
- **Smart Content Filtering**: Uses AI to analyze and filter out low-quality content (engagement bait, promotional spam, off-topic posts)
- **Real-time Analysis**: Posts are analyzed in real-time as you scroll through your feed
- **Customizable**: Control what types of posts to filter with AI-powered classification

### 🔗 Connection Management
- **Bulk Accept Requests**: Automatically accept multiple connection requests with configurable limits
- **Smart Batch Processing**: Accepts requests with random delays to avoid detection
- **Progress Tracking**: Real-time status updates during processing

### 👥 Bulk Unfollow Tools
- **Multi-tab Unfollow**: Unfollow people across multiple LinkedIn profile tabs simultaneously
- **Intelligent Detection**: Automatically detects Following status and handles different UI scenarios
- **Safe Automation**: Built-in delays and error handling to prevent account issues

### 💼 Job Post Tracking
- **AI Job Detection**: Automatically identifies and collects AI/tech job posts from your feed
- **Export Functionality**: Download collected job posts as JSON files with timestamps
- **24-hour Tracking**: Tracks and aggregates job posts found in the last 24 hours

### 📊 Analytics & Insights
- **Content Statistics**: Track how many posts have been filtered and time saved
- **Usage Metrics**: Monitor your extension usage and productivity gains
- **Export Data**: Download your data for external analysis

## Demo

![LinkedIn Power Tools Demo](./images/demo-cringe-guard.gif)

## How it works?

LinkedIn Power Tools enhances your LinkedIn experience through multiple integrated features:

### 🤖 AI Feed Filtering
1. **Detects New Posts**: As new posts appear in your feed, the extension detects them in real time
2. **AI Analysis**: Post content is sent to an AI model (via Groq API) that classifies it based on quality criteria
3. **Smart Filtering**: Low-quality posts (engagement bait, spam, off-topic content) are blurred or hidden
4. **User Control**: Customize filtering preferences and manage your API settings

### 🔗 Connection Management
1. **Bulk Accept**: Navigate to LinkedIn's invitation manager
2. **Smart Processing**: Accept multiple requests with configurable limits and random delays
3. **Status Tracking**: Real-time progress updates and completion statistics

### 👥 Bulk Unfollow
1. **Multi-tab Detection**: Automatically finds all open LinkedIn profile tabs
2. **Parallel Processing**: Unfollows across multiple profiles simultaneously with staggered timing
3. **Intelligent UI Handling**: Adapts to different LinkedIn interface scenarios and button states

### 💼 Job Tracking
1. **Content Scanning**: Monitors your LinkedIn feed for job-related posts
2. **AI Classification**: Uses AI to identify relevant job opportunities
3. **Data Collection**: Aggregates and stores job posts with metadata
4. **Export Options**: Download collected data in structured JSON format

## Running LinkedIn Power Tools Locally

To run the LinkedIn Power Tools Chrome extension on your local machine, follow these steps:

- Clone the repository
- Get your [Groq](https://groq.com) API key for AI-powered features
- Open Chrome browser and navigate to `chrome://extensions/`
- Enable Developer Mode in the top-right corner
- Click "Load unpacked" and select the extension folder
- Configure your API key in the extension settings

## TODO
- **Enhanced AI Features**: Expand AI classification capabilities for better content filtering
- **Additional Automation**: Add more LinkedIn automation tools (message templates, post scheduling)
- **Advanced Analytics**: Detailed insights dashboard with productivity metrics
- **Cross-platform Support**: Test and optimize for other browsers (Firefox, Edge)
- **Custom Filters**: Allow users to create custom content filtering rules via UI
- **Bulk Messaging**: Add capability for personalized bulk messaging to connections
- **Profile Analytics**: Add tools for analyzing profile views and engagement
- **Integration APIs**: Connect with external CRM systems and job boards
- **Enhanced Job Tracking**: Add filtering by location, salary, and other criteria
- **Performance Optimization**: Improve extension performance and reduce memory usage

## Built with ❤️ by

[Pankaj Tanwar](https://twitter.com/the2ndfloorguy), and checkout his [other side-hustles](https://pankajtanwar.in/side-hustles)

## Contributing

I welcome contributions to the `LinkedIn Power Tools` project! Whether it's a bug fix, a feature request, or improving documentation, your contributions are appreciated.

> Thanks to [Unbaited](https://github.com/danielpetho/unbaited) for the inspiration.