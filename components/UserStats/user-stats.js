"use client";

import styles from "./user-stats.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import MainLoading from "@/app/loading";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff6961",
  "#a2d4ab",
  "#f9c5d1",
];

export default function UserStats() {
  const [stats, setStats] = useState(null);

  //Without API

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/user/stats");
      const data = await res.json();
      setStats(data);
    }
    fetchStats();
  }, []);

  if (!stats) return <MainLoading />;

  return (
    <div className={styles.userStatsContainer}>
      <div className={styles.userInfo}>
        <p>First Visit: {stats.firstVisit}</p>
        <p>Activity Score: {stats.flameScore}</p>
      </div>

      {/* Books */}
      <div className={styles.sectionChartsContainer}>
        <div className={`${styles.chartBlock} ${styles.lineChart}`}>
          <h3>Your Library</h3>
          <div>
            <p>Total Books in Library: {stats.libraryStats.bookCount}</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.libraryStats.activity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" padding={{ left: 60, right: 60 }} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="books"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${styles.chartBlock} ${styles.pieChart}`}>
          <h3>Subjects in Library</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={stats.libraryStats.genres}
                dataKey="count"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats.libraryStats.genres.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Note Sessions */}
      <div className={styles.chartBlock}>
        <h3>Pages Read per Session</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.readingSessions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="pages" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
        <p>
          Sessions: {stats.noteSessionsCount} | Books: {stats.noteBooksCount}
        </p>
      </div>

      {/* Notes */}
      <div className={styles.chartBlock}>
        <h3>📝 Notes Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.notesTimeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="notes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <p>Total Notes: {stats.notesCount}</p>
        <h4>Top 5 Longest Notes</h4>
        <ul>
          {stats.topNotes.map((note, i) => (
            <li key={i}>
              {note.title} ({note.length} chars)
            </li>
          ))}
        </ul>
      </div>

      {/* Challenge Activity */}
      <div className={styles.chartBlock}>
        <h3>🎯 Challenge Activity Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.challengeTimeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ff6961" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dictionary */}
      <div className={styles.chartBlock}>
        <h3>🧠 Dictionary Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.dictionaryTimeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="words" fill="#a2d4ab" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Test Progress */}
      <div className={styles.chartBlock}>
        <h3>📈 Reading Test Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.readingTests}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="wpm" stroke="#8884d8" name="WPM" />
            <Line
              type="monotone"
              dataKey="comprehension"
              stroke="#82ca9d"
              name="Comprehension"
            />
          </LineChart>
        </ResponsiveContainer>
        <p>Total Tests: {stats.testsCount}</p>
      </div>
    </div>
  );
}
