// Íconos SVG simples (trazo 24x24, estilo Heroicons). Sirven en componentes de servidor y de cliente.

export const iconos = {
  resumen: "M3 12 12 3l9 9M5 10v10h5v-6h4v6h5V10",
  inventario: "M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8",
  ventas: "M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  fiados: "M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6V3ZM6 3v18M10 8h5M10 12h5",
  alerta: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  dinero: "M2 7h20v10H2V7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 7v10M18 7v10",
  check: "M20 6 9 17l-5-5",
  salir: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  menu: "M4 6h16M4 12h16M4 18h16",
  cerrar: "M18 6 6 18M6 6l12 12",
  flecha: "M5 12h14M13 6l6 6-6 6",
  calendario: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
};

export function Icono({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
