"use client";

import React, { useEffect, useState } from "react";
import styles from "./user-stats.module.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  ScatterChart,
  Scatter,
  ComposedChart,
  Label,
  LabelList,
} from "recharts";
import MainLoading from "@/app/loading";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const accent = "#a3a6ac";
const gray = "#797d82";

const colors = ["#8884d8", "#82ca9d", "#ffc658"];

export default function UserStats() {
  const [data, setData] = useState({});

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const result = useUser();
  const userId = result?.user?.id;

  useEffect(() => {
    if (result?.user === null) {
      router.push("/login");
    }
  }, [result, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/user/stats?userId=${userId}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error loading statistics:", err);
      }

      setLoading(false);
    }

    if (result?.user) {
      fetchData();
    }
  }, [userId]);

  function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }

  const genresData = data.genres?.map((item) => ({
    ...item,
    value: Number(item.value),
  }));

  const bookCategoryData = data.usedBooksStats?.map((item) => ({
    ...item,
    value: Number(item.value),
  }));

  const metrics = ["wpm", "comprehension", "time"];

  const maxValues = {
    wpm: Math.max(...(data.tests?.map((t) => t.wpm) || [0])),
    comprehension: Math.max(
      ...(data.tests?.map((t) => t.comprehension) || [0])
    ),
    time: Math.max(...(data.tests?.map((t) => t.time) || [0])),
  };

  const testData = metrics.map((metric) => {
    const obj = { subject: metric.toUpperCase() };
    (data.tests || []).forEach((test, index) => {
      obj[`Test${index + 1}`] = maxValues[metric]
        ? (test[metric] / maxValues[metric]) * 100
        : 0;
    });
    return obj;
  });

  const coloredData = data.wordCategories?.map((entry, index) => ({
    ...entry,
    fill: colors[index % colors.length],
  }));

  const cleanedWordsByDate = data?.wordsByDates?.map((item) => ({
    date: new Date(item.date).toISOString().split("T")[0],
    words: item.words ? parseInt(item.words, 10) : 0,
  }));

  if (loading) return <MainLoading />;

  return (
    <div className={styles.container}>
      <section className={styles.chartBlock}>
        <h2>User Information</h2>
        <p>
          First Visit:{" "}
          {new Date(data?.userInfo?.date_of_first_visit).toLocaleDateString()}
        </p>
        <p>Flame Score: {data?.userInfo?.flame_score}</p>
      </section>

      <section className={styles.chartBlock}>
        <h2>Words Read Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={cleanedWordsByDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date">
              <Label value="Date" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis
              label={{ value: "Words", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />
            <Line
              type="monotone"
              dataKey="words"
              stroke={accent}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartBlock}>
        <h2>Reading Progress</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.readingProgress}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="title">
              <Label value="Book Title" offset={-5} position="insideBottom" />
            </XAxis>

            <YAxis>
              <Label value="Pages Read" angle={-90} position="insideLeft" />
            </YAxis>

            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />

            <Bar dataKey="pages" fill={accent} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartBlock}>
        <h2>Daily Reading</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.dailyReading}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date">
              <Label value="Date" offset={-5} position="insideBottom" />
            </XAxis>

            <YAxis>
              <Label value="Pages Read" angle={-90} position="insideLeft" />
            </YAxis>

            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />

            <Line
              type="monotone"
              dataKey="pages"
              stroke={accent}
              strokeWidth={2}
            >
              <LabelList dataKey="pages" position="top" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartBlock}>
        <h2>Book Subjects</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={genresData}
              dataKey="value"
              nameKey="name"
              outerRadius={170}
              label
            >
              {data.genres?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? accent : gray}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
              itemStyle={{ color: "#f2f2f3" }}
            />

            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ color: "#f2f2f3" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartBlock}>
        <h2>Tests</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius={170} data={testData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            {data.tests?.map((_, i) => (
              <Radar
                key={i}
                name={`Test ${i + 1}`}
                dataKey={`Test${i + 1}`}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={0.6}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartBlock}>
        <h2>Dictionary Growth</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data.dictionaryGrowth}>
            <XAxis
              dataKey="date"
              label={{
                value: "Date",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Words",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />
            <Area
              type="monotone"
              dataKey="words"
              stroke={accent}
              fill={accent}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartBlock}>
        <h2>Time Distribution Across Books</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis
              dataKey="x"
              name="Session"
              label={{
                value: "Session Number",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              dataKey="y"
              name="Time"
              tickFormatter={(seconds) => formatTime(seconds)}
              label={{
                value: "Reading Time (hh:mm:ss)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
              formatter={(value, name) => {
                if (name === "Time") {
                  return [formatTime(value), "Time"];
                }
                return [value, name];
              }}
            />
            <Scatter name="Time" data={data.bookTimeScatter} fill={accent} />
          </ScatterChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartBlock}>
        <h2>Review Votes</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.reviewVotes} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              label={{
                value: "Votes Count",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis dataKey="name" type="category" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />
            <Bar
              dataKey="value"
              fill={accent}
              label={{ position: "right", fill: "#f2f2f3" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* <section className={styles.chartBlock}>
        <h2>User Activity</h2>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={data.userStreak}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />
            <Area
              type="monotone"
              dataKey="active"
              fill={accent}
              stroke={gray}
            />
            <Bar dataKey="active" barSize={20} fill={accent} />
          </ComposedChart>
        </ResponsiveContainer>
      </section> */}

      <section className={styles.chartBlock}>
        <h2>Notes per Book</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.notesPerBook} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="title" type="category" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />
            <Bar dataKey="notes" fill={accent} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartBlock}>
        <h2>Book Status</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={bookCategoryData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={160}
              fill={accent}
              label
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
              itemStyle={{ color: "#f2f2f3" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* <section className={styles.chartBlock}>
        <h2>Reading Time Over the Week</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.weeklyTime}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />
            <Line
              type="monotone"
              dataKey="time"
              stroke={accent}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </section> */}

      <section className={styles.chartBlock}>
        <h2>Book Ratings</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.bookRatings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="book" />
            <YAxis domain={[0, 5]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />
            <Bar dataKey="rating" fill={accent} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.chartBlock}>
        <h2>Word Categories</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadialBarChart
            innerRadius="20%"
            outerRadius="90%"
            data={coloredData}
          >
            <RadialBar
              minAngle={15}
              label={{ position: "insideStart", fill: "#fff" }}
              background
              dataKey="value"
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ color: "#f2f2f3" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222328",
                border: "none",
                color: "#f2f2f3",
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
