export const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("pt-BR");

export const initials = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export const canAccess = (role, feature) => {
  const access = {
    schedule_musico:    ["musico", "lider_musicos", "pastor"],
    schedule_obreiro:   ["obreiro", "lider_obreiros", "pastor"],
    schedule_educadora: ["educadora", "lider_infantil", "pastor"],
    schedule_circulo:   ["circulo_oracao", "lider_circulo", "pastor"],
    create_schedule:    ["lider_musicos", "lider_infantil", "lider_obreiros", "lider_circulo", "pastor"],
    create_fundraising: ["lider_missoes", "pastor"],
    admin:              ["pastor"],
  };
  return access[feature]?.includes(role) ?? false;
};

export const hasScheduleAccess = (role) =>
  ["musico","obreiro","educadora","circulo_oracao",
   "lider_musicos","lider_infantil","lider_obreiros","lider_circulo","pastor"].includes(role);
