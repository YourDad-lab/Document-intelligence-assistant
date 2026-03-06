// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Update tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    // Load data for the tab
    loadTabData(tabName);
  });
});

// Charts
let queryVolumeChart, datasetChart;

function initCharts() {
  // Query Volume Chart
  const qvCtx = document.getElementById('queryVolumeChart').getContext('2d');
  queryVolumeChart = new Chart(qvCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Queries',
        data: [],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148,163,184,0.06)' },
          ticks: { color: '#475569' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#475569' }
        }
      }
    }
  });
  
  // Dataset Chart
  const dsCtx = document.getElementById('datasetChart').getContext('2d');
  datasetChart = new Chart(dsCtx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#38bdf8', '#818cf8', '#34d399'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', padding: 10 }
        }
      }
    }
  });
}

// Load data
async function loadOverview() {
  try {
    // Add cache busting to ensure fresh data
    const response = await fetch('/api/analytics/overview?t=' + Date.now());
    const data = await response.json();
    
    console.log('📊 Overview data loaded:', data); // Debug log
    
    // Update stats
    document.getElementById('totalQueries').textContent = data.totalQueries.toLocaleString();
    document.getElementById('highConfidence').textContent = data.highConfidencePercent + '%';
    document.getElementById('avgLatency').textContent = data.avgLatency + 'ms';
    document.getElementById('liveCount').textContent = `${data.totalQueries.toLocaleString()} queries tracked`;
    
    // Update query volume chart
    queryVolumeChart.data.labels = data.queryVolume.map(q => q.time);
    queryVolumeChart.data.datasets[0].data = data.queryVolume.map(q => q.queries);
    queryVolumeChart.update();
    
    // Update dataset chart
    datasetChart.data.labels = data.datasetUsage.map(d => d.name);
    datasetChart.data.datasets[0].data = data.datasetUsage.map(d => d.value);
    datasetChart.update();
    
    console.log('✓ Charts updated'); // Debug log
    
  } catch (error) {
    console.error('Error loading overview:', error);
  }
}

async function loadQueries() {
  try {
    const response = await fetch('/api/analytics/queries');
    const data = await response.json();
    
    const list = document.getElementById('topQueriesList');
    list.innerHTML = data.topQueries.map((q, i) => `
      <div class="query-item">
        <span class="query-rank">#${i + 1}</span>
        <span class="query-text">${q.query}</span>
        <span class="query-count">${q.count}x</span>
        <span class="query-badge badge-${q.confidence}">${q.confidence}</span>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading queries:', error);
  }
}

async function loadPerformance() {
  try {
    const response = await fetch('/api/analytics/performance');
    const data = await response.json();
    
    document.getElementById('avgRetrieval').textContent = data.avgRetrieval + 'ms';
    document.getElementById('avgGeneration').textContent = data.avgGeneration + 'ms';
    
  } catch (error) {
    console.error('Error loading performance:', error);
  }
}

async function loadLogs() {
  try {
    const response = await fetch('/api/analytics/logs');
    const data = await response.json();
    
    const list = document.getElementById('logsList');
    list.innerHTML = data.logs.map(log => `
      <div class="log-row">
        <span class="log-time">${log.time}</span>
        <span class="log-query">${log.query}</span>
        <span class="log-confidence" style="color: ${log.confidence === 'high' ? '#34d399' : log.confidence === 'medium' ? '#fbbf24' : '#f87171'}">${log.confidence}</span>
        <span class="log-latency">${log.ms}ms</span>
        <span class="log-status status-${log.status}">${log.status}</span>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading logs:', error);
  }
}

function loadTabData(tab) {
  switch(tab) {
    case 'overview':
      loadOverview();
      break;
    case 'queries':
      loadQueries();
      break;
    case 'performance':
      loadPerformance();
      break;
    case 'logs':
      loadLogs();
      break;
  }
}

// Update last updated time
function updateTime() {
  document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  loadOverview();
  updateTime();
  
  // Auto-refresh every 5 seconds
  setInterval(() => {
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    loadTabData(activeTab);
    updateTime();
  }, 5000);
});
