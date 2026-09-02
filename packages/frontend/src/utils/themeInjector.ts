export function injectThemeColors(colors: Record<string, string>) {
  const root = document.documentElement;
  
  if (!colors) return;
  
  Object.keys(colors).forEach(shade => {
    root.style.setProperty(`--brand-${shade}`, colors[shade]);
  });
}

export function resetThemeColors() {
  const root = document.documentElement;
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700'];
  
  shades.forEach(shade => {
    root.style.removeProperty(`--brand-${shade}`);
  });
}
