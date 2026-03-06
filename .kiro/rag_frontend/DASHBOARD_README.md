# RAG Analytics Dashboard

## Overview

A comprehensive analytics dashboard for monitoring and analyzing your RAG (Retrieval-Augmented Generation) system performance, query patterns, and system health.

## Features

### 📊 Four Main Tabs

1. **Overview** - System-wide metrics and trends
   - Total queries served
   - Confidence distribution
   - Average latency
   - Document usage statistics
   - Query volume trends
   - User feedback metrics

2. **Queries** - Query analysis and patterns
   - Top queries by frequency
   - Confidence level breakdown
   - Query volume by hour
   - Trending search patterns

3. **Performance** - System performance metrics
   - Retrieval latency (vector search)
   - Generation latency (answer generation)
   - P95 latency tracking
   - System uptime
   - Dataset coverage

4. **Logs** - Real-time query logs
   - Recent query history
   - Confidence levels
   - Response times
   - Status indicators (OK/WARN)
   - Filterable log view

## Access

- **Main App**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Globe Demo**: http://localhost:3000/globe-demo

## Technologies Used

- **Recharts** - Data visualization library
- **Next.js** - React framework
- **Framer Motion** - Animations (optional)
- **Custom CSS** - Inline styling for dark theme

## Key Metrics Displayed

### Real-time Stats
- Live query count with auto-increment
- High confidence percentage
- Average latency (retrieval + generation)
- Total documents indexed

### Charts & Visualizations
- Area charts for query volume trends
- Pie charts for dataset distribution
- Stacked bar charts for confidence levels
- Line charts for performance tracking
- Real-time log tables

## Customization

### Mock Data
Currently using mock data for demonstration. To connect to real data:

1. Create an analytics API endpoint in your backend
2. Replace mock data with API calls
3. Add real-time WebSocket updates for live metrics

### Color Scheme
- **Primary**: Blue (#38bdf8)
- **Success**: Green (#34d399)
- **Warning**: Yellow (#fbbf24)
- **Error**: Red (#f87171)
- **Background**: Dark blue gradient (#020b18)

### Adding New Metrics

1. Add data to the mock data section
2. Create a new ChartCard component
3. Use Recharts components for visualization
4. Add to the appropriate tab

## Future Enhancements

### Backend Integration
```python
# Add to FastAPI backend
@app.get("/analytics/overview")
async def get_analytics():
    return {
        "total_queries": query_count,
        "confidence_distribution": {...},
        "latency_stats": {...},
        "top_queries": [...]
    }
```

### Real-time Updates
- WebSocket connection for live metrics
- Server-Sent Events (SSE) for log streaming
- Auto-refresh intervals

### Advanced Features
- Date range filters
- Export to CSV/PDF
- Custom alerts and notifications
- User segmentation
- A/B testing results
- Cost tracking
- Model performance comparison

## Component Structure

```
pages/
  dashboard.tsx          # Main dashboard page
components/
  DashboardOverview.tsx  # Overview tab component (optional)
```

## Styling

The dashboard uses inline styles with:
- Dark theme optimized for readability
- Glassmorphism effects
- Smooth animations and transitions
- Responsive grid layouts
- Custom scrollbars
- Hover effects

## Performance

- Lazy loading for charts
- Memoized components
- Optimized re-renders
- Efficient data structures

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern browsers with ES6+ support

## Tips

1. **Navigation**: Use the tab buttons to switch between views
2. **Hover Effects**: Hover over cards and charts for details
3. **Live Updates**: The "LIVE" indicator shows real-time query count
4. **Responsive**: Works on desktop and tablet (mobile optimization needed)

## Next Steps

1. Connect to real backend analytics API
2. Add authentication/authorization
3. Implement data persistence
4. Add export functionality
5. Create custom alerts
6. Add more granular filters
7. Implement caching for performance

---

**Built with ❤️ for RAG System Monitoring**
