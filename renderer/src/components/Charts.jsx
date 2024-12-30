import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const transformPerformanceData = (scrapingResults) => {
    return scrapingResults.reduce((acc, result) => {
      return acc;
    }, []);
};

const calculateIssueDistribution = (scrapingResults) => {
    return scrapingResults.reduce((acc, result) => {
      return acc;
    }, []);
};

const getTopWebsiteScores = (scrapingResults) => {
    return scrapingResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(result => ({
        name: new URL(result.url).hostname,
        score: result.score
      }));
};

export default function ScrapeAnalyticsDashboard() {
    let results = [];
    let performanceData = [];

    const fetchResults = async () => {
        try {
          const data = await window.api.getResults();
          results = data;

          for (const result of results) {
            performanceData.push({
                url: new URL(result.url).hostname,
                seo: result.seo.seo_score,
                performance: result.seo.performance_score,
                accessibility: result.seo.accessibility_score,
                bestPractices: result.seo.best_practices_score
            });
        }

        } catch (error) {
          console.error("Error fetching results:", error);
          alert("Failed to fetch results. Check console for details.");
        }
    };

    return (
        <div className="flex flex-col w-screen min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-6">Scraping Analytics Dashboard</h1>

            <Card className="flex-1 w-full">
                <CardHeader>
                    <CardTitle>Metrics Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full" style={{ height: '600px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={performanceData} 
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="url" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar type="monotone" dataKey="seo" fill="#8884d8" />
                                <Bar type="monotone" dataKey="performance" fill="#82ca9d" />
                                <Bar type="monotone" dataKey="accessibility" fill="#ffc658" />
                                <Bar type="monotone" dataKey="bestPractices" fill="#ff7300" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <button 
                onClick={fetchResults}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Refresh
            </button>
        </div>
    );
}