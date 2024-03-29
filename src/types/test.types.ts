export enum CalculationStatus {
  IDLE = "IDLE",
  CALC = "CALC",
  SAVED = "SAVED",
}

export enum TestStatus {
  INPO = "INPO",
  APPR = "APPR",
  CONC = "CONC",
}


export interface ITest {
    id: number; 
    user?: number; 
    name: string;
    arms: number;
    proportional_metric: boolean;
    description?: string;
    hypothesis?: string;
    primary_metric?: string;
    business_target?: string;
    confidence_level?: number;
    power?: number;
    baseline_conversion_rate?: number;
    baseline_kpi?: number;
    kpi_sd?: number;
    mde?: number;
    absolute?: boolean;
    daily_interactions?: number;
    expected_uplift?: number;
    equal_allocation?: boolean;
    two_tailed_test?: boolean;
    revenue_per_conversion?: number;
    total_sample_size?: number;
    sample_size_per_arm?: number;
    days_required?: number;
    weeks_required?: number;
    control_revenue?: number;
    test_revenue?: number;
    test_statistic?: number;
    ci_lower_bound?: number;
    ci_upper_bound?: number;
    disclaimer_note?: string;
    statistically_significant?: boolean;
    status?: TestStatus;
    integrity?: string;
    created_date: string; 
    modified_date: string;
  }
  