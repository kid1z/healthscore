export function getHealthScoreColor(score: number): string {
  if (score >= 90) {
    return "text-emerald-500";
  }
  if (score >= 70) {
    return "text-green-500";
  }
  if (score >= 50) {
    return "text-yellow-500";
  }
  if (score >= 30) {
    return "text-orange-500";
  }
  return "text-red-500";
}

export function getHealthScoreGradient(score: number): string {
  if (score >= 90) {
    return "from-emerald-500 to-teal-400";
  }
  if (score >= 70) {
    return "from-green-500 to-emerald-400";
  }
  if (score >= 50) {
    return "from-yellow-500 to-amber-400";
  }
  if (score >= 30) {
    return "from-orange-500 to-amber-500";
  }
  return "from-red-500 to-rose-400";
}

export function getHealthScoreLabel(score: number): string {
  if (score >= 90) {
    return "Excellent";
  }
  if (score >= 70) {
    return "Good";
  }
  if (score >= 50) {
    return "Moderate";
  }
  if (score >= 30) {
    return "Below Average";
  }
  return "Poor";
}

export function getHealthScoreDescription(score: number): string {
  if (score >= 90) {
    return "This meal is exceptionally nutritious and well-balanced!";
  }
  if (score >= 70) {
    return "A healthy choice with good nutritional value.";
  }
  if (score >= 50) {
    return "This meal has some nutritional benefits but could be improved.";
  }
  if (score >= 30) {
    return "Consider adding more vegetables or reducing processed ingredients.";
  }
  return "This meal may be high in calories, sugar, or sodium. Try healthier alternatives.";
}

export function formatNumber(num: number, decimals = 1): string {
  return num.toFixed(decimals);
}

export function getProgressColor(score: number): string {
  if (score >= 90) {
    return "bg-emerald-500";
  }
  if (score >= 70) {
    return "bg-green-500";
  }
  if (score >= 50) {
    return "bg-yellow-500";
  }
  if (score >= 30) {
    return "bg-orange-500";
  }
  return "bg-red-500";
}
