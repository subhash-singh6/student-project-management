import { useEffect, useState } from "react";
import API from "../services/teacherApi";

export default function useTeacherDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingReviews: 0,
    approvedProjects: 0,
    gradedProjects: 0,
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects");
      const data = res.data.projects || [];
      setProjects(data);

      setStats({
        totalProjects: data.length,
        pendingReviews: data.filter((p) => p.status === "pending").length,
        approvedProjects: data.filter((p) => p.status === "approved").length,
        gradedProjects: data.filter((p) => p.grade && p.grade !== "").length,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { projects, loading, stats, refresh: fetchDashboard };
}