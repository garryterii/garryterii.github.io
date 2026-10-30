// descente.js — fonctions tests et méthodes de descente à un pas.
// Les calculs sont séparés du dessin : la page (OJS) et l'animation (p5) utilisent ces mêmes fonctions.

// ---------------------------------------------------------------- fonctions tests

// Quadratique f(x) = 1/2 <A x, x>, A de valeurs propres a, b, axes tournés d'un angle theta (radians).
// theta = 0 : f(x, y) = 1/2 (a x^2 + b y^2), la fonction du TD3.
export function quadratique(a, b, theta = 0) {
  const c = Math.cos(theta), s = Math.sin(theta);
  const A = [
    [a * c * c + b * s * s, (a - b) * c * s],
    [(a - b) * c * s, a * s * s + b * c * c],
  ];
  const L = Math.max(a, b), M = Math.min(a, b);
  return {
    nom: "quadratique",
    f: ([x, y]) => 0.5 * (A[0][0] * x * x + 2 * A[0][1] * x * y + A[1][1] * y * y),
    grad: ([x, y]) => [A[0][0] * x + A[0][1] * y, A[0][1] * x + A[1][1] * y],
    hess: () => A,
    fmin: 0,
    minimiseurs: [[0, 0]],
    A, L, M,
    kappa: L / M,
    domaine: { x: [-5, 5], y: [-3.5, 3.5] },
  };
}

// Rosenbrock modérée : f(x, y) = (1 - x)^2 + c (y - x^2)^2, minimum 0 en (1, 1). Non convexe.
export function rosenbrock(c = 10) {
  return {
    nom: "rosenbrock",
    f: ([x, y]) => (1 - x) ** 2 + c * (y - x * x) ** 2,
    grad: ([x, y]) => [-2 * (1 - x) - 4 * c * x * (y - x * x), 2 * c * (y - x * x)],
    hess: ([x, y]) => [
      [2 - 4 * c * (y - x * x) + 8 * c * x * x, -4 * c * x],
      [-4 * c * x, 2 * c],
    ],
    fmin: 0,
    minimiseurs: [[1, 1]],
    domaine: { x: [-2, 2], y: [-1, 3] },
  };
}

// Deux puits : f(x, y) = (x^2 - 1)^2 + 2 y^2, minima 0 en (-1, 0) et (1, 0), point selle en (0, 0).
export function deuxPuits() {
  return {
    nom: "deux-puits",
    f: ([x, y]) => (x * x - 1) ** 2 + 2 * y * y,
    grad: ([x, y]) => [4 * x * (x * x - 1), 4 * y],
    hess: ([x]) => [[12 * x * x - 4, 0], [0, 4]],
    fmin: 0,
    minimiseurs: [[-1, 0], [1, 0]],
    domaine: { x: [-2, 2], y: [-1.5, 1.5] },
  };
}

// ---------------------------------------------------------------- outils

const norme = (v) => Math.hypot(v[0], v[1]);
const prodScal = (u, v) => u[0] * v[0] + u[1] * v[1];
const axpy = (x, t, d) => [x[0] + t * d[0], x[1] + t * d[1]];

// Recherche linéaire exacte sur [0, tMax] par section dorée (fonctions non quadratiques).
function sectionDoree(phi, tMax, compteur, tol = 1e-10) {
  const r = (Math.sqrt(5) - 1) / 2;
  let a = 0, b = tMax;
  let c = b - r * (b - a), d = a + r * (b - a);
  let fc = phi(c), fd = phi(d);
  compteur.f += 2;
  while (b - a > tol * (1 + b)) {
    if (fc < fd) { b = d; d = c; fd = fc; c = b - r * (b - a); fc = phi(c); }
    else { a = c; c = d; fc = fd; d = a + r * (b - a); fd = phi(d); }
    compteur.f += 1;
  }
  return (a + b) / 2;
}

// ---------------------------------------------------------------- choix du pas

// Chaque règle renvoie alpha_k pour la direction d_k = -grad f(x_k), et compte ses évaluations.
export const regles = {
  // x_{k+1} = x_k - alpha grad f(x_k), alpha fixé.
  "pas fixe": (pb, x, g, opts, compteur) => opts.alpha,

  // alpha_k minimise t -> f(x_k - t grad f(x_k)).
  "pas optimal": (pb, x, g, opts, compteur) => {
    if (pb.A) {
      // quadratique : formule exacte alpha_k = |g|^2 / <A g, g>
      const Ag = [pb.A[0][0] * g[0] + pb.A[0][1] * g[1], pb.A[1][0] * g[0] + pb.A[1][1] * g[1]];
      return prodScal(g, g) / prodScal(Ag, g);
    }
    const d = [-g[0], -g[1]];
    const phi = (t) => pb.f(axpy(x, t, d));
    // encadrement du premier minimum le long de la demi-droite : on double t tant que f décroît encore
    let t = 1e-3, ft = phi(t);
    compteur.f += 1;
    while (t < 1e6) {
      const f2 = phi(2 * t);
      compteur.f += 1;
      if (f2 >= ft) break;
      t *= 2; ft = f2;
    }
    const tMax = 2 * t;
    return sectionDoree(phi, tMax, compteur);
  },

  // Armijo par rebroussement : alpha = alpha0, puis alpha <- rho alpha
  // tant que f(x - alpha g) > f(x) - c alpha |g|^2.
  "Armijo": (pb, x, g, opts, compteur) => {
    const { alpha0 = 1, rho = 0.5, c = 1e-4 } = opts;
    const fx = pb.f(x), g2 = prodScal(g, g);
    compteur.f += 1;
    let t = alpha0;
    for (let i = 0; i < 60; i++) {
      compteur.f += 1;
      if (pb.f(axpy(x, -t, g)) <= fx - c * t * g2) return t;
      t *= rho;
    }
    return t;
  },
};

// ---------------------------------------------------------------- algorithmes

// Méthode de descente à un pas : x_{k+1} = x_k + alpha_k d_k.
// methode : "pas fixe" | "pas optimal" | "Armijo" | "Newton"
// Renvoie la suite des itérés, les erreurs et le bilan.
export function descente(pb, x0, methode, opts = {}) {
  const { maxIter = 200, tol = 1e-8 } = opts;
  const compteur = { f: 0, grad: 0, hess: 0 };
  let x = [...x0];
  const iteres = [x];
  let statut = "itérations max";
  for (let k = 0; k < maxIter; k++) {
    const g = pb.grad(x);
    compteur.grad += 1;
    if (norme(g) < tol) { statut = "convergé"; break; }
    let xn;
    if (methode === "Newton") {
      const H = pb.hess(x);
      compteur.hess += 1;
      const det = H[0][0] * H[1][1] - H[0][1] * H[1][0];
      if (Math.abs(det) < 1e-14) { statut = "hessienne singulière"; break; }
      const dx = (H[1][1] * g[0] - H[0][1] * g[1]) / det;
      const dy = (-H[1][0] * g[0] + H[0][0] * g[1]) / det;
      xn = [x[0] - dx, x[1] - dy];
    } else {
      const alpha = regles[methode](pb, x, g, opts, compteur);
      xn = axpy(x, -alpha, g);
    }
    if (!Number.isFinite(xn[0]) || !Number.isFinite(xn[1]) || norme(xn) > 1e8) {
      statut = "divergé";
      iteres.push(xn);
      break;
    }
    x = xn;
    iteres.push(x);
  }
  if (statut === "itérations max" && norme(pb.grad(x)) < tol) statut = "convergé";
  // gradient nul mais valeur au-dessus du minimum : point critique qui n'est pas un minimiseur (selle, maximum)
  if (statut === "convergé" && pb.f(x) - pb.fmin > 1e-6) statut = "point critique non minimal";
  const erreurs = iteres.map((xi, k) => ({
    k,
    erreur: Math.max(pb.f(xi) - pb.fmin, 0),
    gradient: norme(pb.grad(xi)),
  }));
  return {
    methode,
    iteres,
    erreurs,
    statut,
    iterations: iteres.length - 1,
    evaluations: compteur,
    xFinal: x,
    erreurFinale: Math.max(pb.f(x) - pb.fmin, 0),
  };
}

// ---------------------------------------------------------------- théorie (quadratiques)

// Pas fixe sur une quadratique : x_{k+1} - x* = (I - alpha A)(x_k - x*),
// taux de contraction rho(alpha) = max(|1 - alpha M|, |1 - alpha L|).
export const tauxPasFixe = (alpha, L, M) => Math.max(Math.abs(1 - alpha * M), Math.abs(1 - alpha * L));

// Meilleur pas fixe alpha* = 2 / (L + M), taux (kappa - 1) / (kappa + 1).
export const pasFixeOptimal = (L, M) => 2 / (L + M);

// Pas optimal (Kantorovich) : f(x_{k+1}) - f* <= ((kappa - 1)/(kappa + 1))^2 (f(x_k) - f*).
export const tauxPasOptimal = (kappa) => ((kappa - 1) / (kappa + 1)) ** 2;
