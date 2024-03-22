export interface IContinuousMetricInputs {
    confidence_level: number;
    power: number;
    baseline_cr: number;
    mde: number;
    absolute: boolean;
    arms: number;
    daily_interactions: number;
    two_tailed: boolean;
    equal_allocation: boolean;
    revenue_per_conversion: number;
    expected_uplift: number;
    allocations: Record<string, unknown>;
  }
  