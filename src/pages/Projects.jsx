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
    <div className="background-default">
      <img
        src="/backgrounds/undergroundDesktop.webp"
        alt="Background" 
        className="background-image"
      />
      <div className="flex flex-col items-center p-8 pt-20">
        <h2 className="text-4xl font-semibold">Projects</h2>

        {/* Desktop layout: 6 columns, middle 2 empty */}
        <div className="hidden md:grid grid-cols-6 gap-6 mt-8 w-full">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`col-span-1 ${index === 2 ? 'col-start-5' : ''}`}
            >
              <FlippableCard
                frontImage={project.frontImage}
                description={project.description}
                linkImage={project.linkImage}
                linkUrl={project.linkUrl}
              />
            </div>
          ))}
        </div>

        {/* Mobile layout: 2x2 grid */}
        <div className="md:hidden grid grid-cols-2 gap-4 mt-8 w-full">
          {projects.map((project) => (
            <div key={project.id} className="aspect-[2/3]">
              <FlippableCard
                frontImage={project.frontImage}
                description={project.description}
                linkImage={project.linkImage}
                linkUrl={project.linkUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
