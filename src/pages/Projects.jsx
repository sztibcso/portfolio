import React, { useEffect, useState } from "react";
import FlippableCard from "../components/FlippableCard";
import axios from "axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axios.get("https://portfolio-backend-two-lemon.vercel.app/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div
      className="background-default items-center p-8 font-pixel text-white min-h-screen"
      style={{ backgroundImage: "url('/backgrounds/undergroundDesktop.webp')" }}
    >
      <div className="flex flex-col items-center p-8 pt-20">
        <h2 className="text-4xl font-semibold">Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 mt-8 w-full">
          {projects.map((project) => (
            <FlippableCard
              key={project.id}
              frontImage={project.frontImage}
              description={project.description}
              linkImage={project.linkImage}
              linkUrl={project.linkUrl}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
