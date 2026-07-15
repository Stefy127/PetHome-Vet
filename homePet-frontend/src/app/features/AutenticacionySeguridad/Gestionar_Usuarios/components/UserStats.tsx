interface UserStatsProps {
  totalUsuarios: number;
  usuariosActivos: number;
  administradores: number;
}

export const UserStats = ({
  totalUsuarios,
  usuariosActivos,
  administradores,
}: UserStatsProps) => {
  const cards = [
    { title: 'Total usuarios', value: totalUsuarios },
    { title: 'Usuarios activos', value: usuariosActivos },
    { title: 'Administradores', value: administradores },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-[#7C3AED] bg-[#7C3AED] p-5 shadow-sm"
        >
         <p className="text-sm text-white/80">{card.title}</p>
         <h3 className="mt-2 text-4xl font-bold text-white">{card.value}</h3>
        </div>
      ))}
    </div>
  );
};