import { useMemo } from 'react';
import { useAppSelector } from '#/store/hooks';

function getTrialDaysLeft(plan: any): number | null {
  if (!plan) return null;
  if (typeof plan.trial_dias_restantes === 'number') return plan.trial_dias_restantes;
  if (typeof plan.dias_restantes_trial === 'number') return plan.dias_restantes_trial;
  if (typeof plan.trial_days_left === 'number') return plan.trial_days_left;
  return null;
}

export function TrialBanner() {
  const plan = useAppSelector((state) => state.tenant.plan as any);

  const daysLeft = useMemo(() => getTrialDaysLeft(plan), [plan]);

  if (daysLeft == null) return null;

  return (
    <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
      Tu periodo de prueba vence en {daysLeft} dias.
    </div>
  );
}
