import React, { useEffect } from 'react';

export function PortfolioUI({ hoveredProject, selectedProject, onCloseProject, onToggleControls }) {
  useEffect(() => {
    onToggleControls(!selectedProject);
  }, [selectedProject, onToggleControls]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-12 overflow-hidden">
      {/* CROSSHAIR */}
      {!selectedProject && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40">
          <div className="w-1 h-1 bg-white rounded-full" />
          <div className="absolute w-4 h-[1px] bg-white -left-[7px] top-1/2" />
          <div className="absolute h-4 w-[1px] bg-white left-1/2 -top-[7px]" />
        </div>
      )}

      <div />

      {/* HUD BOTTOM */}
      <div className="w-full max-w-xl flex flex-col items-center gap-8">
        {hoveredProject && !selectedProject && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-xl text-white w-full shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
            <span className="text-purple-400 text-[10px] font-bold uppercase tracking-widest">Projeto Detectado</span>
            <h2 className="text-2xl font-black mt-1 uppercase italic">{hoveredProject.title}</h2>
            <p className="text-gray-400 text-sm mt-2">{hoveredProject.description}</p>
          </div>
        )}

        {!selectedProject && (
          <div className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-medium">
            [W,A,S,D] Mover • [CLICK] Inspecionar • [ESC] Sair
          </div>
        )}
      </div>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md pointer-events-auto flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 p-10 rounded-3xl max-w-2xl w-full text-white shadow-2xl">
            <h2 className="text-5xl font-black mb-6 tracking-tighter text-purple-500 uppercase italic">
              {selectedProject.title}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              {selectedProject.description}
            </p>
            <button
              onClick={onCloseProject}
              className="px-10 py-4 bg-purple-600 hover:bg-purple-500 rounded-full transition-all font-black uppercase tracking-widest text-sm"
            >
              Voltar ao Mundo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}