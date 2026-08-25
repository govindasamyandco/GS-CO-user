/**
 * Master Packet / Bale Calculation Engine
 * Calculates required master shipping bales/sacks for mixed orders
 * based on bundle volume and cotton compression (Cf = 0.80)
 */
export function calculateMasterPacks(selectedProductIds, products, itemQuantities) {
  let totalCapacityPoints = 0;

  selectedProductIds.forEach((id) => {
    const prod = products.find((p) => p.id === id);
    const qty = itemQuantities[id] || 1;
    if (prod) {
      const bundlesPerPack = prod.bundlesPerPack || 8;
      const compressibility = prod.compressibility || 0.80;
      const basePointsPerUnit = (100 / bundlesPerPack) * compressibility;
      totalCapacityPoints += basePointsPerUnit * qty;
    }
  });

  const estPacks = Math.max(1, Math.ceil(totalCapacityPoints / 100));
  return {
    totalPoints: totalCapacityPoints,
    estPacks: selectedProductIds.length === 0 ? 0 : estPacks
  };
}
