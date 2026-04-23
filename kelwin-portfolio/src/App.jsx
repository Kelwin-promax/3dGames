import { useState } from 'react';
import { Scene3D } from './components/Scene3D';
import { PortfolioUI } from './components/PortfolioUI';

export default function App() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isControlsEnabled, setIsControlsEnabled] = useState(true); // New state to manage game controls

  return (
    <main className="relative w-screen h-screen bg-slate-950 overflow-hidden">
      <Scene3D
        onProjectHover={setHoveredProject}
        onProjectClick={setSelectedProject}
        isControlsEnabled={isControlsEnabled}
      />
      <PortfolioUI
        hoveredProject={hoveredProject}
        selectedProject={selectedProject}
        onCloseProject={() => setSelectedProject(null)}
        onToggleControls={setIsControlsEnabled}
      />
    </main>
  );
}
