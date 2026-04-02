class EnergyHarvester:
    def harvest(self, env) -> float:
        airflow = env.get("airflow", 0.0)
        temp_grad = env.get("temperature_gradient", 0.0)
        vibration = env.get("vibration_level", 0.0)
        rf = env.get("rf_density", 0.0)

        return 0.3 * airflow + 0.2 * temp_grad + 0.3 * vibration + 0.2 * rf
