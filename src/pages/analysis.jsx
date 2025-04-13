"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/configs/firebase"
import Navbar from "@/components/Navbar/Navbar"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

function Analysis() {
  const { postId } = useParams()
  const [resultData, setResultData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!postId) return

    async function fetchResult() {
      setLoading(true)
      try {
        const q = query(collection(db, "result"), where("postId", "==", postId))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setResultData(doc.data())
        } else {
          console.warn('No matching "result" doc found for postId:', postId)
          setResultData(null)
        }
      } catch (error) {
        console.error("Error fetching analysis result:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [postId])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6">
          <p>Loading analysis...</p>
        </div>
      </>
    )
  }

  if (!resultData) {
    return (
      <>
        <Navbar />
        <div className="p-6">
          <p className="text-red-500">No analysis found for postId: {postId}</p>
        </div>
      </>
    )
  }

  const {
    audience_demographics = {},
    cultural_seasonality = {},
    emotional_resonance,
    notes,
    platform_engagement = {},
    public_reactions = [],
    recommendations = [],
    sentiment_distribution = {},
    trending_hashtags = [],
  } = resultData

  // Dynamically build the array for Recharts
  const sentimentChartData = Object.entries(sentiment_distribution || {}).map(
    ([sentimentKey, value]) => ({
      sentiment: sentimentKey, // e.g., "negative", "neutral", "positive"
      value,
    })
  )

  // Chart configuration for shadcn/ui chart
  const chartConfig = {
    sentiment: {
      label: "Sentiment",
      color: "rgba(99, 102, 241, 1)", // Indigo color
    },
  }

  return (
    <>
      <Navbar />

      {/* Container: left side (flex-1) + right side (fixed width) */}
      <div className="flex space-x-6 p-6">

        {/* Left Column: Expand to fill remaining width */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* 1) Audience Demographics */}
          <div className="flex flex-col gap-4 md:flex-row">
            {Object.entries(audience_demographics).map(([ageRange, bulletPoints]) => (
              <Card key={ageRange} className="w-full md:w-1/3">
                <CardHeader>
                  <CardTitle>Age {ageRange}</CardTitle>
                  <CardDescription>Audience Insights</CardDescription>
                </CardHeader>
                <CardContent>
                  {Array.isArray(bulletPoints) &&
                    bulletPoints.map((bp, i) => (
                      <p key={i} className="text-sm mb-2">• {bp}</p>
                    ))
                  }
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 2) Cultural Seasonality & Emotional Resonance */}
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle>Cultural Seasonality</CardTitle>
                <CardDescription>
                  {cultural_seasonality.active
                    ? "Currently in season"
                    : "Not in seasonal timeframe"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Reason: {cultural_seasonality.reason}</p>
                {cultural_seasonality.regions && (
                  <div>
                    <p className="font-semibold text-sm">Relevant Regions:</p>
                    <ul className="list-disc list-inside text-sm pl-4">
                      {cultural_seasonality.regions.map((reg, i) => (
                        <li key={i}>{reg}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle>Emotional Resonance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Depth: {emotional_resonance ?? "N/A"} (out of 5)</p>
                <p className="text-sm mt-2">{notes}</p>
              </CardContent>
            </Card>
          </div>

          {/* 3) Platform Engagement */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Engagement</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(platform_engagement).map(([platformKey, text]) => (
                <div key={platformKey} className="border p-2 rounded-md">
                  <p className="font-semibold capitalize">{platformKey}</p>
                  <p className="text-sm mt-1">{text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 4) Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-2 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  {rec}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 5) Public Reactions */}
          <Card>
            <CardHeader>
              <CardTitle>Public Reactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {public_reactions.map((reaction, i) => (
                <div key={i} className="p-2 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  {reaction}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 6) Trending Hashtags (horizontal scroll) */}
          {Array.isArray(trending_hashtags) && trending_hashtags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Trending Hashtags</CardTitle>
                <CardDescription className="text-sm">Swipe horizontally</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 overflow-x-auto py-2">
                  {trending_hashtags.map((tagObj, i) => (
                    <div key={i} className="shrink-0 border rounded-md p-3 mx-1">
                      <p className="font-semibold">{tagObj.tag}</p>
                      <p className="text-sm mt-1">{tagObj.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Fixed or limited width so chart is visible */}
        <div className="flex flex-col gap-6 w-[500px]">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
              <CardDescription>Radar Chart</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto"
              >
                <RadarChart
                  data={sentimentChartData}
                  width={400}
                  height={400}
                  outerRadius="70%"
                  margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
                >
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <PolarAngleAxis dataKey="sentiment" />
                  <PolarGrid />
                  <Radar
                    dataKey="value"
                    fill="var(--color-sentiment)"
                    fillOpacity={0.6}
                    dot={{ r: 4, fillOpacity: 1 }}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Analysis
