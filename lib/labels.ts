/** Affichage public : « Atelier LSF » → « Atelier de bébé signes ». */
export function labelPrestation(label: string) {
  return label.replace(/atelier\s+lsf/gi, "Atelier de bébé signes");
}
