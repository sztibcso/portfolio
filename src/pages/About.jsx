import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="background-default">
      <img
        src="/backgrounds/about.webp"
        alt="Background"
        className="background-image"
      />

      <div className="relative z-10 flex flex-col md:flex-row w-full min-h-screen px-4 py-20 gap-8 bg-black/75 backdrop-blur-sm">
        {/* Left side - fix block, with my photo and a little text */}
        <div className="md:w-1/3 w-full self-start flex flex-col items-center text-center md:sticky md:top-20">
          <div className="w-72 h-72 relative mb-6 border-[4px] border-white shadow-[6px_6px_0_#000] rounded-full overflow-hidden bg-black">
            <img
              src="/images/profile.jpg"
              alt="Tibcsó"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex flex-row justify-between">
            <Link
              to="/cv-dev"
              className="bg-green-600 text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
            >
              CV - DEV
            </Link>
            <Link
              to="/cv-mech"
              className="bg-green-600 text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
            >
              CV - Mech
            </Link>
          </div>

          <h2 className="text-3xl font-bold mb-4">Tibor Szalontai</h2>

          <p className="mb-3 px-4 text-sm leading-relaxed max-w-md">
            After several years as a mechanical engineer, I decided to shift
            gears and pursue my passion for frontend development — a field where
            I can express my creative side through both code and design.
          </p>
          <p className="mb-3 px-4 text-sm leading-relaxed max-w-md">
            I'm eager to learn, adapt quickly, and thrive in agile environments.
            I'm open-minded, a clear communicator, and I embrace challenges
            head-on.
          </p>
          <p className="mb-4 px-4 text-sm leading-relaxed max-w-md">
            If you're looking for a frontend developer who brings both
            creativity and precision to the table — let's connect!
          </p>
        </div>

        {/* Right side - CV  */}
        <div className="md:w-2/3 w-full">
          <div className="w-full max-h-[70vh] overflow-y-auto touch-auto overscroll-contain mb-5 pr-4 scroll-smooth">
            <section>
              <h3 className="text-xl font-semibold mb-2">IT Stack</h3>
              <p className="mb-1">
                <strong>Frontend:</strong> Angular (Signals, standalone
                components), React, TypeScript, JavaScript, RxJS
              </p>
              <p className="mb-1">
                <strong>UI & Styling:</strong> HTML5, CSS3, SCSS, Tailwind CSS,
                Figma
              </p>
              <p className="mb-1">
                <strong>Architecture:</strong> Component-based architecture,
                frontend modernization, refactoring
              </p>
              <p className="mb-1">
                <strong>Backend & APIs:</strong> Node.js, Express.js, Java,
                Spring Boot, REST APIs
              </p>
              <p className="mb-1">
                <strong>Tools & DevOps:</strong> Git, GitLab CI/CD, Docker,
                Webpack, Vite
              </p>
              <p className="mb-1">
                <strong>AI-assisted Development:</strong> LLM-assisted coding,
                debugging, testing and refactoring
              </p>
              <p className="mb-1">
                <strong>Practices & Tracking:</strong> Agile, Scrum, Clean Code,
                code reviews, Jira, Redmine
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2">
                Professional Experience
              </h3>
              <ul className="list-disc list-inside space-y-4">
                <li>
                  <strong>
                    PILLÉR NONPROFIT KFT – Frontend Developer (2024 –
                    currently):
                  </strong>
                  <br />
                  Leading the modernization of a legacy Angular application:
                  migrating it to Angular 22 as an independent, standalone app,
                  adopting Angular Signals, modernizing RxJS-based components
                  and rolling out a new UI design. Building and improving
                  features for enterprise applications of the Hungarian Tax and
                  Customs Administration (NAV), with a focus on WCAG
                  accessibility. Working closely with backend, UX/UI, project
                  management and DevOps colleagues, and using LLM-assisted
                  development for coding, debugging, testing and planning.
                </li>
                <li>
                  <strong>
                    PILLÉR NONPROFIT KFT – Tester / Backend Intern (2022 –
                    2024):
                  </strong>
                  <br />
                  Executed manual testing across platforms, managed validation
                  tasks, and solved test-related challenges with strong
                  analytical thinking. Collaborated effectively with teams to
                  minimize errors and improve product quality.
                </li>
                <li>
                  <strong>
                    BECTON DICKINSON HUNGARY KFT – CI Engineer (2021 – 2023):
                  </strong>
                  <br />
                  Introduced Lean-based structured operations, implemented a
                  recycling strategy yielding $400k+ annual savings, and
                  performed production data analysis to support optimization.
                </li>
                <li>
                  <strong>
                    BECTON DICKINSON HUNGARY KFT – Production Support Engineer
                    (2019 – 2021):
                  </strong>
                  <br />
                  Oversaw production line improvements and operational
                  troubleshooting, ensuring process efficiency and stability.
                </li>
                <li>
                  <strong>FLOWELL KFT – Project Engineer (2018 – 2019):</strong>
                  <br />
                  Managed industrial instrumentation projects, coordinated
                  implementation processes, and maintained quality standards.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2">Education</h3>
              <p className="mb-1">
                <strong>BSc in Mechanical Engineering (2013 – 2019)</strong> –
                Budapest University of Technology and Economics
                <br />
                Specialization: Process Engineering
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2">Other</h3>
              <p className="mb-1">
                <strong>Languages:</strong> Hungarian (native), English
                (professional proficiency)
              </p>
              <p className="mb-1">
                <strong>Hobbies:</strong> Proud father of two boys, Zen Bu Kan
                Kempo, Brazilian Jiu-Jitsu, former children’s coach
              </p>
              <p className="mb-1">
                <strong>Driver's License:</strong> Category B (since 2010)
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
